import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card, Badge, Navbar, Nav } from "react-bootstrap";
import heroImage from "../assets/img/first image ecofuelconnect.jpg";
import lastecoimage1 from "../assets/img/lastecoimage1.jpg";
import lastecoimage2 from "../assets/img/lastecoimage2.jpg";
import lastecoimage3 from "../assets/img/lastecoimage3.jpg";
import ecoimagetransparent from "../assets/img/ecoimagetransparent.jpg";
import howitworksimage from "../assets/img/howitworksimage.jpg";

function Welcome() {
  const [isVisible, setIsVisible] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleWords, setVisibleWords] = useState(0);
  const words = ["Transforming", "Waste", "into", "Clean", "Energy"];
  
  const awarenessImages = [
    lastecoimage1,
    lastecoimage2,
    lastecoimage3,
    heroImage
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

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < words.length) {
        setVisibleWords(index + 1);
        index++;
      } else {
        clearInterval(timer);
      }
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: "#fff" }}>
      {/* Responsive Navbar */}
      <Navbar expand="lg" style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 1000, padding: "12px 0" }}>
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#25805a", letterSpacing: "-0.5px" }}>
            EcoFuelConnect
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ border: "none", outline: "none" }}>
            <span style={{ fontSize: "1.5rem", color: "#25805a" }}>☰</span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto" style={{ gap: "24px", alignItems: "center" }}>
              <Nav.Link as={Link} to="/" style={{ color: "#2F4F4F", fontWeight: 500, fontSize: "0.95rem" }}>Home</Nav.Link>
              <Nav.Link as={Link} to="/projects" style={{ color: "#2F4F4F", fontWeight: 500, fontSize: "0.95rem" }}>Projects</Nav.Link>
              <Nav.Link as={Link} to="/about" style={{ color: "#2F4F4F", fontWeight: 500, fontSize: "0.95rem" }}>About</Nav.Link>
              <Nav.Link as={Link} to="/contact" style={{ color: "#2F4F4F", fontWeight: 500, fontSize: "0.95rem" }}>Contact</Nav.Link>
              <Nav.Link as={Link} to="/auth/login" style={{ color: "#25805a", fontWeight: 600, fontSize: "0.95rem" }}>Sign In</Nav.Link>
              <Link to="/auth/register">
                <Button style={{ background: "#25805a", border: "none", borderRadius: "20px", padding: "8px 20px", fontWeight: 600, fontSize: "0.9rem" }}>Get Started</Button>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section style={{ 
        backgroundImage: `linear-gradient(rgba(212, 245, 224, 0.7), rgba(255, 255, 255, 0.75)), url(${ecoimagetransparent})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "80px 0" 
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} id="hero" data-animate style={{ opacity: isVisible.hero ? 1 : 0, transform: isVisible.hero ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease', marginBottom: "30px" }}>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 700, color: "#2F4F4F", marginBottom: "20px", lineHeight: 1.3, minHeight: "70px" }}>
                {words.map((word, index) => (
                  <span
                    key={index}
                    style={{
                      opacity: index < visibleWords ? 1 : 0,
                      transform: index < visibleWords ? 'translateY(0)' : 'translateY(-10px)',
                      transition: 'all 0.5s ease',
                      display: 'inline-block',
                      marginRight: '8px'
                    }}
                  >
                    {word}
                  </span>
                ))}
              </h1>
              <p style={{ fontSize: "1rem", color: "#2F4F4F", marginBottom: "28px", lineHeight: 1.6 }}>
                Every day, 1,337 tons of waste pile up in Juba while families choke on cooking smoke. We're flipping this crisis into opportunity—turning trash into treasure, pollution into power, and despair into hope. This is more than biogas. This is a movement.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link to="/auth/register">
                  <Button style={{ background: "#25805a", border: "none", borderRadius: "20px", padding: "10px 24px", fontSize: "0.95rem", fontWeight: 600, marginBottom: "10px" }}>
                    Join the Movement
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button variant="outline-success" style={{ borderColor: "#25805a", color: "#25805a", borderRadius: "20px", padding: "10px 24px", fontSize: "0.95rem", fontWeight: 600, marginBottom: "10px" }}>
                    View Projects
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg={6} id="hero-img" data-animate style={{ opacity: isVisible['hero-img'] ? 1 : 0, transform: isVisible['hero-img'] ? 'scale(1)' : 'scale(0.9)', transition: 'all 0.8s ease 0.2s', marginBottom: "30px" }}>
              <div style={{ clipPath: "polygon(0 8%, 100% 0%, 100% 92%, 0% 100%)", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                <img src={heroImage} alt="Biogas" style={{ width: "100%", display: "block" }} />
              </div>
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
              The numbers are staggering. The human cost is unbearable. But together, we can rewrite this story.
            </p>
          </div>
          <Row>
            <Col md={4} className="mb-4" id="card1" data-animate style={{ opacity: isVisible.card1 ? 1 : 0, transform: isVisible.card1 ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s ease 0.1s' }}>
              <Card style={{ border: "none", borderRadius: "16px", padding: "28px", height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: "2.5rem", color: "#e74c3c", marginBottom: "12px" }}></div>
                <h5 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "12px", fontSize: "1.1rem" }}>Energy Crisis</h5>
                <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  90% of families cook with charcoal and firewood. That's 237,400 hectares of forest destroyed every year—an area larger than Greater London. Meanwhile, toxic smoke fills homes, causing respiratory diseases that kill more children than malaria. The cost? Lives, forests, and futures.
                </p>
              </Card>
            </Col>
            <Col md={4} className="mb-4" id="card2" data-animate style={{ opacity: isVisible.card2 ? 1 : 0, transform: isVisible.card2 ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s ease 0.2s' }}>
              <Card style={{ border: "none", borderRadius: "16px", padding: "28px", height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: "2.5rem", color: "#f39c12", marginBottom: "12px" }}></div>
                <h5 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "12px", fontSize: "1.1rem" }}>Waste Crisis</h5>
                <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  1,337 tons of waste every single day. Only 2.6% managed properly. The rest? Rotting in open dumps, breeding disease, contaminating water, releasing methane 25x more potent than CO₂. This isn't just an eyesore—it's a public health emergency waiting to explode.
                </p>
              </Card>
            </Col>
            <Col md={4} className="mb-4" id="card3" data-animate style={{ opacity: isVisible.card3 ? 1 : 0, transform: isVisible.card3 ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s ease 0.3s' }}>
              <Card style={{ border: "none", borderRadius: "16px", padding: "28px", height: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: "2.5rem", color: "#e67e22", marginBottom: "12px" }}></div>
                <h5 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "12px", fontSize: "1.1rem" }}>Health Crisis</h5>
                <p style={{ color: "#666", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  Children gasping for air. Mothers coughing through meal prep. Respiratory infections ranking among top child killers. Add cholera and malaria from waste-contaminated water, and you have a perfect storm of preventable tragedy. Every statistic represents a family suffering needlessly.
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
                What if waste wasn't waste? What if every market scrap, every food leftover, every organic material became fuel for progress? EcoFuelConnect makes this real—connecting waste sources to biogas producers to schools and homes through one seamless digital ecosystem. No middlemen. No confusion. Just clean energy flowing where it's needed most.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ fontSize: "1.8rem" }}></div>
                  <div>
                    <h6 style={{ fontWeight: 700, marginBottom: "6px" }}>Waste Tracking</h6>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>GPS-verified collection with photo proof and digital receipts—every kilogram tracked, every supplier rewarded, zero waste lost</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ fontSize: "1.8rem" }}></div>
                  <div>
                    <h6 style={{ fontWeight: 700, marginBottom: "6px" }}>Production Monitoring</h6>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>Live dashboards showing production rates, quality metrics, and predictive analytics—turning data into decisions, waste into wealth</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ fontSize: "1.8rem" }}></div>
                  <div>
                    <h6 style={{ fontWeight: 700, marginBottom: "6px" }}>Fuel Delivery</h6>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>Automated scheduling, transparent pricing, and guaranteed delivery—schools get reliable fuel, producers get fair pay, communities get cleaner air</p>
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
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#25805a", marginBottom: "8px" }}>2,400+</div>
              <p style={{ fontSize: "1rem", color: "#2F4F4F", fontWeight: 600 }}>kg Waste Transformed Daily</p>
            </Col>
            <Col md={3} className="text-center mb-4" id="stat2" data-animate style={{ opacity: isVisible.stat2 ? 1 : 0, transform: isVisible.stat2 ? 'scale(1)' : 'scale(0.8)', transition: 'all 0.5s ease 0.2s' }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#25805a", marginBottom: "8px" }}>850+</div>
              <p style={{ fontSize: "1rem", color: "#2F4F4F", fontWeight: 600 }}>Families Breathing Clean</p>
            </Col>
            <Col md={3} className="text-center mb-4" id="stat3" data-animate style={{ opacity: isVisible.stat3 ? 1 : 0, transform: isVisible.stat3 ? 'scale(1)' : 'scale(0.8)', transition: 'all 0.5s ease 0.3s' }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#25805a", marginBottom: "8px" }}>12</div>
              <p style={{ fontSize: "1rem", color: "#2F4F4F", fontWeight: 600 }}>Schools Powered</p>
            </Col>
            <Col md={3} className="text-center mb-4" id="stat4" data-animate style={{ opacity: isVisible.stat4 ? 1 : 0, transform: isVisible.stat4 ? 'scale(1)' : 'scale(0.8)', transition: 'all 0.5s ease 0.4s' }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#25805a", marginBottom: "8px" }}>180+</div>
              <p style={{ fontSize: "1rem", color: "#2F4F4F", fontWeight: 600 }}>Tons CO₂ Prevented</p>
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
              Master the skills that matter—from biogas science to business management. Free courses designed by experts, built for changemakers.
            </p>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card style={{ border: "none", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", height: "100%" }}>
                <div style={{ height: "180px", background: "linear-gradient(135deg, #25805a, #1e6b47)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem" }}>🔬</div>
                <Card.Body style={{ padding: "20px" }}>
                  <h5 style={{ color: "#2F4F4F", fontWeight: 700, marginBottom: "10px", fontSize: "1.1rem" }}>Biogas Technology</h5>
                  <p style={{ color: "#666", marginBottom: "14px", fontSize: "0.95rem" }}>From microbiology to engineering—understand how bacteria transform waste into energy. Hands-on labs, expert mentors, certification included.</p>
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
                  <p style={{ color: "#666", marginBottom: "14px", fontSize: "0.95rem" }}>Turn trash into cash. Learn collection logistics, quality control, safety protocols, and business operations. Start your own waste collection enterprise.</p>
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
                  <p style={{ color: "#666", marginBottom: "14px", fontSize: "0.95rem" }}>Become a community advocate. Learn to measure health outcomes, calculate carbon savings, and inspire others. Change starts with knowledge.</p>
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

      {/* How It Works with Background */}
      <section style={{ 
        padding: "80px 0", 
        backgroundImage: `linear-gradient(rgba(37, 128, 90, 0.65), rgba(30, 107, 71, 0.7)), url(${howitworksimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff"
      }}>
        <Container>
          <div id="how" data-animate style={{ textAlign: "center", marginBottom: "50px", opacity: isVisible.how ? 1 : 0, transform: isVisible.how ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s ease' }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>How It Works</h2>
            <p style={{ fontSize: "1.1rem", color: "#fff", opacity: 0.95 }}>Simple steps to join the biogas revolution</p>
          </div>
          <Row>
            <Col md={3} className="text-center mb-4">
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", fontWeight: 700, color: "#fff" }}>1</div>
              <h6 style={{ color: "#fff", fontWeight: 700, marginBottom: "10px", fontSize: "1.1rem" }}>Register</h6>
              <p style={{ color: "#fff", fontSize: "0.95rem", opacity: 0.9 }}>Sign up as a producer, supplier, or school to access the platform</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", fontWeight: 700, color: "#fff" }}>2</div>
              <h6 style={{ color: "#fff", fontWeight: 700, marginBottom: "10px", fontSize: "1.1rem" }}>Track Waste</h6>
              <p style={{ color: "#fff", fontSize: "0.95rem", opacity: 0.9 }}>Log organic waste inputs with photos and geo-timestamps</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", fontWeight: 700, color: "#fff" }}>3</div>
              <h6 style={{ color: "#fff", fontWeight: 700, marginBottom: "10px", fontSize: "1.1rem" }}>Produce Biogas</h6>
              <p style={{ color: "#fff", fontSize: "0.95rem", opacity: 0.9 }}>Monitor production in real-time and optimize your processes</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem", fontWeight: 700, color: "#fff" }}>4</div>
              <h6 style={{ color: "#fff", fontWeight: 700, marginBottom: "10px", fontSize: "1.1rem" }}>Deliver Fuel</h6>
              <p style={{ color: "#fff", fontSize: "0.95rem", opacity: 0.9 }}>Coordinate transparent delivery to schools and communities</p>
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
              745 families already transformed. 2.4 tons of waste diverted daily. 180 tons of CO₂ prevented. Your community could be next. Your impact starts today.
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
