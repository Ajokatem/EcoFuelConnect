import React, { useState } from "react";
import { Button, Card, Container, Row, Col, Form, Badge } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import "../assets/css/edu-content-modern.css";

function EducationalContent() {
  const history = useHistory();
  const { translate, currentLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [sortBy, setSortBy] = useState('Sort by Popular');
  const [showAll, setShowAll] = useState(false);
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const producerVideos = [
    {
      id: 'v1',
      title: 'Biogas Production from Organic Waste',
      videoId: 'IJUr-2708yA',
      description: 'Complete guide to biogas production from organic waste through anaerobic digestion. Covers the science of anaerobic digestion, methane production, and practical applications.',
      category: 'BIOGAS BASICS',
      duration: '4:22',
      arabicSubtitles: true,
      notes: 'This video explains the complete biogas production process from organic waste. Key topics: anaerobic digestion stages, methane formation, optimal conditions for gas production, and real-world applications in South Sudan context.'
    },
    {
      id: 'v2',
      title: 'How Biogas Plants Work',
      videoId: 'Fn9fOvWLYDU',
      description: 'Understanding the complete biogas plant operation and technology. Learn about digester types, system components, and operational requirements.',
      category: 'BIOGAS BASICS',
      duration: '3:14',
      arabicSubtitles: true,
      notes: 'Comprehensive overview of biogas plant technology. Topics covered: fixed dome vs floating drum digesters, gas storage systems, feeding mechanisms, safety equipment, and maintenance requirements.'
    },
    {
      id: 'v3',
      title: 'Anaerobic Digestion Process Explained',
      videoId: 'beWbsWGxP-U',
      description: 'Deep dive into anaerobic digestion process and methane production. Detailed explanation of the four-stage biological process.',
      category: 'INNOVATION',
      duration: '5:47',
      arabicSubtitles: true,
      notes: 'Advanced technical content on anaerobic digestion. Covers: hydrolysis, acidogenesis, acetogenesis, and methanogenesis stages. Includes microbial ecology, optimal pH ranges, temperature requirements, and troubleshooting common issues.'
    },
    {
      id: 'v4',
      title: 'Biogas Technology & Applications',
      videoId: 'zm0jslIE1kk',
      description: 'Comprehensive overview of biogas technology and real-world applications. See how biogas transforms communities and reduces environmental impact.',
      category: 'WASTE MANAGEMENT',
      duration: '6:31',
      arabicSubtitles: true,
      notes: 'Practical applications of biogas technology. Topics: cooking fuel replacement, electricity generation, organic fertilizer production, carbon emission reduction, economic benefits for rural communities, and case studies from successful projects.'
    }
  ];

  const educationalTopics = [
    {
      id: 1,
      title: "Understanding Biogas Technology",
      description: "Learn how biogas is produced through anaerobic digestion and its role as clean renewable energy for South Sudan. Understand the science behind methane production and its environmental benefits.",
      notes: "Comprehensive introduction to biogas technology covering: What is biogas and its composition (50-70% methane), the four-stage anaerobic digestion process (hydrolysis, acidogenesis, acetogenesis, methanogenesis), optimal operating conditions (temperature, pH, retention time), and comparison with fossil fuels. Includes practical examples from South Sudan context.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80",
      category: "BIOGAS BASICS",
      rating: 4.5,
      students: 245,
      price: "Free"
    },
    {
      id: 2,
      title: "Organic Waste Collection & Management",
      description: "Best practices for collecting organic waste from markets, slaughterhouses, and restaurants for biogas production. Learn proper waste separation, storage, and transportation techniques.",
      notes: "Detailed waste management strategies including: Source identification (municipal, agricultural, commercial waste), collection system design (containers, vehicles, routes), quality control procedures, storage management, pre-treatment methods, and community engagement. Covers waste characterization, optimal C:N ratios, and co-digestion techniques for maximum biogas yield.",
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&q=80",
      category: "WASTE MANAGEMENT",
      rating: 4.5,
      students: 189,
      price: "Free"
    },
    {
      id: 3,
      title: "Health Benefits of Clean Cooking Fuel",
      description: "Understand how biogas reduces indoor air pollution and respiratory diseases in South Sudanese communities. Discover the health benefits of clean cooking fuel.",
      notes: "Health and environmental impact analysis covering: Indoor air quality improvements, reduction in respiratory diseases (especially for women and children), comparison with traditional biomass fuels, carbon emission reductions, forest conservation benefits, and long-term health outcomes. Includes WHO air quality standards and local health statistics.",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80",
      category: "ENVIRONMENT & HEALTH",
      rating: 4.5,
      students: 256,
      price: "Free"
    },
    {
      id: 4,
      title: "Community Empowerment & Economic Impact",
      description: "How biogas creates jobs, income opportunities, and improves quality of life in rural communities. Explore economic and social benefits of biogas adoption.",
      notes: "Community development through biogas covering: Job creation in waste collection, plant operation, and maintenance; income generation from waste supply and biogas sales; women's empowerment through reduced cooking time and health improvements; educational opportunities; cooperative business models; and success stories from South Sudanese communities.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      category: "COMMUNITY IMPACT",
      rating: 3.5,
      students: 187,
      price: "Free"
    },
    {
      id: 5,
      title: "Digital Tools for Biogas Management",
      description: "Discover how EcoFuelConnect platform enables efficient waste tracking and fuel delivery coordination. Learn to use digital tools for biogas management.",
      notes: "Digital platform training covering: Mobile app for waste logging with GPS and photo verification, real-time biogas production monitoring, fuel request management system, payment tracking, IoT sensor integration, data analytics for optimization, and blockchain-secured supply chain transparency. Hands-on tutorials for all user roles.",
      image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&q=80",
      category: "INNOVATION",
      rating: 4.5,
      students: 234,
      price: "Free"
    },
    {
      id: 6,
      title: "Getting Started with Biogas",
      description: "Step-by-step guide for farmers, schools, and communities to participate in biogas production. Everything you need to know to get started.",
      notes: "Beginner's guide covering: Initial assessment of waste availability, site selection criteria, digester size calculation, cost estimation and financing options, construction or installation process, startup procedures, daily operation routines, safety protocols, and connecting to the EcoFuelConnect network. Includes checklists and decision-making tools.",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80",
      category: "GETTING STARTED",
      rating: 4.5,
      students: 278,
      price: "Free"
    },
    {
      id: 7,
      title: "Anaerobic Digestion Process",
      description: "Deep dive into the science of anaerobic digestion and methane production from organic materials. Advanced technical content for operators.",
      notes: "Advanced biogas science covering: Microbial ecology of anaerobic digestion, biochemical pathways, enzyme kinetics, volatile fatty acid dynamics, ammonia inhibition, trace element requirements, process modeling, and optimization strategies. Includes laboratory testing methods and troubleshooting complex operational issues.",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80",
      category: "BIOGAS BASICS",
      rating: 4.0,
      students: 176,
      price: "Free"
    },
    {
      id: 8,
      title: "Waste Separation & Quality Control",
      description: "Learn proper waste separation techniques to maximize biogas production efficiency. Quality control for optimal gas yield.",
      notes: "Waste quality management covering: Separation techniques at source, identification of suitable vs unsuitable materials, contamination prevention, moisture content optimization, particle size reduction, feedstock mixing ratios, seasonal adjustments, and quality testing procedures. Includes visual guides and practical exercises.",
      image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=80",
      category: "WASTE MANAGEMENT",
      rating: 4.2,
      students: 165,
      price: "Free"
    },
    
    {
      id: 10,
      title: "Women's Empowerment in Biogas",
      description: "How biogas technology creates opportunities and improves health outcomes for women. Gender equality through clean energy access.",
      notes: "Women's empowerment through biogas covering: Time savings from reduced firewood collection (3-5 hours/day), health improvements from reduced smoke exposure, income opportunities in waste collection and biogas sales, leadership roles in cooperatives, educational opportunities for girls, and testimonials from women beneficiaries in South Sudan.",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80",
      category: "COMMUNITY IMPACT",
      rating: 4.8,
      students: 334,
      price: "Free"
    },
    {
      id: 11,
      title: "IoT Sensors for Biogas Monitoring",
      description: "Modern sensor technology for real-time monitoring of biogas production and quality. IoT integration for smart biogas systems.",
      notes: "IoT and sensor technology covering: Gas flow meters, pressure sensors, temperature probes, pH monitors, methane composition analyzers, automated data logging, mobile alerts, predictive maintenance algorithms, and integration with EcoFuelConnect platform. Includes installation guides and data interpretation.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
      category: "INNOVATION",
      rating: 4.3,
      students: 154,
      price: "Free"
    },
    {
      id: 12,
      title: "School Biogas Systems Setup",
      description: "Complete guide for schools to install and operate biogas systems for cooking fuel. School-specific implementation strategies.",
      notes: "School biogas systems covering: Sizing calculations based on student population, kitchen waste utilization, cafeteria integration, student education programs, safety protocols for educational settings, maintenance by school staff, cost-benefit analysis, funding sources, and case studies from South Sudanese schools successfully using biogas.",
      image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&q=80",
      category: "GETTING STARTED",
      rating: 4.6,
      students: 223,
      price: "Free"
    },
    {
      id: 13,
      title: "Biogas Safety & Maintenance",
      description: "Essential safety protocols and maintenance procedures for biogas systems. Critical knowledge for safe operation.",
      notes: "Safety and maintenance covering: Gas leak detection and prevention, explosion hazards and mitigation, proper ventilation requirements, personal protective equipment, emergency response procedures, daily/weekly/monthly maintenance checklists, troubleshooting common problems, spare parts management, and regulatory compliance. Includes safety certification requirements.",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80",
      category: "BIOGAS BASICS",
      rating: 4.4,
      students: 198,
      price: "Free"
    },
    {
      id: 14,
      title: "Slaughterhouse Waste Management",
      description: "Specialized techniques for handling and processing slaughterhouse organic waste. High-yield feedstock management.",
      notes: "Slaughterhouse waste management covering: Waste characterization (blood, intestinal contents, soft tissues), biosecurity and pathogen control, pre-treatment requirements, co-digestion with other substrates, ammonia management, high biogas yield optimization (600-800 m³/ton), regulatory compliance, and partnerships with meat processing facilities.",
      image: "https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=400&q=80",
      category: "WASTE MANAGEMENT",
      rating: 4.1,
      students: 143,
      price: "Free"
    },
    {
      id: 15,
      title: "Climate Change Mitigation",
      description: "How biogas reduces greenhouse gas emissions and combats climate change. Environmental impact quantification.",
      notes: "Climate change mitigation covering: Carbon footprint calculations, methane capture vs atmospheric release, fossil fuel displacement, forest conservation through reduced charcoal use, carbon credit opportunities, environmental monitoring, and contribution to South Sudan's climate commitments. Includes carbon accounting tools and certification processes.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80",
      category: "ENVIRONMENT & HEALTH",
      rating: 4.9,
      students: 367,
      price: "Free"
    },
    {
      id: 16,
      title: "Biogas Cooperatives & Business Models",
      description: "Learn how to form and manage successful biogas cooperatives in your community. Business models for sustainable operations.",
      notes: "Cooperative development covering: Legal structures and registration, member recruitment and governance, financial management and accounting, pricing strategies, revenue sharing models, conflict resolution, scaling strategies, access to financing, and case studies of successful biogas cooperatives in East Africa. Includes business plan templates.",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=80",
      category: "COMMUNITY IMPACT",
      rating: 4.5,
      students: 298,
      price: "Free"
    },
    {
      id: 17,
      title: "Mobile Apps for Waste Tracking",
      description: "Using mobile technology to track waste collection and optimize biogas production. Mobile-first waste management.",
      notes: "Mobile technology applications covering: EcoFuelConnect mobile app features, GPS-enabled waste logging, photo documentation, digital payment systems, real-time notifications, offline functionality, data synchronization, user training, and integration with backend analytics. Includes step-by-step tutorials for all user types.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80",
      category: "INNOVATION",
      rating: 4.2,
      students: 189,
      price: "Free"
    },
    {
      id: 18,
      title: "Biogas Digesters: Types & Selection",
      description: "Compare different digester types and choose the right one for your needs. Decision-making guide for digester selection.",
      notes: "Digester selection guide covering: Fixed dome vs floating drum vs bag digesters, capacity calculations, site requirements, cost comparisons, climate considerations, maintenance requirements, lifespan expectations, local construction materials, skilled labor availability, and decision matrices. Includes design specifications and construction manuals for each type.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
      category: "GETTING STARTED",
      rating: 4.7,
      students: 289,
      price: "Free"
    }
  ];

  const categories = ['All Category', 'BIOGAS BASICS', 'WASTE MANAGEMENT', 'ENVIRONMENT & HEALTH', 'COMMUNITY IMPACT', 'INNOVATION', 'GETTING STARTED'];

  const isProducer = user?.role === 'producer';

  const filteredTopics = educationalTopics
    .filter(topic => selectedCategory === 'All Category' || topic.category === selectedCategory)
    .filter(topic =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'Sort by Popular') return b.students - a.students;
      if (sortBy === 'Sort by Rating') return b.rating - a.rating;
      return 0;
    });

  const displayedTopics = showAll ? filteredTopics : filteredTopics.slice(0, 6);

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh", padding: "24px 0" }}>
      <Container fluid style={{ maxWidth: "1400px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#2F4F4F", margin: 0 }}>{translate('educationalContent')}</h2>
        </div>

        {/* Search and Filters */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "300px" }}>
            <Form.Control
              type="text"
              placeholder={translate('search') + "..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: "8px", padding: "12px 16px", border: "1px solid #ddd" }}
            />
          </div>
          <Form.Select style={{ width: "200px", borderRadius: "8px", padding: "12px 16px", border: "1px solid #ddd" }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option>Sort by Popular</option>
            <option>Sort by Latest</option>
            <option>Sort by Rating</option>
          </Form.Select>
          <Form.Select style={{ width: "200px", borderRadius: "8px", padding: "12px 16px", border: "1px solid #ddd" }} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat}>{cat}</option>
            ))}
          </Form.Select>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: "24px", color: "#666", fontSize: "0.95rem" }}>
          {currentLanguage === 'en' ? `Showing ${displayedTopics.length} of ${filteredTopics.length} courses` :
           currentLanguage === 'fr' ? `Affichage de ${displayedTopics.length} sur ${filteredTopics.length} cours` :
           currentLanguage === 'ar' ? `عرض ${displayedTopics.length} من ${filteredTopics.length} دورة` :
           currentLanguage === 'sw' ? `Inaonyesha ${displayedTopics.length} kati ya ${filteredTopics.length} kozi` :
           `Cï ŋic ${displayedTopics.length} ke ${filteredTopics.length} wëu`}
        </div>

        {/* Producer Videos Section */}
        {isProducer && (
          <div style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2F4F4F", margin: 0 }}>
                {currentLanguage === 'en' ? 'Producer Training Videos' :
                 currentLanguage === 'fr' ? 'Vidéos de Formation pour Producteurs' :
                 currentLanguage === 'ar' ? 'فيديوهات تدريب المنتجين' :
                 currentLanguage === 'sw' ? 'Video za Mafunzo ya Wazalishaji' :
                 'Wëu de nhoŋ ke ran de cak'}
              </h3>
              <Badge bg="success">{currentLanguage === 'en' ? 'New' : currentLanguage === 'fr' ? 'Nouveau' : currentLanguage === 'ar' ? 'جديد' : currentLanguage === 'sw' ? 'Mpya' : 'Nhom'}</Badge>
            </div>
            <Row>
              {producerVideos.map((video) => (
                <Col lg={6} md={12} className="mb-4" key={video.id}>
                  <Card style={{ border: "none", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                      <iframe
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                        src={`https://www.youtube.com/embed/${video.videoId}?cc_load_policy=1&cc_lang_pref=ar`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <Card.Body style={{ padding: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <Badge style={{ background: "#25805a", fontSize: "0.7rem" }}>{video.category}</Badge>
                        <span style={{ fontSize: "0.85rem", color: "#666" }}>⏱ {video.duration}</span>
                        <Badge bg="info" style={{ fontSize: "0.7rem" }}>
                          {currentLanguage === 'en' ? '🇦🇷 Arabic' : currentLanguage === 'fr' ? '🇦🇷 Arabe' : currentLanguage === 'ar' ? '🇦🇷 عربي' : currentLanguage === 'sw' ? '🇦🇷 Kiarabu' : currentLanguage === 'din' ? '🇦🇷 Arabic' : '🇦🇷 Arabic'}
                        </Badge>
                      </div>
                      <h5 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2F4F4F", marginBottom: "8px" }}>{video.title}</h5>
                      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "8px" }}>{video.description}</p>
                      {video.notes && (
                        <details style={{ fontSize: "0.85rem", color: "#555" }}>
                          <summary style={{ cursor: "pointer", fontWeight: 600, color: "#25805a" }}>
                            {currentLanguage === 'en' ? 'Video Notes' : currentLanguage === 'fr' ? 'Notes Vidéo' : currentLanguage === 'ar' ? 'ملاحظات الفيديو' : currentLanguage === 'sw' ? 'Maelezo ya Video' : 'Wëu de piɔu'}
                          </summary>
                          <p style={{ marginTop: "8px", lineHeight: 1.6, paddingLeft: "12px", borderLeft: "3px solid #25805a" }}>
                            {video.notes}
                          </p>
                        </details>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Courses Grid */}
        <Row>
          {displayedTopics.map((topic) => (
            <Col lg={4} md={6} className="mb-4" key={topic.id}>
              <Card 
                style={{ 
                  border: "none", 
                  borderRadius: "12px", 
                  overflow: "hidden", 
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)", 
                  cursor: "pointer", 
                  transition: "all 0.3s ease",
                  height: "100%"
                }} 
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(37,128,90,0.15)";
                }} 
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                }} 
                onClick={() => history.push(`/admin/educational-detail/${topic.id}`)}
              >
                <div style={{ position: "relative" }}>
                  <img src={topic.image} alt={topic.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                  <Badge style={{ position: "absolute", top: "12px", left: "12px", background: "#25805a", fontSize: "0.7rem", padding: "6px 12px", fontWeight: 600 }}>
                    {topic.category}
                  </Badge>
                </div>
                <Card.Body style={{ padding: "20px", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ color: "#ffa500", fontSize: "1rem" }}>★</span>
                    <span style={{ fontWeight: 600, color: "#2F4F4F" }}>{topic.rating}</span>
                  </div>
                  <h5 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2F4F4F", marginBottom: "12px", lineHeight: 1.4, minHeight: "50px" }}>
                    {topic.title}
                  </h5>
                  <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "8px", lineHeight: 1.5 }}>
                    {topic.description}
                  </p>
                  {topic.notes && (
                    <details style={{ fontSize: "0.85rem", color: "#555", marginBottom: "12px" }}>
                      <summary style={{ cursor: "pointer", fontWeight: 600, color: "#25805a", marginBottom: "6px" }}>
                        {currentLanguage === 'en' ? 'Course Notes' : currentLanguage === 'fr' ? 'Notes du Cours' : currentLanguage === 'ar' ? 'ملاحظات الدورة' : currentLanguage === 'sw' ? 'Maelezo ya Kozi' : 'Wëu de nhoŋ'}
                      </summary>
                      <p style={{ marginTop: "8px", lineHeight: 1.6, paddingLeft: "12px", borderLeft: "3px solid #25805a" }}>
                        {topic.notes}
                      </p>
                    </details>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #eee", marginTop: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#666", fontSize: "0.85rem" }}>
                      <span>👥</span>
                      <span>{topic.students.toLocaleString()} {currentLanguage === 'en' ? 'students' : currentLanguage === 'fr' ? 'étudiants' : currentLanguage === 'ar' ? 'طلاب' : currentLanguage === 'sw' ? 'wanafunzi' : 'ran'}</span>
                    </div>
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#25805a" }}>{topic.price}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Load More Button */}
        {filteredTopics.length > 6 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
            <Button
              onClick={() => setShowAll(!showAll)}
              style={{
                background: showAll ? "#fff" : "linear-gradient(135deg, #25805a 0%, #1e6b47 100%)",
                color: showAll ? "#25805a" : "#fff",
                border: showAll ? "2px solid #25805a" : "none",
                borderRadius: "24px",
                padding: "14px 48px",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(37,128,90,0.2)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(37,128,90,0.3)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(37,128,90,0.2)";
              }}
            >
              {showAll ? 
                (currentLanguage === 'en' ? 'Show Less' : currentLanguage === 'fr' ? 'Afficher Moins' : currentLanguage === 'ar' ? 'إظهار أقل' : currentLanguage === 'sw' ? 'Onyesha Kidogo' : 'Cï ŋic tin') :
                (currentLanguage === 'en' ? `Load More Courses (${filteredTopics.length - 6} more)` : currentLanguage === 'fr' ? `Charger Plus de Cours (${filteredTopics.length - 6} de plus)` : currentLanguage === 'ar' ? `تحميل المزيد (${filteredTopics.length - 6} أخرى)` : currentLanguage === 'sw' ? `Pakia Kozi Zaidi (${filteredTopics.length - 6} zaidi)` : `Cï kɔc wëu (${filteredTopics.length - 6} tënë)`)}
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default EducationalContent;
