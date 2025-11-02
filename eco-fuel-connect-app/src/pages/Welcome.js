import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";

function Welcome() {
  const [isVisible, setIsVisible] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const awarenessImages = [
    "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800",
    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800",
    "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800",
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800"
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % awarenessImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [awarenessImages.length]);

  return (
    <div style={{ background: "#fff" }}>
      {/* Navbar */}
      <nav style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 1000, padding: "12px 0" }}>
        <Container>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#25805a", letterSpacing: "-0.5px" }}>EcoFuelConnect</span>
            </Link>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <Link to="/" style={{ color: "#2F4F4F", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem" }}>Home</Link>
              <Link to="/projects" style={{ color: "#2F4F4F", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem" }}>Projects</Link>
              <Link to="/about" style={{ color: "#2F4F4F", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem" }}>About</Link>
              <Link to="/contact" style={{ color: "#2F4F4F", fontWeight: 500, textDecoration: "none", fontSize: "0.95rem" }}>Contact</Link>
              <Link to="/auth/login" style={{ color: "#25805a", fontWeight: 600, textDecoration: "none", fontSize: "0.95rem" }}>Sign In</Link>
              <Link to="/auth/register">
                <Button style={{ background: "#25805a", border: "none", borderRadius: "20px", padding: "8px 20px", fontWeight: 600, fontSize: "0.9rem" }}>Get Started</Button>
              </Link>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section style={{ background: "linear-gradient(135deg, #d4f5e0 0%, #ffffff 100%)", padding: "80px 0" }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} id="hero" data-animate style={{ opacity: isVisible.hero ? 1 : 0, transform: isVisible.hero ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 700, color: "#2F4F4F", marginBottom: "20px", lineHeight: 1.3 }}>
                Transforming Waste into Clean Energy
              </h1>
              <p style={{ fontSize: "1rem", color: "#2F4F4F", marginBottom: "28px", lineHeight: 1.6 }}>
                Join South Sudan's biogas revolution. Converting organic waste into sustainable cooking fuel while protecting our environment and improving public health.
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <Link to="/auth/register">
                  <Button style={{ background: "#25805a", border: "none", borderRadius: "20px", padding: "10px 24px", fontSize: "0.95rem", fontWeight: 600 }}>
                    Join the Movement
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button variant="outline-success" style={{ borderColor: "#25805a", color: "#25805a", borderRadius: "20px", padding: "10px 24px", fontSize: "0.95rem", fontWeight: 600 }}>
                    View Projects
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg={6} id="hero-img" data-animate style={{ opacity: isVisible['hero-img'] ? 1 : 0, transform: isVisible['hero-img'] ? 'scale(1)' : 'scale(0.9)', transition: 'all 0.8s ease 0.2s' }}>
              <img src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600" alt="Biogas" style={{ width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Problem Statement */}
      <section style={{ padding: "60px 0", background: "#fff" }}>
        <Container>
          <div id="challenge" data-animate style={{ textAlign: "center", marginBottom: "50px", opacity: isVisible.challenge ? 1 : 0, transform: isVisible.challenge ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s ease' }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#2F4F4F", marginBottom: "12px" }}>The Challenge We're Solving</h2>
            <p style={{ fontSize: "1rem", color: "#666", maxWidth: "800px", margin: "0 auto" }}>
              South Sudan faces critical energy and environmental challenges that demand immediate action
            </p>
          </div>
          <Row>
            <Col md={4} className="mb-4" id="card1" data-animate style={{ opacity: isVisible.card1 ? 1 : 0, transform: isVisible.card1 ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s ease 0.1s' }}>
              <Card style={{ border: "none", borderRadius: "16px", padding: "28px", height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: "2.5rem", color: "#e74c3c", marginBottom: "12px" }}></div>
                <h5 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "12px", fontSize: "1.1rem" }}>Energy Crisis</h5>
                <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  Over 90% of households rely on charcoal and firewood, causing deforestation of 237,400 hectares annually and exposing families to harmful indoor air pollution.
                </p>
              </Card>
            </Col>
            <Col md={4} className="mb-4" id="card2" data-animate style={{ opacity: isVisible.card2 ? 1 : 0, transform: isVisible.card2 ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s ease 0.2s' }}>
              <Card style={{ border: "none", borderRadius: "16px", padding: "28px", height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: "2.5rem", color: "#f39c12", marginBottom: "12px" }}></div>
                <h5 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "12px", fontSize: "1.1rem" }}>Waste Crisis</h5>
                <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  Juba generates 1,337 tons of waste daily, but only 2.6% is properly managed. Organic waste accumulates in open dumps, creating health hazards and pollution.
                </p>
              </Card>
            </Col>
            <Col md={4} className="mb-4" id="card3" data-animate style={{ opacity: isVisible.card3 ? 1 : 0, transform: isVisible.card3 ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s ease 0.3s' }}>
              <Card style={{ border: "none", borderRadius: "16px", padding: "28px", height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: "2.5rem", color: "#e67e22", marginBottom: "12px" }}></div>
                <h5 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "12px", fontSize: "1.1rem" }}>Health Crisis</h5>
                <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  Respiratory infections from cooking smoke are among the top causes of child mortality. Poor waste disposal spreads waterborne diseases like cholera and malaria.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Solution Section */}
      <section style={{ padding: "60px 0", background: "linear-gradient(135deg, #25805a 0%, #1e6b47 100%)", color: "#fff" }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4" id="solution-img" data-animate style={{ opacity: isVisible['solution-img'] ? 1 : 0, transform: isVisible['solution-img'] ? 'translateX(0)' : 'translateX(-30px)', transition: 'all 0.8s ease' }}>
              <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600" alt="Solution" style={{ width: "100%", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} />
            </Col>
            <Col lg={6} id="solution-text" data-animate style={{ opacity: isVisible['solution-text'] ? 1 : 0, transform: isVisible['solution-text'] ? 'translateX(0)' : 'translateX(30px)', transition: 'all 0.8s ease' }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px" }}>Our Biogas Solution</h2>
              <p style={{ fontSize: "1rem", marginBottom: "28px", lineHeight: 1.6 }}>
                EcoFuelConnect bridges the gap between organic waste producers and clean energy consumers through an integrated digital platform that makes biogas adoption simple, transparent, and scalable.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ fontSize: "1.8rem" }}></div>
                  <div>
                    <h6 style={{ fontWeight: 700, marginBottom: "6px" }}>Waste Tracking</h6>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>Real-time monitoring of organic waste collection from markets, slaughterhouses, and restaurants</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ fontSize: "1.8rem" }}></div>
                  <div>
                    <h6 style={{ fontWeight: 700, marginBottom: "6px" }}>Production Monitoring</h6>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>Track daily biogas production and optimize processes for maximum efficiency</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ fontSize: "1.8rem" }}></div>
                  <div>
                    <h6 style={{ fontWeight: 700, marginBottom: "6px" }}>Fuel Delivery</h6>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>Seamless coordination between producers and schools for reliable clean fuel access</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Impact Stats */}
      <section style={{ padding: "60px 0", background: "#f8f9fa" }}>
        <Container>
          <div id="impact" data-animate style={{ textAlign: "center", marginBottom: "50px", opacity: isVisible.impact ? 1 : 0, transform: isVisible.impact ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s ease' }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#2F4F4F", marginBottom: "12px" }}>Our Impact</h2>
            <p style={{ fontSize: "1rem", color: "#666" }}>Making a real difference in South Sudan's communities</p>
          </div>
          <Row>
            <Col md={3} className="text-center mb-4" id="stat1" data-animate style={{ opacity: isVisible.stat1 ? 1 : 0, transform: isVisible.stat1 ? 'scale(1)' : 'scale(0.8)', transition: 'all 0.5s ease 0.1s' }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#25805a", marginBottom: "8px" }}>1,200+</div>
              <p style={{ fontSize: "1rem", color: "#2F4F4F", fontWeight: 600 }}>kg Waste Recycled Daily</p>
            </Col>
            <Col md={3} className="text-center mb-4" id="stat2" data-animate style={{ opacity: isVisible.stat2 ? 1 : 0, transform: isVisible.stat2 ? 'scale(1)' : 'scale(0.8)', transition: 'all 0.5s ease 0.2s' }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#25805a", marginBottom: "8px" }}>1,345</div>
              <p style={{ fontSize: "1rem", color: "#2F4F4F", fontWeight: 600 }}>m³ Biogas Produced</p>
            </Col>
            <Col md={3} className="text-center mb-4" id="stat3" data-animate style={{ opacity: isVisible.stat3 ? 1 : 0, transform: isVisible.stat3 ? 'scale(1)' : 'scale(0.8)', transition: 'all 0.5s ease 0.3s' }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#25805a", marginBottom: "8px" }}>432</div>
              <p style={{ fontSize: "1rem", color: "#2F4F4F", fontWeight: 600 }}>Active Users</p>
            </Col>
            <Col md={3} className="text-center mb-4" id="stat4" data-animate style={{ opacity: isVisible.stat4 ? 1 : 0, transform: isVisible.stat4 ? 'scale(1)' : 'scale(0.8)', transition: 'all 0.5s ease 0.4s' }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#25805a", marginBottom: "8px" }}>75</div>
              <p style={{ fontSize: "1rem", color: "#2F4F4F", fontWeight: 600 }}>Trees Saved</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Educational Courses Section */}
      <section style={{ padding: "60px 0", background: "#fff" }}>
        <Container>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#2F4F4F", marginBottom: "12px" }}>Learn & Grow</h2>
            <p style={{ fontSize: "1rem", color: "#666", maxWidth: "800px", margin: "0 auto" }}>
              Access comprehensive educational courses on biogas technology, waste management, and sustainable practices
            </p>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card style={{ border: "none", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "100%" }}>
                <div style={{ height: "180px", background: "linear-gradient(135deg, #25805a, #1e6b47)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem" }}>🔬</div>
                <Card.Body style={{ padding: "20px" }}>
                  <h5 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "10px", fontSize: "1.1rem" }}>Biogas Technology</h5>
                  <p style={{ color: "#666", marginBottom: "14px", fontSize: "0.95rem" }}>Master the science of anaerobic digestion and biogas production systems</p>
                  <Badge style={{ background: "#25805a", marginRight: "8px", fontSize: "0.8rem" }}>6 Courses</Badge>
                  <Badge bg="light" text="dark" style={{ fontSize: "0.8rem" }}>Beginner to Advanced</Badge>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card style={{ border: "none", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "100%" }}>
                <div style={{ height: "180px", background: "linear-gradient(135deg, #2d9467, #25805a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem" }}>♻️</div>
                <Card.Body style={{ padding: "20px" }}>
                  <h5 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "10px", fontSize: "1.1rem" }}>Waste Management</h5>
                  <p style={{ color: "#666", marginBottom: "14px", fontSize: "0.95rem" }}>Learn effective organic waste collection and processing techniques</p>
                  <Badge style={{ background: "#2d9467", marginRight: "8px", fontSize: "0.8rem" }}>5 Courses</Badge>
                  <Badge bg="light" text="dark" style={{ fontSize: "0.8rem" }}>Practical Skills</Badge>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card style={{ border: "none", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "100%" }}>
                <div style={{ height: "180px", background: "linear-gradient(135deg, #1e6b47, #25805a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem" }}>🌱</div>
                <Card.Body style={{ padding: "20px" }}>
                  <h5 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "10px", fontSize: "1.1rem" }}>Community Impact</h5>
                  <p style={{ color: "#666", marginBottom: "14px", fontSize: "0.95rem" }}>Understand health benefits and environmental improvements</p>
                  <Badge style={{ background: "#1e6b47", marginRight: "8px", fontSize: "0.8rem" }}>7 Courses</Badge>
                  <Badge bg="light" text="dark" style={{ fontSize: "0.8rem" }}>Social Development</Badge>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Link to="/auth/register">
              <Button style={{ background: "#25805a", border: "none", borderRadius: "20px", padding: "10px 28px", fontSize: "0.95rem", fontWeight: 600 }}>
                Explore All Courses
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section style={{ padding: "60px 0", background: "#f8f9fa" }}>
        <Container>
          <div id="how" data-animate style={{ textAlign: "center", marginBottom: "50px", opacity: isVisible.how ? 1 : 0, transform: isVisible.how ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s ease' }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#2F4F4F", marginBottom: "12px" }}>How It Works</h2>
            <p style={{ fontSize: "1rem", color: "#666" }}>Simple steps to join the biogas revolution</p>
          </div>
          <Row>
            <Col md={3} className="text-center mb-4">
              <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#d4f5e0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "1.8rem", fontWeight: 700, color: "#25805a" }}>1</div>
              <h6 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "10px" }}>Register</h6>
              <p style={{ color: "#666", fontSize: "0.95rem" }}>Sign up as a producer, supplier, or school to access the platform</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#d4f5e0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "1.8rem", fontWeight: 700, color: "#25805a" }}>2</div>
              <h6 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "10px" }}>Track Waste</h6>
              <p style={{ color: "#666", fontSize: "0.95rem" }}>Log organic waste inputs with photos and geo-timestamps</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#d4f5e0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "1.8rem", fontWeight: 700, color: "#25805a" }}>3</div>
              <h6 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "10px" }}>Produce Biogas</h6>
              <p style={{ color: "#666", fontSize: "0.95rem" }}>Monitor production in real-time and optimize your processes</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#d4f5e0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "1.8rem", fontWeight: 700, color: "#25805a" }}>4</div>
              <h6 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "10px" }}>Deliver Fuel</h6>
              <p style={{ color: "#666", fontSize: "0.95rem" }}>Coordinate transparent delivery to schools and communities</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "60px 0", background: "#fff" }}>
        <Container>
          <div id="cta" data-animate style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto", opacity: isVisible.cta ? 1 : 0, transform: isVisible.cta ? 'scale(1)' : 'scale(0.95)', transition: 'all 0.6s ease' }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#2F4F4F", marginBottom: "20px" }}>Ready to Make a Difference?</h2>
            <p style={{ fontSize: "1rem", color: "#666", marginBottom: "28px" }}>
              Join producers, suppliers, and schools across South Sudan in building a sustainable, clean energy future
            </p>
            <Link to="/auth/register">
              <Button style={{ background: "#25805a", border: "none", borderRadius: "20px", padding: "12px 32px", fontSize: "1rem", fontWeight: 600 }}>
                Get Started Today
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Awareness Section */}
      <section style={{ padding: "60px 0", background: "#f8f9fa" }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <div style={{ position: "relative", height: "500px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}>
                {awarenessImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Environmental awareness ${index + 1}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: currentImageIndex === index ? 1 : 0,
                      transition: "opacity 1.2s ease-in-out"
                    }}
                  />
                ))}
              </div>
            </Col>
            <Col lg={4}>
              <div style={{ padding: "20px" }}>
                <h6 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#2F4F4F", marginBottom: "16px" }}>Environmental Reality</h6>
                <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.7, marginBottom: "14px" }}>
                  These images reveal the harsh reality of waste accumulation in Juba. Unmanaged organic waste creates breeding grounds for disease-carrying pests and contaminates water sources.
                </p>
                <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.7, marginBottom: "14px" }}>
                  Open dumping sites emit harmful greenhouse gases and toxic fumes, endangering public health and accelerating climate change.
                </p>
                <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.7, marginBottom: "14px" }}>
                  Through proper waste recycling and biogas conversion, we can transform this environmental hazard into clean, renewable energy while protecting our communities.
                </p>
                <p style={{ fontSize: "0.8rem", color: "#25805a", fontWeight: 600, fontStyle: "italic" }}>
                  Together, we can turn waste into opportunity.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer style={{ background: "linear-gradient(135deg, #25805a 0%, #1e6b47 100%)", color: "#fff", padding: "40px 0 20px" }}>
        <Container>
          <Row>
            <Col md={4} className="mb-3">
              <h5 style={{ fontWeight: 700, marginBottom: "16px" }}>EcoFuelConnect</h5>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>Transforming organic waste into clean biogas energy for a sustainable South Sudan.</p>
            </Col>
            <Col md={4} className="mb-3">
              <h6 style={{ fontWeight: 600, marginBottom: "16px" }}>Quick Links</h6>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link to="/" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>Home</Link>
                <Link to="/projects" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>Projects</Link>
                <Link to="/about" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>About</Link>
                <Link to="/contact" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>Contact</Link>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <h6 style={{ fontWeight: 600, marginBottom: "16px" }}>Contact Info</h6>
              <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>📍 Kigali, Rwanda</p>
              <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>📞 +250792104895</p>
              <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>✉️ a.biar@alustudent.com</p>
            </Col>
          </Row>
          <hr style={{ borderColor: "rgba(255,255,255,0.2)", margin: "20px 0" }} />
          <div style={{ textAlign: "center", fontSize: "0.85rem" }}>
            <p style={{ margin: 0 }}>© 2025 EcoFuelConnect. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Welcome;
