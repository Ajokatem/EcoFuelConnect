const express = require('express');
const router = express.Router();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Apply security middleware
router.use(helmet());

// Rate limiting
const courseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

router.use(courseLimiter);

// Sample courses data
const courses = [
  {
    _id: '1',
    title: 'Introduction to Biogas Technology',
    category: 'Biogas Basics',
    level: 'Beginner',
    duration: 45,
    price: 0,
    enrollmentCount: 234,
    shortDescription: 'Learn the fundamentals of biogas production and its applications in South Sudan.',
    thumbnailUrl: '/images/biogas-course.jpg',
    tags: ['biogas', 'renewable energy', 'basics']
  },
  {
    _id: '2',
    title: 'Organic Waste Management Systems',
    category: 'Waste Management',
    level: 'Intermediate',
    duration: 60,
    price: 0,
    enrollmentCount: 156,
    shortDescription: 'Master the techniques for efficient organic waste collection and processing.',
    thumbnailUrl: '/images/waste-management-course.jpg',
    tags: ['waste management', 'organic waste', 'systems']
  },
  {
    _id: '3',
    title: 'Environmental Impact Assessment',
    category: 'Environment & Health',
    level: 'Advanced',
    duration: 90,
    price: 0,
    enrollmentCount: 89,
    shortDescription: 'Understand and measure the environmental benefits of biogas projects.',
    thumbnailUrl: '/images/environmental-course.jpg',
    tags: ['environment', 'impact', 'assessment']
  }
];

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let filteredCourses = [...courses];
    
    if (category && category !== 'all') {
      filteredCourses = filteredCourses.filter(course => course.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.shortDescription.toLowerCase().includes(searchLower) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    res.json({ 
      success: true,
      courses: filteredCourses
    });
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch courses' 
    });
  }
});

// POST /api/courses/:id/enroll - Enroll in a course
router.post('/:id/enroll', async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = courses.find(c => c._id === courseId);
    
    if (!course) {
      return res.status(404).json({ 
        success: false,
        error: 'Course not found' 
      });
    }
    
    // Simulate enrollment
    course.enrollmentCount += 1;
    
    res.json({ 
      success: true,
      message: 'Successfully enrolled in course!',
      course: course
    });
  } catch (err) {
    console.error('Error enrolling in course:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to enroll in course' 
    });
  }
});

// GET /api/courses/:id - Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = courses.find(c => c._id === req.params.id);
    
    if (!course) {
      return res.status(404).json({ 
        success: false,
        error: 'Course not found' 
      });
    }
    
    res.json({ 
      success: true,
      course 
    });
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch course' 
    });
  }
});

module.exports = router;