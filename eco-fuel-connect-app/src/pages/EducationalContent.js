import React from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function EducationalContent() {
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

  return (
    <div style={{background: '#F9FAFB', minHeight: '100vh', paddingTop: '20px', paddingBottom: '20px'}}>
      <Container fluid>
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
                > Educational Content</Card.Title>
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

        {/* Educational Topics Grid */}
        <Row>
          {educationalTopics.map((topic) => (
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
                  >
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default EducationalContent;
