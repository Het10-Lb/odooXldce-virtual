const prisma = require('../config/prisma');
const {
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema,
  createCommentSchema,
} = require('../validators/communityValidator');

/**
 * Helper to format post output with liked status for current user
 */
const formatPost = (post, currentUserId) => {
  const isLikedByCurrentUser = currentUserId
    ? post.likes?.some((like) => like.userId === currentUserId)
    : false;

  const { likes, ...postData } = post;
  return {
    ...postData,
    isLikedByCurrentUser,
  };
};

/**
 * @desc    Get community experience feed with search, filter, grouping & sorting
 * @route   GET /api/community/posts
 * @access  Public / Optional Auth
 */
const getCommunityPosts = async (req, res, next) => {
  try {
    const currentUserId = req.user?.id;
    const query = getPostsQuerySchema.parse(req.query);
    const { search, cityId, region, category, hasTripLinked, groupBy, sortBy, page, limit } = query;

    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { city: { name: { contains: search, mode: 'insensitive' } } },
        { city: { country: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (cityId) {
      where.cityId = cityId;
    }

    if (region) {
      where.city = {
        region: { equals: region, mode: 'insensitive' },
      };
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (hasTripLinked !== undefined) {
      where.tripId = hasTripLinked ? { not: null } : null;
    }

    let orderBy = [{ createdAt: 'desc' }];
    if (sortBy === 'most_liked') {
      orderBy = [{ likesCount: 'desc' }, { createdAt: 'desc' }];
    } else if (sortBy === 'trending') {
      orderBy = [{ likesCount: 'desc' }, { commentsCount: 'desc' }, { createdAt: 'desc' }];
    }

    const postInclude = {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          photoUrl: true,
          city: true,
          country: true,
        },
      },
      city: true,
      trip: {
        select: {
          id: true,
          name: true,
          status: true,
          coverPhotoUrl: true,
          startDate: true,
          endDate: true,
          isPublic: true,
        },
      },
      likes: currentUserId
        ? {
            where: { userId: currentUserId },
            select: { userId: true },
          }
        : false,
    };

    if (groupBy !== 'none') {
      const rawPosts = await prisma.communityPost.findMany({
        where,
        orderBy,
        include: postInclude,
      });

      const formattedPosts = rawPosts.map((p) => formatPost(p, currentUserId));

      if (groupBy === 'city') {
        const groupedByCity = {};
        formattedPosts.forEach((post) => {
          const cityKey = post.city ? `${post.city.name}, ${post.city.country}` : 'General / Global';
          if (!groupedByCity[cityKey]) groupedByCity[cityKey] = [];
          groupedByCity[cityKey].push(post);
        });

        return res.status(200).json({
          success: true,
          data: {
            groupBy: 'city',
            total: formattedPosts.length,
            groups: groupedByCity,
          },
        });
      }

      if (groupBy === 'category') {
        const groupedByCategory = {};
        formattedPosts.forEach((post) => {
          const catKey = post.category || 'General';
          if (!groupedByCategory[catKey]) groupedByCategory[catKey] = [];
          groupedByCategory[catKey].push(post);
        });

        return res.status(200).json({
          success: true,
          data: {
            groupBy: 'category',
            total: formattedPosts.length,
            groups: groupedByCategory,
          },
        });
      }
    }

    const skip = (page - 1) * limit;

    const [rawPosts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: postInclude,
      }),
      prisma.communityPost.count({ where }),
    ]);

    const formattedPosts = rawPosts.map((p) => formatPost(p, currentUserId));
    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      data: {
        groupBy: 'none',
        posts: formattedPosts,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed community post with comments & linked trip
 * @route   GET /api/community/posts/:id
 * @access  Public / Optional Auth
 */
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    const post = await prisma.communityPost.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
            city: true,
            country: true,
          },
        },
        city: true,
        trip: {
          include: {
            sections: {
              orderBy: { orderIndex: 'asc' },
              include: { city: true },
            },
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photoUrl: true,
              },
            },
          },
        },
        likes: currentUserId
          ? {
              where: { userId: currentUserId },
              select: { userId: true },
            }
          : false,
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Community post not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        post: formatPost(post, currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new community experience post
 * @route   POST /api/community/posts
 * @access  Private (Protected by verifyToken)
 */
const createPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const validatedData = createPostSchema.parse(req.body);
    const { title, content, category, cityId, tripId, images } = validatedData;

    // Verify trip ownership if tripId passed
    if (tripId) {
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: 'Linked trip not found.',
        });
      }
    }

    const newPost = await prisma.communityPost.create({
      data: {
        userId,
        title,
        content,
        category: category || 'General',
        cityId: cityId || null,
        tripId: tripId || null,
        images: images || [],
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
        city: true,
        trip: {
          select: { id: true, name: true, coverPhotoUrl: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Community post published successfully.',
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a community post
 * @route   PUT /api/community/posts/:id
 * @access  Private (Protected by verifyToken)
 */
const updatePost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const validatedData = updatePostSchema.parse(req.body);

    const post = await prisma.communityPost.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Community post not found.',
      });
    }

    if (post.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own posts.',
      });
    }

    const updatedPost = await prisma.communityPost.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, photoUrl: true },
        },
        city: true,
        trip: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
      data: {
        post: updatedPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a community post
 * @route   DELETE /api/community/posts/:id
 * @access  Private (Protected by verifyToken)
 */
const deletePost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const post = await prisma.communityPost.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Community post not found.',
      });
    }

    if (post.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own posts.',
      });
    }

    await prisma.communityPost.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Community post deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle Like / Unlike on a community post (Atomic)
 * @route   POST /api/community/posts/:id/like
 * @access  Private (Protected by verifyToken)
 */
const toggleLike = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: postId } = req.params;

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    // Atomic transaction for like toggle
    const result = await prisma.$transaction(async (tx) => {
      const existingLike = await tx.postLike.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (existingLike) {
        // Unlike post
        await tx.postLike.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });

        const updatedPost = await tx.communityPost.update({
          where: { id: postId },
          data: {
            likesCount: { decrement: 1 },
          },
          select: { likesCount: true },
        });

        return { isLiked: false, likesCount: Math.max(0, updatedPost.likesCount) };
      } else {
        // Like post
        await tx.postLike.create({
          data: {
            userId,
            postId,
          },
        });

        const updatedPost = await tx.communityPost.update({
          where: { id: postId },
          data: {
            likesCount: { increment: 1 },
          },
          select: { likesCount: true },
        });

        return { isLiked: true, likesCount: updatedPost.likesCount };
      }
    });

    return res.status(200).json({
      success: true,
      message: result.isLiked ? 'Post liked.' : 'Post unliked.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a comment to a community post
 * @route   POST /api/community/posts/:id/comments
 * @access  Private (Protected by verifyToken)
 */
const addComment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: postId } = req.params;
    const { content } = createCommentSchema.parse(req.body);

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    const [newComment] = await prisma.$transaction([
      prisma.postComment.create({
        data: {
          postId,
          userId,
          content,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              photoUrl: true,
            },
          },
        },
      }),
      prisma.communityPost.update({
        where: { id: postId },
        data: {
          commentsCount: { increment: 1 },
        },
      }),
    ]);

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      data: {
        comment: newComment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    "Copy Trip" Integration: Clone linked trip from post to current user's profile
 * @route   POST /api/community/posts/:id/clone-trip
 * @access  Private (Protected by verifyToken)
 */
const cloneTripFromPost = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const { id: postId } = req.params;

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        trip: {
          include: {
            sections: {
              orderBy: { orderIndex: 'asc' },
              include: {
                items: {
                  orderBy: { orderIndex: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!post || !post.trip) {
      return res.status(404).json({
        success: false,
        message: 'No trip linked to this community post.',
      });
    }

    const sourceTrip = post.trip;

    // Check if trip is public or owned
    if (!sourceTrip.isPublic && sourceTrip.userId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Cannot copy a private trip.',
      });
    }

    // Clone trip, sections, and items for the current user
    const clonedTrip = await prisma.$transaction(async (tx) => {
      const newTrip = await tx.trip.create({
        data: {
          userId: currentUserId,
          name: `Copy of ${sourceTrip.name}`,
          description: sourceTrip.description,
          coverPhotoUrl: sourceTrip.coverPhotoUrl,
          startDate: sourceTrip.startDate,
          endDate: sourceTrip.endDate,
          status: 'UPCOMING',
          totalBudget: sourceTrip.totalBudget,
          isPublic: false,
        },
      });

      for (const section of sourceTrip.sections) {
        const newSection = await tx.tripSection.create({
          data: {
            tripId: newTrip.id,
            cityId: section.cityId,
            sectionTitle: section.sectionTitle,
            startDate: section.startDate,
            endDate: section.endDate,
            budgetAllocated: section.budgetAllocated,
            description: section.description,
            orderIndex: section.orderIndex,
          },
        });

        if (section.items && section.items.length > 0) {
          await tx.itineraryItem.createMany({
            data: section.items.map((item) => ({
              sectionId: newSection.id,
              activityId: item.activityId,
              title: item.title,
              type: item.type,
              startTime: item.startTime,
              endTime: item.endTime,
              cost: item.cost,
              orderIndex: item.orderIndex,
              notes: item.notes,
            })),
          });
        }
      }

      return await tx.trip.findUnique({
        where: { id: newTrip.id },
        include: {
          sections: {
            include: { city: true, items: true },
          },
        },
      });
    });

    return res.status(201).json({
      success: true,
      message: `Trip "${sourceTrip.name}" cloned successfully to your profile!`,
      data: {
        clonedTrip,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommunityPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  cloneTripFromPost,
};
