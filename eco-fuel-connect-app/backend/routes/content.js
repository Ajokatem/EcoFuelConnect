const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Apply security middleware
router.use(helmet());

// Rate limiting
const contentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

router.use(contentLimiter);

// In-memory storage for demo (replace with actual database)
let posts = [
  {
    _id: '1',
    title: 'Welcome to EcoFuel Connect',
    content: 'EcoFuel Connect is revolutionizing waste management and clean energy in South Sudan...',
    category: 'Getting Started',
    tags: ['welcome', 'introduction'],
    author: { name: 'Admin' },
    viewCount: 45,
    featured: true,
    summary: 'Learn about EcoFuel Connect and how it transforms organic waste into clean energy...',
    createdAt: new Date().toISOString()
  }
];

// Validation middleware for posts
const validatePost = [
  body('title').trim().isLength({ min: 1, max: 200 }).escape().withMessage('Title is required and must be less than 200 characters'),
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('category').trim().isLength({ min: 1 }).escape().withMessage('Category is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean')
];

// GET /api/content - Get all posts
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let filteredPosts = [...posts];
    
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    res.json({ 
      success: true,
      posts: filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch posts' 
    });
  }
});

// POST /api/content - Create new post
router.post('/', validatePost, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { title, content, category, tags, featured, author, summary } = req.body;
    
    const newPost = {
      _id: Date.now().toString(),
      title,
      content,
      category,
      tags: tags || [],
      author: author || { name: 'Admin' },
      viewCount: 0,
      featured: featured || false,
      summary: summary || content.substring(0, 150) + '...',
      createdAt: new Date().toISOString()
    };

    posts.unshift(newPost);
    
    console.log('New post created:', newPost.title);

    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create post' 
    });
  }
});

// GET /api/content/:id - Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = posts.find(p => p._id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }
    
    // Increment view count
    post.viewCount = (post.viewCount || 0) + 1;
    
    res.json({ 
      success: true,
      post 
    });
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch post' 
    });
  }
});

// PUT /api/content/:id - Update post
router.put('/:id', validatePost, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const postIndex = posts.findIndex(p => p._id === req.params.id);
    
    if (postIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    const { title, content, category, tags, featured, summary, published, imageUrl } = req.body;
    
    posts[postIndex] = {
      ...posts[postIndex],
      title,
      content,
      category,
      tags: tags || [],
      featured: featured || false,
      summary: summary || content.substring(0, 150) + '...',
      published: published || false,
      imageUrl: imageUrl || '',
      updatedAt: new Date().toISOString()
    };
    
    console.log('Post updated:', posts[postIndex].title);

    res.json(posts[postIndex]);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update post' 
    });
  }
});

// DELETE /api/content/:id - Delete post
router.delete('/:id', async (req, res) => {
  try {
    const postIndex = posts.findIndex(p => p._id === req.params.id);
    
    if (postIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    const deletedPost = posts.splice(postIndex, 1)[0];
    
    console.log('Post deleted:', deletedPost.title);

    res.json({ 
      success: true,
      message: 'Post deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete post' 
    });
  }
});

module.exports = router;
