import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Form,
  Badge,
  Spinner,
  Modal,
  Alert,
  Dropdown,
  DropdownButton
} from "react-bootstrap";
import { useHistory } from "react-router-dom";

function EducationalContent() {
  const history = useHistory();
  
  // State management
  const [posts, setPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [enrollingCourse, setEnrollingCourse] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const categories = ['all', 'Biogas Basics', 'Waste Management', 'Environment & Health', 'Community Impact', 'Innovation', 'Getting Started'];

  const educationalTopics = [
    {
      id: 1,
      title: "Understanding Biogas",
      description: "Explore how biogas is produced from organic waste and how it serves as a sustainable source of clean energy tailored for South Sudan.",
      icon: "nc-icon nc-bulb-63",
      category: "Biogas Basics"
    },
    {
      id: 2,
      title: "Effective Organic Waste Recycling",
      description: "Best practices for collecting and managing organic waste from markets, slaughterhouses, and restaurants to enhance biogas production.",
      icon: "nc-icon nc-world-2",
      category: "Waste Management"
    },
    {
      id: 3,
      title: "Health and Environmental Benefits",
      description: "Understand how biogas reduces environmental pollution, carbon footprint, and contributes to community health improvements.",
      icon: "nc-icon nc-leaf",
      category: "Environment & Health"
    },
    {
      id: 4,
      title: "Community Empowerment through Biogas",
      description: "How the EcoFuel Connect project enhances education, economic opportunities, and hygiene awareness in South Sudanese communities.",
      icon: "nc-icon nc-single-02",
      category: "Community Impact"
    },
    {
      id: 5,
      title: "Technology and Innovation in Biogas",
      description: "Discover the modern biogas technologies and digital tools implemented by EcoFuel Connect to facilitate efficient waste-to-energy processes.",
      icon: "nc-icon nc-settings",
      category: "Innovation"
    },
    {
      id: 6,
      title: "Getting Involved",
      description: "Learn how farmers, schools, and community members can participate in organic waste logging and clean fuel request through EcoFuel Connect.",
      icon: "nc-icon nc-spaceship",
      category: "Getting Started"
    },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      "Biogas Basics": "#25805a",
      "Waste Management": "#1e6b47",
      "Environment & Health": "#2d9467",
      "Community Impact": "#1e6b47",
      "Innovation": "#25805a",
      "Getting Started": "#2d9467"
    };
    return colors[category] || "#25805a";
  };

  // API Functions
  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/content?category=${selectedCategory}&search=${searchTerm}`);
      if (!response.ok) {
        setPosts([]);
        return;
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setPosts([]);
        return;
      }
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching content:', error.message);
      setPosts([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`/api/courses?category=${selectedCategory}&search=${searchTerm}`);
      if (!response.ok) {
        setCourses([]);
        return;
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setCourses([]);
        return;
      }
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error.message);
      setCourses([]);
    }
  };

  const enrollInCourse = async (courseId) => {
    try {
      setEnrollingCourse(courseId);
      const token = localStorage.getItem('token');
      
      if (!token) {
        showAlert('Please login to enroll in courses', 'warning');
        history.push('/admin/login');
        return;
      }

      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Successfully enrolled in course!', 'success');
        // Navigate to course or learning dashboard
        history.push(`/admin/course/${courseId}`);
      } else {
        showAlert(data.message || 'Failed to enroll in course', 'danger');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      showAlert('Error enrolling in course', 'danger');
    } finally {
      setEnrollingCourse(null);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleLearnMore = (topic) => {
    history.push(`/admin/educational-detail/${topic.id}`);
  };
  
  const getLocalEducationalContent = (topicId) => {
    const localContent = {
      1: {
        title: "Understanding Biogas Technology",
        content: `# Understanding Biogas Technology

## What is Biogas?

Biogas is a renewable energy source produced through anaerobic digestion of organic matter. It consists primarily of methane (50-70%) and carbon dioxide (30-40%), making it an excellent clean fuel alternative.

## How Biogas Works

1. **Anaerobic Digestion**: Organic materials decompose without oxygen
2. **Methane Production**: Bacteria break down waste into biogas
3. **Gas Collection**: Biogas is captured and stored for use
4. **Clean Burning**: Burns cleanly for cooking, heating, and electricity

## Benefits for Communities

- **Clean Energy**: Reduces dependence on wood fuel and charcoal
- **Waste Management**: Converts organic waste into useful energy
- **Health Benefits**: Reduces indoor air pollution
- **Economic Opportunities**: Creates jobs and income sources
- **Environmental Impact**: Reduces greenhouse gas emissions

## Applications

- Cooking fuel for households and schools
- Heating for buildings and greenhouses
- Electricity generation for communities
- Vehicle fuel (when upgraded to biomethane)

## Getting Started

1. Assess organic waste availability
2. Choose appropriate digester size
3. Install biogas system
4. Train users on operation and maintenance
5. Monitor performance and optimize

*Learn more about biogas technology and its applications in sustainable development.*`
      },
      2: {
        title: "Organic Waste Management",
        content: `# Organic Waste Management

## Overview

Organic waste management involves the systematic collection, processing, and conversion of biodegradable materials into valuable resources like compost, biogas, and fertilizer.

## Types of Organic Waste

### Kitchen Waste
- Vegetable peels and scraps
- Fruit waste and cores
- Food preparation leftovers
- Expired food items

### Agricultural Waste
- Crop residues and stalks
- Animal manure
- Harvest waste
- Pruning materials

### Market Waste
- Spoiled vegetables and fruits
- Organic packaging materials
- Food vendor waste

## Collection Strategies

1. **Source Separation**: Separate organic waste at the point of generation
2. **Regular Collection**: Establish consistent pickup schedules
3. **Proper Storage**: Use appropriate containers to prevent odors
4. **Quality Control**: Remove non-organic contaminants

## Processing Methods

### Composting
- Aerobic decomposition process
- Produces nutrient-rich soil amendment
- Requires proper moisture and aeration

### Biogas Production
- Anaerobic digestion in sealed containers
- Generates methane for energy use
- Produces liquid fertilizer as byproduct

### Vermicomposting
- Uses earthworms to break down organic matter
- Creates high-quality compost
- Suitable for small-scale operations

## Benefits

- Reduces landfill waste
- Prevents methane emissions
- Creates valuable products
- Improves soil health
- Generates income opportunities

*Effective organic waste management is essential for sustainable communities.*`
      },
      3: {
        title: "Environmental Impact & Health Benefits",
        content: `# Environmental Impact & Health Benefits

## Environmental Benefits

### Climate Change Mitigation
- **Reduced Methane Emissions**: Prevents methane release from decomposing waste
- **Carbon Sequestration**: Biogas slurry improves soil carbon storage
- **Fossil Fuel Replacement**: Reduces dependence on non-renewable energy
- **Deforestation Prevention**: Decreases pressure on forests for firewood

### Ecosystem Protection
- **Water Quality**: Prevents organic waste from contaminating water sources
- **Soil Health**: Biogas slurry acts as organic fertilizer
- **Biodiversity**: Protects habitats from degradation
- **Air Quality**: Reduces smoke from burning waste

## Health Benefits

### Indoor Air Quality
- **Smoke Reduction**: Biogas burns cleanly without harmful smoke
- **Respiratory Health**: Decreases lung problems from wood smoke
- **Eye Health**: Eliminates irritation from cooking fires
- **Cardiovascular Benefits**: Reduces exposure to particulate matter

### Community Health
- **Disease Prevention**: Proper waste management reduces disease vectors
- **Sanitation**: Improves overall community cleanliness
- **Nutrition**: Better food storage and preparation conditions
- **Safety**: Reduces accidents from open fires

### Women's Health
- **Reduced Exposure**: Less time spent around smoky cooking fires
- **Time Savings**: More efficient cooking methods
- **Physical Health**: Less strain from collecting firewood
- **Empowerment**: Opportunities for income generation

## Economic Impact

- **Healthcare Savings**: Reduced medical expenses
- **Fuel Savings**: Lower costs for cooking fuel
- **Agricultural Benefits**: Free organic fertilizer
- **Income Generation**: New business opportunities

## Measuring Impact

- Carbon footprint reduction calculations
- Health outcome monitoring
- Economic benefit assessments
- Environmental quality indicators

*Biogas technology provides measurable benefits for health, environment, and economy.*`
      },
      4: {
        title: "Community Empowerment",
        content: `# Community Empowerment through Biogas

## Educational Opportunities

### Technical Skills
- **System Installation**: Learn biogas digester construction
- **Maintenance**: Develop troubleshooting and repair skills
- **Quality Control**: Understand gas production optimization
- **Safety Training**: Master proper handling procedures

### Business Skills
- **Entrepreneurship**: Start waste collection businesses
- **Financial Management**: Track costs and revenues
- **Marketing**: Promote biogas benefits to communities
- **Customer Service**: Build relationships with clients

## Economic Empowerment

### Income Generation
- **Waste Collection Services**: Earn from collecting organic waste
- **Biogas Sales**: Sell gas to households and businesses
- **Fertilizer Sales**: Market biogas slurry to farmers
- **Installation Services**: Provide system setup and maintenance

### Cost Savings
- **Fuel Expenses**: Reduce spending on cooking fuel
- **Fertilizer Costs**: Use free biogas slurry for crops
- **Healthcare**: Lower medical expenses from improved air quality
- **Time Savings**: More efficient cooking and farming

## Social Benefits

### Community Organization
- **Cooperatives**: Form groups for shared resources
- **Knowledge Sharing**: Learn from each other's experiences
- **Collective Action**: Work together on common goals
- **Leadership Development**: Build management skills

### Gender Equality
- **Women's Participation**: Include women in technical training
- **Leadership Roles**: Support women in management positions
- **Economic Independence**: Create income opportunities for women
- **Health Benefits**: Reduce women's exposure to cooking smoke

## Capacity Building

### Training Programs
- Technical workshops on biogas systems
- Business development courses
- Financial literacy training
- Leadership and management skills

### Support Systems
- Mentorship programs
- Peer learning networks
- Technical assistance
- Access to financing

*Community empowerment ensures sustainable adoption and long-term success of biogas projects.*`
      },
      5: {
        title: "Technology & Innovation",
        content: `# Technology & Innovation in Biogas

## Digester Technologies

### Fixed Dome Digesters
- **Design**: Underground concrete or brick construction
- **Advantages**: Durable, long-lasting, space-efficient
- **Best For**: Permanent installations, larger communities
- **Maintenance**: Low maintenance requirements

### Floating Drum Digesters
- **Design**: Above-ground with movable gas holder
- **Advantages**: Visible gas storage, easier maintenance
- **Best For**: Demonstration projects, smaller installations
- **Maintenance**: Regular drum maintenance required

### Flexible Bag Digesters
- **Design**: Plastic or rubber bag systems
- **Advantages**: Low cost, portable, easy installation
- **Best For**: Temporary installations, pilot projects
- **Maintenance**: Regular bag replacement needed

## Digital Integration

### Smart Monitoring
- **IoT Sensors**: Monitor temperature, pH, and gas production
- **Mobile Apps**: Track performance and maintenance schedules
- **Data Analytics**: Optimize system performance
- **Remote Monitoring**: Check systems from anywhere

### Platform Features
- **Waste Tracking**: Digital logging of waste collection
- **Production Monitoring**: Real-time gas production data
- **Quality Control**: Automated alerts for system issues
- **Community Network**: Connect producers and consumers

## Innovation Opportunities

### Local Adaptations
- **Climate Optimization**: Designs for different temperature zones
- **Material Substitution**: Use locally available materials
- **Waste Preprocessing**: Improve waste preparation techniques
- **Gas Purification**: Simple methods for gas quality improvement

### Emerging Technologies
- **Micro-digesters**: Small systems for individual households
- **Hybrid Systems**: Combine biogas with solar and wind
- **Advanced Materials**: New materials for better performance
- **Automation**: Automated feeding and gas collection

## Research Areas

- Improving efficiency in tropical climates
- Reducing system costs
- Enhancing user experience
- Integrating with existing energy systems
- Developing new applications

*Continuous innovation makes biogas technology more accessible and effective.*`
      },
      6: {
        title: "Getting Involved",
        content: `# Getting Involved with EcoFuel Connect

## For Individuals

### Waste Contributors
- **Household Waste**: Separate and contribute kitchen scraps
- **Garden Waste**: Provide yard trimmings and plant materials
- **Community Collection**: Organize neighborhood waste collection
- **Quality Control**: Ensure only organic materials are included

### Fuel Users
- **Cooking**: Use biogas for daily cooking needs
- **Heating**: Heat homes and water with biogas
- **Lighting**: Power gas lamps and appliances
- **Small Business**: Use biogas for commercial cooking

## For Organizations

### Schools
- **Educational Programs**: Include biogas in curriculum
- **Demonstration Projects**: Install systems for learning
- **Student Involvement**: Engage students in sustainability
- **Community Outreach**: Share knowledge with families

### Businesses
- **Waste Supply**: Provide organic waste from operations
- **Fuel Purchase**: Buy biogas for business needs
- **Investment**: Support biogas infrastructure development
- **Partnership**: Collaborate on sustainability initiatives

## Getting Started

### Step 1: Learn
- Attend information sessions
- Visit existing biogas installations
- Read educational materials
- Talk to current participants

### Step 2: Assess
- Evaluate your waste generation
- Determine your fuel needs
- Calculate potential benefits
- Identify logistics requirements

### Step 3: Plan
- Choose participation level
- Prepare necessary resources
- Set up collection or delivery systems
- Establish monitoring procedures

### Step 4: Implement
- Start with small-scale participation
- Monitor and adjust as needed
- Share experiences with others
- Gradually increase involvement

## Support Available

- **Technical Training**: System operation and maintenance
- **Business Support**: Income generation guidance
- **Equipment Access**: Tools and materials assistance
- **Ongoing Help**: Continuous support and troubleshooting

### Contact Information
- Community coordinators
- Technical support team
- Training program managers
- Local implementation partners

*Join the sustainable energy movement and help build a cleaner future.*`
      }
    };
    
    return localContent[topicId] || {
      title: "Educational Content",
      content: "Educational content is being prepared. Please check back soon!"
    };
  };
  
  const formatExternalContent = (topicData) => {
    let content = `# ${topicData.title}\n\n`;
    
    // Add main Wikipedia content
    if (topicData.mainContent) {
      content += `## Overview\n\n${topicData.mainContent.extract}\n\n`;
      if (topicData.mainContent.url) {
        content += `[Read more on Wikipedia](${topicData.mainContent.url})\n\n`;
      }
    }
    
    // Add related articles
    if (topicData.relatedArticles && topicData.relatedArticles.length > 0) {
      content += `## Related Topics\n\n`;
      topicData.relatedArticles.forEach(article => {
        if (article) {
          content += `### ${article.title}\n${article.extract}\n\n`;
          if (article.url) {
            content += `[Learn more](${article.url})\n\n`;
          }
        }
      });
    }
    
    // Add recent news
    if (topicData.news && topicData.news.length > 0) {
      content += `## Latest News & Research\n\n`;
      topicData.news.forEach((article, index) => {
        if (article.title && article.description) {
          content += `### ${article.title}\n${article.description}\n`;
          if (article.url) {
            content += `[Read full article](${article.url})\n\n`;
          }
        }
      });
    }
    
    content += `\n---\n*Content sourced from Wikipedia and environmental news APIs*\n`;
    content += `*Last updated: ${new Date().toLocaleDateString()}*`;
    
    return content;
  };

  // Effects
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchContent(), fetchCourses()]);
      setLoading(false);
    };
    
    loadData();
  }, [selectedCategory, searchTerm]);

  const filteredTopics = educationalTopics.filter(topic => 
    selectedCategory === 'all' || topic.category === selectedCategory
  ).filter(topic =>
    searchTerm === '' || 
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{background: '#F9FAFB', minHeight: '100vh', paddingTop: '20px'}}>
        <Container fluid className="d-flex justify-content-center align-items-center" style={{minHeight: '60vh'}}>
          <div className="text-center">
            <Spinner animation="border" variant="success" style={{width: '3rem', height: '3rem'}} />
            <p className="mt-3" style={{color: '#2F4F4F', fontSize: '1.1rem'}}>Loading educational content...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{background: '#F9FAFB', minHeight: '100vh', paddingTop: '20px', paddingBottom: '20px'}}>
      <Container fluid>
        {/* Alert */}
        {alert.show && (
          <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: '' })}>
            {alert.message}
          </Alert>
        )}

        {/* Header Section */}
        <Row className="mb-4">
          <Col md="12">
            <Card 
              className="shadow-lg border-0"
              style={{
                background: 'linear-gradient(135deg, #d4f5e0 0%, #ffffff 100%)',
                borderTop: '4px solid #25805a'
              }}
            >
              <Card.Header 
                style={{
                  background: 'rgba(37, 128, 90, 0.1)', 
                  borderBottom: '1px solid rgba(37, 128, 90, 0.2)'
                }}
              >
                <Card.Title 
                  as="h3"
                  style={{
                    color: '#2F4F4F',
                    fontWeight: '600',
                    fontSize: '2rem',
                    fontFamily: '"Inter", "Segoe UI", sans-serif',
                    marginBottom: '10px'
                  }}
                >Educational Content</Card.Title>
                <p 
                  className="card-category"
                  style={{
                    color: '#2F4F4F',
                    fontSize: '1.1rem',
                    fontFamily: '"Inter", "Segoe UI", sans-serif',
                    opacity: '0.8',
                    marginBottom: '0'
                  }}
                >
                  Learn how EcoFuel Connect supports sustainable biogas use and organic waste recycling in South Sudan
                </p>
              </Card.Header>
            </Card>
          </Col>
        </Row>

        {/* Search and Filter Controls */}
        <Row className="mb-4">
          <Col md="8">
            <Form.Control
              type="text"
              placeholder="Search educational content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '8px',
                padding: '12px',
                border: '2px solid #e9ecef',
                fontSize: '1rem'
              }}
            />
          </Col>
          <Col md="4">
            <DropdownButton
              id="category-dropdown"
              title={selectedCategory === 'all' ? 'All Categories' : selectedCategory}
              variant="outline-success"
              style={{
                width: '100%'
              }}
              onSelect={(eventKey) => setSelectedCategory(eventKey)}
            >
              {categories.map(category => (
                <Dropdown.Item 
                  key={category} 
                  eventKey={category}
                  active={selectedCategory === category}
                >
                  {category === 'all' ? 'All Categories' : category}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
        </Row>

        {/* Published Content Posts Section */}
        {posts.length > 0 && (
          <>
            <Row className="mb-3">
              <Col>
                <h4 style={{color: '#2F4F4F', fontWeight: '600', marginBottom: '20px'}}>
                  <i className="nc-icon nc-paper-2 me-2"></i>
                  Latest Articles
                </h4>
              </Col>
            </Row>
            <Row className="mb-5">
              {posts.slice(0, 3).map((post) => (
                <Col lg="4" md="6" sm="12" className="mb-4" key={post._id}>
                  <Card 
                    className="shadow-lg border-0 h-100"
                    style={{
                      background: 'linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%)',
                      borderLeft: `4px solid ${getCategoryColor(post.category)}`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => handlePostClick(post)}
                  >
                    {post.imageUrl && (
                      <Card.Img 
                        variant="top" 
                        src={post.imageUrl} 
                        style={{height: '200px', objectFit: 'cover'}}
                      />
                    )}
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <Badge 
                          style={{
                            backgroundColor: `${getCategoryColor(post.category)}20`,
                            color: getCategoryColor(post.category),
                            fontSize: '0.75rem'
                          }}
                        >
                          {post.category}
                        </Badge>
                        {post.featured && (
                          <Badge bg="warning" className="ms-1" style={{fontSize: '0.75rem'}}>
                            Featured
                          </Badge>
                        )}
                      </div>
                      <Card.Title style={{color: '#2F4F4F', fontWeight: '600', fontSize: '1.25rem'}}>
                        {post.title}
                      </Card.Title>
                      <Card.Text style={{color: '#2F4F4F', opacity: '0.8', flexGrow: 1}}>
                        {post.summary}
                      </Card.Text>
                      <div className="mt-auto">
                        <small style={{color: '#6c757d'}}>
                          By {post.author?.name} • {post.viewCount} views
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* Available Courses Section */}
        {courses.length > 0 && (
          <>
            <Row className="mb-3">
              <Col>
                <h4 style={{color: '#2F4F4F', fontWeight: '600', marginBottom: '20px'}}>
                  <i className="nc-icon nc-hat-3 me-2"></i>
                  Available Courses
                </h4>
              </Col>
            </Row>
            <Row className="mb-5">
              {courses.map((course) => (
                <Col lg="4" md="6" sm="12" className="mb-4" key={course._id}>
                  <Card 
                    className="shadow-lg border-0 h-100"
                    style={{
                      background: 'linear-gradient(135deg, #fff3cd 0%, #ffffff 100%)',
                      borderLeft: `4px solid ${getCategoryColor(course.category)}`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Card.Img 
                      variant="top" 
                      src={course.thumbnailUrl} 
                      style={{height: '200px', objectFit: 'cover'}}
                    />
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <Badge 
                          style={{
                            backgroundColor: `${getCategoryColor(course.category)}20`,
                            color: getCategoryColor(course.category),
                            fontSize: '0.75rem'
                          }}
                        >
                          {course.category}
                        </Badge>
                        <Badge bg="info" className="ms-1" style={{fontSize: '0.75rem'}}>
                          {course.level}
                        </Badge>
                        {course.price === 0 && (
                          <Badge bg="success" className="ms-1" style={{fontSize: '0.75rem'}}>
                            Free
                          </Badge>
                        )}
                      </div>
                      <Card.Title style={{color: '#2F4F4F', fontWeight: '600', fontSize: '1.25rem'}}>
                        {course.title}
                      </Card.Title>
                      <Card.Text style={{color: '#2F4F4F', opacity: '0.8', flexGrow: 1}}>
                        {course.shortDescription}
                      </Card.Text>
                      <div className="mb-3">
                        <small style={{color: '#6c757d'}}>
                          {course.duration} minutes • {course.enrollmentCount} enrolled
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          style={{
                            background: `linear-gradient(135deg, ${getCategoryColor(course.category)}, ${getCategoryColor(course.category)}dd)`,
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontWeight: '500'
                          }}
                          onClick={() => enrollInCourse(course._id)}
                          disabled={enrollingCourse === course._id}
                        >
                          {enrollingCourse === course._id ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Enrolling...
                            </>
                          ) : (
                            'Enroll Now'
                          )}
                        </Button>
                        <Button
                          variant="outline-primary"
                          style={{
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontWeight: '500'
                          }}
                          onClick={() => history.push(`/admin/course/${course._id}`)}
                        >
                          Learn More
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* Educational Topics Grid */}
        <Row className="mb-3">
          <Col>
            <h4 style={{color: '#2F4F4F', fontWeight: '600', marginBottom: '20px'}}>
              <i className="nc-icon nc-bulb-63 me-2"></i>
              Educational Topics
            </h4>
          </Col>
        </Row>
        <Row>
          {filteredTopics.map((topic) => (
            <Col lg="4" md="6" sm="12" className="mb-4" key={topic.id}>
              <Card 
                className="shadow-lg border-0 h-100"
                style={{
                  background: 'linear-gradient(135deg, #d4f5e0 0%, #ffffff 100%)',
                  borderLeft: `4px solid ${getCategoryColor(topic.category)}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 128, 90, 0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                }}
              >
                <Card.Body className="d-flex flex-column p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className="icon-big text-center me-3"
                      style={{
                        background: `linear-gradient(135deg, ${getCategoryColor(topic.category)}, ${getCategoryColor(topic.category)}dd)`,
                        color: 'white',
                        borderRadius: '12px',
                        padding: '12px',
                        fontSize: '1.5rem',
                        minWidth: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className={topic.icon}></i>
                    </div>
                    <div className="flex-grow-1">
                      <span 
                        className="badge mb-2"
                        style={{
                          backgroundColor: `${getCategoryColor(topic.category)}20`,
                          color: getCategoryColor(topic.category),
                          fontFamily: '"Inter", "Segoe UI", sans-serif',
                          fontSize: '0.75rem',
                          padding: '4px 8px'
                        }}
                      >
                        {topic.category}
                      </span>
                    </div>
                  </div>
                  
                  <Card.Title 
                    as="h5"
                    style={{
                      color: '#2F4F4F',
                      fontWeight: '600',
                      fontSize: '1.25rem',
                      fontFamily: '"Inter", "Segoe UI", sans-serif',
                      marginBottom: '15px'
                    }}
                  >
                    {topic.title}
                  </Card.Title>
                  
                  <p 
                    style={{
                      color: '#2F4F4F',
                      fontSize: '0.95rem',
                      fontFamily: '"Inter", "Segoe UI", sans-serif',
                      lineHeight: '1.5',
                      opacity: '0.8',
                      flexGrow: 1
                    }}
                  >
                    {topic.description}
                  </p>
                  
                  <Button
                    style={{
                      background: `linear-gradient(135deg, ${getCategoryColor(topic.category)}, ${getCategoryColor(topic.category)}dd)`,
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontWeight: '500',
                      fontFamily: '"Inter", "Segoe UI", sans-serif',
                      fontSize: '0.9rem',
                      marginTop: '15px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = `0 4px 15px ${getCategoryColor(topic.category)}40`;
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                    onClick={() => handleLearnMore(topic)}
                  >
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Article Reading Modal */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          size="lg"
          style={{zIndex: 1050}}
        >
          <Modal.Header closeButton style={{background: '#f8f9fa', borderBottom: '2px solid #25805a'}}>
            <Modal.Title style={{color: '#2F4F4F', fontWeight: '600'}}>
              {selectedPost?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{maxHeight: '70vh', overflowY: 'auto'}}>
            {selectedPost && (
              <>
                <div className="mb-3">
                  <Badge 
                    style={{
                      backgroundColor: `${getCategoryColor(selectedPost.category)}20`,
                      color: getCategoryColor(selectedPost.category),
                      fontSize: '0.9rem',
                      padding: '6px 12px'
                    }}
                  >
                    {selectedPost.category}
                  </Badge>
                  {selectedPost.featured && (
                    <Badge bg="warning" className="ms-2" style={{fontSize: '0.9rem', padding: '6px 12px'}}>
                      Featured
                    </Badge>
                  )}
                </div>
                
                {selectedPost.imageUrl && (
                  <img 
                    src={selectedPost.imageUrl} 
                    alt={selectedPost.title}
                    style={{width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px'}}
                  />
                )}
                
                <div style={{color: '#2F4F4F', lineHeight: '1.6', fontSize: '1rem'}}>
                  {selectedPost.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('#')) {
                      const level = paragraph.match(/^#+/)[0].length;
                      const text = paragraph.replace(/^#+\s*/, '');
                      const Tag = `h${Math.min(level + 1, 6)}`;
                      return (
                        <Tag key={index} style={{color: '#25805a', fontWeight: '600', marginTop: '20px', marginBottom: '10px'}}>
                          {text}
                        </Tag>
                      );
                    }
                    return paragraph.trim() && (
                      <p key={index} style={{marginBottom: '15px'}}>
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-3" style={{borderTop: '1px solid #e9ecef'}}>
                  <small style={{color: '#6c757d'}}>
                    By {selectedPost.author?.name} • {selectedPost.viewCount} views • 
                    {selectedPost.tags?.map(tag => (
                      <Badge key={tag} bg="light" text="dark" className="ms-1" style={{fontSize: '0.7rem'}}>
                        {tag}
                      </Badge>
                    ))}
                  </small>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer style={{background: '#f8f9fa'}}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default EducationalContent;
