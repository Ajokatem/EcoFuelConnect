import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Container, Row, Col, Button, Card, Badge, ProgressBar } from "react-bootstrap";

function EducationalDetail() {
  const { topicId } = useParams();
  const history = useHistory();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    loadContent();
  }, [topicId]);

  const loadContent = () => {
    const educationalContent = {
      1: {
        title: "Biogas Technology",
        category: "Renewable Energy",
        duration: "45 min",
        difficulty: "Beginner",
        instructor: "Dr. Sarah Johnson, Environmental Engineer",
        rating: 4.8,
        students: 12847,
        sections: [
          {
            title: "Introduction to Biogas",
            content: "Biogas is a renewable energy source produced through anaerobic digestion of organic matter, consisting primarily of methane (50-70%) and carbon dioxide (30-40%). This clean-burning fuel offers an excellent alternative to traditional cooking methods and fossil fuels, particularly in rural areas with abundant organic waste."
          },
          {
            title: "The Anaerobic Digestion Process",
            content: "The process occurs when organic materials decompose in an oxygen-free environment. Specialized bacteria break down organic matter in four stages: hydrolysis (complex materials into simpler compounds), acidogenesis (conversion to organic acids), acetogenesis (acid conversion to acetate), and methanogenesis (methane and CO2 production)."
          },
          {
            title: "System Components & Design",
            content: "Biogas systems include a digester (sealed fermentation container), gas storage (collection and storage), distribution system (pipes and valves), and safety equipment (pressure relief valves and gas detectors). Proper design ensures optimal gas production and safe operation."
          },
          {
            title: "Applications & Benefits",
            content: "Applications range from household cooking and heating to electricity generation and vehicle fuel. Benefits include reduced dependence on firewood, decreased indoor air pollution, lower greenhouse gas emissions, and production of nutrient-rich fertilizer slurry."
          }
        ],
        keyPoints: [
          "Biogas contains 50-70% methane, making it highly combustible and energy-rich",
          "One cubic meter of biogas equals approximately 0.6 liters of diesel fuel in energy content",
          "Anaerobic digestion reduces organic waste volume by 80-90%",
          "Biogas burns with a blue flame, indicating complete combustion and minimal pollution",
          "The process works best at temperatures between 35-40°C (mesophilic) or 50-60°C (thermophilic)",
          "pH levels must stay between 6.8-7.2 for optimal gas production",
          "Carbon-to-nitrogen ratio should be maintained at 25-30:1 for efficient digestion",
          "Retention time varies from 15-30 days depending on temperature and waste type",
          "Gas production typically starts 10-15 days after initial feeding",
          "Daily gas yield ranges from 0.2-0.4 cubic meters per kilogram of organic waste",
          "Biogas can be upgraded to biomethane (95%+ methane) for vehicle fuel",
          "The digestate (slurry) contains nitrogen, phosphorus, and potassium - excellent fertilizer",
          "Biogas systems can reduce methane emissions by 90% compared to open waste decomposition",
          "Small household digesters (2-10 cubic meters) can serve families of 4-8 people",
          "Community digesters (50-200 cubic meters) can power entire villages or institutions",
          "Initial investment ranges from $200-2000 depending on system size and materials",
          "Payback period typically 2-4 years through fuel savings and fertilizer benefits",
          "Maintenance requires 2-4 hours monthly for household systems",
          "System lifespan averages 15-25 years with proper maintenance",
          "Biogas production increases by 25-40% when combining different waste types (co-digestion)",
          "Temperature fluctuations can reduce gas production by up to 50%",
          "Proper mixing increases gas yield by 15-20%",
          "Biogas contains trace amounts of hydrogen sulfide (H2S) which is corrosive",
          "Gas purification can increase methane content from 60% to 95%+",
          "Biogas density is 20% lighter than air, requiring proper ventilation",
          "Flame temperature reaches 870°C, suitable for most cooking applications",
          "Energy content: 21-25 MJ per cubic meter of biogas",
          "Cooking efficiency: 55-60% compared to 15-20% for wood fires",
          "Carbon footprint reduction: 2-4 tons CO2 equivalent per household annually",
          "Job creation potential: 5-10 positions per 100 households served"
        ],
        practicalTips: [
          "Start with kitchen waste and gradually add other organic materials",
          "Maintain consistent feeding schedule for stable gas production",
          "Monitor temperature daily during startup phase",
          "Keep spare parts available for quick repairs",
          "Train multiple family members in system operation",
          "Document gas production rates to optimize performance",
          "Use biogas slurry within 6 months for maximum nutrient value",
          "Install gas leak detectors in enclosed spaces",
          "Regular cleaning prevents system blockages",
          "Seasonal adjustments needed for temperature variations"
        ],
        relatedTopics: [
          { id: 2, title: "Organic Waste Management", type: "prerequisite" },
          { id: 3, title: "Environmental Benefits", type: "related" },
          { id: 5, title: "Technology & Innovation", type: "advanced" }
        ],
        resources: [
          { text: "Global Biogas Production Statistics", url: "https://www.irena.org/publications/2022/Jul/Global-Energy-Transformation-A-Roadmap-to-2050", type: "report" },
          { text: "Anaerobic Digestion Process Guide", url: "https://www.epa.gov/anaerobic-digestion", type: "guide" },
          { text: "Biogas Plant Design Manual", url: "https://www.snv.org/cms/sites/default/files/explore/download/biogas_manual_final.pdf", type: "manual" },
          { text: "Methane Production Calculations", url: "https://www.extension.iastate.edu/alternativeag/cropproduction/pdf/methaneproduction.pdf", type: "calculator" },
          { text: "Biogas Safety Guidelines", url: "https://www.hse.gov.uk/waste/biogas.htm", type: "safety" }
        ]
      },
      2: {
        title: "Waste Management",
        category: "Environmental Science",
        duration: "60 min",
        difficulty: "Intermediate",
        instructor: "Prof. Michael Chen, Waste Management Specialist",
        rating: 4.7,
        students: 9234,
        sections: [
          {
            title: "Understanding Organic Waste Streams",
            content: "Organic waste encompasses kitchen scraps, agricultural residues, animal waste, and market waste. Each stream has unique characteristics requiring specific handling procedures to maximize resource recovery and minimize environmental impact."
          },
          {
            title: "Collection & Transportation Systems",
            content: "Effective collection involves source separation, regular pickup schedules, appropriate storage containers, and quality control measures. Proper systems reduce costs, improve efficiency, and enhance end-product quality."
          },
          {
            title: "Processing Technologies",
            content: "Processing methods include composting, anaerobic digestion, vermicomposting, and fermentation. Method selection depends on waste characteristics, available resources, climate conditions, and desired end products."
          },
          {
            title: "Economic & Environmental Benefits",
            content: "Benefits include waste volume reduction, methane emission prevention, soil health improvement, and creation of valuable products. Economic advantages encompass reduced disposal costs and income generation opportunities."
          }
        ],
        keyPoints: [
          "Organic waste comprises 40-60% of total municipal solid waste in developing countries",
          "Proper composting can reduce waste volume by 50-70% while creating valuable soil amendment",
          "Anaerobic digestion can process wet organic waste with 80-95% moisture content",
          "Vermicomposting produces castings with 5-7 times more nutrients than regular compost",
          "Food waste generates 3.3 gigatons of CO2 equivalent annually when decomposing in landfills",
          "Composting temperatures of 55-65°C for 15 days eliminate most pathogens and weed seeds",
          "Optimal compost C:N ratio is 25-30:1, achieved by mixing green and brown materials",
          "Compost moisture should be maintained at 50-60% - feeling like a wrung-out sponge",
          "Turning compost every 2-3 weeks accelerates decomposition and prevents odors",
          "Finished compost has earthy smell, dark color, and crumbly texture",
          "Biogas slurry contains 1.5-2% nitrogen, 1% phosphorus, and 1% potassium",
          "Liquid fertilizer from anaerobic digestion is immediately available to plants",
          "Proper waste segregation can increase processing efficiency by 40-60%",
          "Collection frequency should match waste generation rates to prevent spoilage",
          "Storage containers should be ventilated, covered, and easy to clean",
          "Waste sorting at source reduces contamination by 80-90%",
          "Composting reduces greenhouse gas emissions by 50% compared to landfilling",
          "Vermicomposting can process 0.5-1 kg waste per kg of worms daily",
          "Compost application increases soil water retention by 20-30%",
          "Organic waste recycling creates 10-15 jobs per 1000 tons processed annually",
          "Biogas production from food waste averages 100-200 m³ per ton",
          "Composting eliminates 99% of pathogenic organisms when done properly",
          "Waste collection costs can be reduced by 30-40% with proper route optimization",
          "Community composting programs achieve 60-80% participation rates",
          "Organic fertilizer from waste reduces chemical fertilizer needs by 40-60%",
          "Waste processing facilities require 2-5 hectares per 100,000 population served",
          "Investment payback period for waste processing facilities: 5-8 years",
          "Compost market value: $20-50 per ton depending on quality and location",
          "Waste diversion rates can reach 70-85% with comprehensive programs",
          "Processing capacity: 50-100 kg per cubic meter of digester volume daily"
        ],
        practicalTips: [
          "Separate organic waste at the source to prevent contamination",
          "Use covered containers to prevent odors and pest attraction",
          "Establish regular collection schedules to prevent waste spoilage",
          "Train community members on proper waste segregation techniques",
          "Monitor compost temperature and moisture levels regularly",
          "Create incentive programs to encourage participation",
          "Develop local markets for compost and biogas products",
          "Implement quality control measures for end products",
          "Design collection routes for maximum efficiency",
          "Partner with local farmers for compost distribution"
        ],
        relatedTopics: [
          { id: 1, title: "Biogas Technology", type: "related" },
          { id: 3, title: "Environmental Benefits", type: "related" },
          { id: 4, title: "Community Empowerment", type: "advanced" }
        ],
        resources: [
          { text: "FAO Organic Waste Management Guide", url: "http://www.fao.org/3/i3388e/i3388e.pdf", type: "guide" },
          { text: "Composting Best Practices Manual", url: "https://www.epa.gov/sites/production/files/2018-05/documents/final_compost_guide_508_compliant.pdf", type: "manual" },
          { text: "Waste-to-Energy Technologies", url: "https://www.irena.org/publications/2017/Mar/Biogas-for-domestic-cooking", type: "report" },
          { text: "Organic Waste Recycling Guidelines", url: "https://www.unep.org/resources/report/global-waste-management-outlook", type: "guidelines" },
          { text: "Municipal Solid Waste Management", url: "https://openknowledge.worldbank.org/handle/10986/30317", type: "research" }
        ]
      },
      3: {
        title: "Environmental Impact & Health Benefits",
        category: "Public Health",
        content: `The environmental and health benefits of biogas technology extend far beyond simple waste management, creating positive impacts on climate change mitigation, ecosystem protection, and community health improvement.

Climate change mitigation occurs through multiple mechanisms: preventing methane emissions from decomposing organic waste (methane is 25 times more potent than CO2 as a greenhouse gas), replacing fossil fuels with renewable biogas, reducing deforestation pressure by providing alternative cooking fuel, and sequestering carbon in soil through biogas slurry application.

Ecosystem protection benefits include preventing water contamination from organic waste runoff, reducing soil degradation through organic fertilizer use, protecting biodiversity by decreasing pressure on natural resources, and improving air quality by eliminating open burning of waste materials.

Health benefits are particularly significant for women and children who spend more time around cooking areas. Indoor air pollution from traditional biomass burning causes respiratory diseases, eye irritation, cardiovascular problems, and premature deaths. Biogas burns cleanly without smoke, dramatically reducing these health risks.

Community health improvements include reduced disease vector breeding in organic waste, improved sanitation through proper waste management, better nutrition from increased food safety, and enhanced quality of life through cleaner living environments.

Economic health benefits encompass reduced healthcare costs from respiratory diseases, increased productivity due to better health, time savings from efficient cooking methods, and improved educational outcomes as children spend less time collecting firewood and more time in school.

Environmental monitoring shows that biogas projects can reduce household carbon footprints by 2-4 tons CO2 equivalent annually, decrease particulate matter emissions by 90%, and eliminate up to 95% of methane emissions from organic waste decomposition.`,
        notes: [
          "Indoor air pollution causes 4.3 million premature deaths annually worldwide",
          "Women and children face 20 times higher exposure to cooking smoke than men",
          "Biogas reduces particulate matter emissions by 90% compared to wood burning",
          "One biogas plant can prevent 2-4 tons of CO2 equivalent emissions per year",
          "Methane has 25 times higher global warming potential than carbon dioxide",
          "Biogas slurry increases soil organic carbon by 15-25% over 3-5 years",
          "Clean cooking reduces respiratory infections in children by 50%",
          "Time saved from fuel collection averages 2-4 hours daily for women",
          "Biogas cooking reduces kitchen temperatures by 5-8°C compared to wood fires",
          "Eye irritation from cooking smoke affects 80% of women using traditional fuels",
          "Cardiovascular disease risk decreases by 30% with clean cooking adoption",
          "Biogas projects can reduce deforestation rates by 20-40% in local areas",
          "Water quality improves as organic waste is diverted from water sources",
          "Soil fertility increases by 20-30% with regular biogas slurry application",
          "Healthcare cost savings average $50-100 per household annually"
        ],
        links: [
          { text: "WHO Indoor Air Pollution Report", url: "https://www.who.int/news-room/fact-sheets/detail/household-air-pollution-and-health" },
          { text: "Climate Benefits of Biogas", url: "https://www.ipcc.ch/report/renewable-energy-sources-and-climate-change-mitigation/" },
          { text: "Health Impact Assessment Guide", url: "https://www.cleancookingalliance.org/about/news/04-28-2016-new-health-impact-assessment-toolkit.html" },
          { text: "Environmental Benefits Study", url: "https://www.sciencedirect.com/science/article/pii/S0960148118304270" },
          { text: "Gender and Energy Access", url: "https://www.unwomen.org/en/digital-library/publications/2018/5/the-energy-access-situation-report" }
        ]
      },
      4: {
        title: "Community Empowerment",
        category: "Social Development",
        content: `Community empowerment through biogas technology creates sustainable development opportunities that extend beyond energy access to encompass education, economic growth, and social transformation.

Educational opportunities emerge through technical skills development in system installation, operation, and maintenance. Community members learn about renewable energy principles, waste management practices, business development, and financial management. These skills create pathways for employment and entrepreneurship while building local capacity for technology adoption and innovation.

Economic empowerment occurs through multiple income streams: waste collection services, biogas sales, fertilizer marketing, system installation and maintenance services, and value-added processing of biogas byproducts. These opportunities are particularly beneficial for women, youth, and marginalized groups who may have limited access to traditional employment.

Social benefits include improved community organization through cooperative formation, enhanced gender equality through women's participation in technical roles, strengthened social cohesion through collaborative projects, and increased community pride through environmental achievements.

Capacity building programs focus on technical training (system design, construction, troubleshooting), business skills (marketing, financial management, customer service), leadership development (project management, community organizing), and knowledge transfer (peer-to-peer learning, mentorship programs).

Institutional support includes access to microfinance for system installation, technical assistance for problem-solving, market linkages for product sales, and policy advocacy for supportive regulations. These support systems ensure sustainable adoption and long-term success of biogas initiatives.

Scaling strategies involve demonstration projects to showcase benefits, training programs to build local expertise, financing mechanisms to overcome cost barriers, and policy frameworks to support widespread adoption.`,
        notes: [
          "Women's participation in biogas projects increases household decision-making power by 40%",
          "Technical training programs create employment for 15-20% of participants",
          "Community biogas projects reduce fuel expenses by 60-80% for participating households",
          "Cooperative formation increases project success rates by 70%",
          "Youth engagement in biogas projects reduces rural-urban migration by 25%",
          "Women save 2-4 hours daily from reduced fuel collection and cooking time",
          "Income from biogas-related activities averages $200-500 annually per household",
          "Leadership training increases women's participation in community decisions by 50%",
          "Peer learning networks improve system performance by 30-40%",
          "Microfinance access enables 80% of interested households to install systems",
          "Technical support reduces system failure rates from 40% to less than 10%",
          "Community ownership increases project sustainability by 85%",
          "Skills transfer creates local employment for 5-10 people per 100 households served",
          "Social cohesion improvements reduce community conflicts by 30%",
          "Educational outcomes improve as children spend more time studying instead of collecting fuel"
        ],
        links: [
          { text: "Community-Based Energy Projects", url: "https://www.irena.org/publications/2018/Jul/Community-Energy-Toolkit" },
          { text: "Gender and Renewable Energy", url: "https://www.irena.org/publications/2019/Jan/Renewable-Energy-A-Gender-Perspective" },
          { text: "Rural Development Through Biogas", url: "https://www.snv.org/cms/sites/default/files/explore/download/biogas_programme_impact_study.pdf" },
          { text: "Cooperative Development Guide", url: "https://www.ilo.org/wcmsp5/groups/public/---ed_emp/---emp_ent/---coop/documents/publication/wcms_166021.pdf" },
          { text: "Capacity Building Framework", url: "https://www.undp.org/content/undp/en/home/librarypage/capacity-building/" }
        ]
      },
      5: {
        title: "Technology & Innovation",
        category: "Engineering",
        content: `Biogas technology continues evolving through innovations in design, materials, monitoring systems, and integration with other renewable energy sources, making systems more efficient, affordable, and user-friendly.

Digester design innovations include fixed dome digesters with improved gas storage, floating drum systems with corrosion-resistant materials, flexible bag digesters with enhanced durability, and modular systems allowing capacity expansion. Each design offers specific advantages for different applications, climates, and user needs.

Material innovations focus on locally available resources, cost reduction, and performance improvement. New concrete formulations increase durability, plastic materials offer lightweight alternatives, biogas-resistant coatings extend system life, and prefabricated components reduce installation time and costs.

Digital integration transforms biogas systems through IoT sensors monitoring temperature, pH, and gas production, mobile applications for system management, data analytics for performance optimization, and remote monitoring capabilities. These technologies enable predictive maintenance, performance optimization, and quality control.

Smart systems incorporate automated feeding mechanisms, gas purification units, pressure regulation systems, and safety monitoring devices. Integration with solar panels, wind turbines, and battery storage creates hybrid renewable energy systems providing reliable power supply.

Process innovations include pre-treatment methods to accelerate digestion, co-digestion techniques combining different waste types, gas upgrading technologies producing vehicle-quality fuel, and waste-to-energy integration maximizing resource recovery.

Future developments focus on micro-digesters for individual households, community-scale systems with distributed generation, integration with smart grids, and carbon credit mechanisms providing additional revenue streams.`,
        notes: [
          "Modern biogas plants achieve 85-95% methane capture efficiency",
          "IoT monitoring systems reduce maintenance costs by 30-40%",
          "Prefabricated digesters reduce installation time from weeks to days",
          "Gas upgrading can increase methane content from 60% to 95%+",
          "Hybrid systems combining biogas and solar increase energy reliability by 80%",
          "Automated feeding systems reduce labor requirements by 70%",
          "Advanced materials extend digester life from 10-15 years to 20-25 years",
          "Mobile monitoring reduces system downtime by 50%",
          "Co-digestion can increase gas production by 25-40%",
          "Micro-digesters (1-2 cubic meters) serve individual households effectively",
          "Community systems (100+ cubic meters) achieve economies of scale",
          "Gas purification removes 99% of hydrogen sulfide and CO2",
          "Smart pressure regulation prevents system damage and improves safety",
          "Predictive maintenance reduces unexpected failures by 60%",
          "Integration with carbon markets provides additional income of $50-200 annually"
        ],
        links: [
          { text: "Biogas Technology Roadmap", url: "https://www.irena.org/publications/2017/Mar/Biogas-for-domestic-cooking" },
          { text: "Innovation in Anaerobic Digestion", url: "https://www.iea.org/reports/outlook-for-biogas-and-biomethane-prospects-for-organic-growth" },
          { text: "Smart Energy Systems", url: "https://www.irena.org/publications/2019/Feb/Innovation-landscape-for-smart-energy-systems" },
          { text: "Biogas Plant Design Guide", url: "https://www.giz.de/en/downloads/giz2013-en-biogas-digest-volume-1.pdf" },
          { text: "Renewable Energy Integration", url: "https://www.irena.org/publications/2017/Mar/Electricity-storage-and-renewables-costs-and-markets" }
        ]
      },
      6: {
        title: "Getting Involved",
        category: "Participation Guide",
        content: `Getting involved with biogas and sustainable energy initiatives offers multiple pathways for individuals, families, organizations, and communities to contribute to environmental protection while gaining economic and social benefits.

Individual participation begins with household waste separation, contributing organic materials to community collection systems, adopting biogas for cooking and heating, and sharing knowledge with neighbors and friends. Personal involvement creates immediate benefits while supporting larger community initiatives.

Family engagement includes installing household biogas systems, participating in cooperative purchasing programs, involving children in environmental education, and integrating sustainable practices into daily routines. Family participation demonstrates commitment and creates learning opportunities for future generations.

Community involvement encompasses organizing waste collection cooperatives, establishing community biogas plants, developing local maintenance networks, and advocating for supportive policies. Community-level action achieves economies of scale and creates sustainable support systems.

Organizational participation includes schools integrating biogas into curricula and operations, businesses contributing waste and purchasing biogas, NGOs supporting implementation and training, and government agencies creating enabling policies and regulations.

Professional opportunities exist in system design and installation, maintenance and repair services, waste collection and processing, training and education, research and development, and policy development and advocacy. These careers contribute to sustainable development while providing meaningful employment.

Getting started involves learning about biogas technology through workshops and demonstrations, assessing personal or organizational waste generation and energy needs, connecting with local biogas initiatives and support organizations, and beginning with small-scale participation before expanding involvement.`,
        notes: [
          "Household biogas systems require 20-50 kg of organic waste daily for optimal operation",
          "Community systems serve 50-200 households with shared infrastructure costs",
          "Training programs typically last 2-5 days for basic operation and maintenance",
          "Initial investment for household systems ranges from $200-800 depending on size",
          "Payback period averages 2-4 years through fuel savings and fertilizer benefits",
          "Cooperative purchasing reduces individual system costs by 20-30%",
          "Technical support networks increase system success rates by 60%",
          "Educational programs reach 80% of community members within 6 months",
          "Women's participation increases project sustainability by 70%",
          "Youth involvement ensures knowledge transfer to next generation",
          "Business partnerships provide steady waste supply and gas demand",
          "Government support accelerates adoption rates by 300-500%",
          "Financing options include microloans, subsidies, and payment plans",
          "Maintenance requirements average 2-4 hours monthly per household system",
          "Community systems create 5-10 local jobs per 100 households served"
        ],
        links: [
          { text: "Biogas User Manual", url: "https://www.snv.org/cms/sites/default/files/explore/download/biogas_user_manual.pdf" },
          { text: "Community Energy Planning", url: "https://www.irena.org/publications/2018/Jul/Community-Energy-Toolkit" },
          { text: "Financing Renewable Energy", url: "https://www.irena.org/publications/2020/Jan/Renewable-energy-finance-Institutional-capital" },
          { text: "Training Resources", url: "https://www.giz.de/en/worldwide/15109.html" },
          { text: "Policy Support Framework", url: "https://www.irena.org/publications/2018/Apr/Renewable-energy-policies-in-a-time-of-transition" }
        ]
      }
    };

    const topicContent = educationalContent[parseInt(topicId)];
    if (topicContent) {
      setContent(topicContent);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading educational content...</p>
        </div>
      </Container>
    );
  }

  if (!content) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h3>Content Not Found</h3>
          <Button variant="success" onClick={() => history.goBack()}>
            Go Back
          </Button>
        </div>
      </Container>
    );
  }

  const toggleSection = (index) => {
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSections(newCompleted);
  };

  const progress = content && content.sections ? (completedSections.size / content.sections.length) * 100 : 0;

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Course Header */}
      <div style={{ background: 'linear-gradient(135deg, #25805a, #1e6b47)', color: 'white', padding: '40px 0' }}>
        <Container>
          <Row>
            <Col lg={8}>
              <Button variant="outline-light" size="sm" onClick={() => history.goBack()} className="mb-3">
                ← Back to Courses
              </Button>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '600', marginBottom: '15px' }}>{content.title}</h1>
              <p style={{ fontSize: '1.1rem', opacity: '0.9', marginBottom: '20px' }}>
                Learn sustainable energy through practical applications
              </p>
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <Badge bg="warning" text="dark" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
                  {content.difficulty}
                </Badge>
                <span>⏱️ {content.duration}</span>
                <span>👨‍🏫 {content.instructor}</span>
                <span>⭐ {content.rating} ({content.students ? content.students.toLocaleString() : 0} students)</span>
              </div>
            </Col>
            <Col lg={4} className="text-end">
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px' }}>
                <h5>Course Progress</h5>
                <ProgressBar 
                  now={progress} 
                  style={{ height: '8px', marginBottom: '10px' }}
                  variant="warning"
                />
                <small>{Math.round(progress)}% Complete</small>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container style={{ padding: '40px 15px' }}>
        <Row>
          {/* Course Content */}
          <Col lg={8}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body style={{ padding: '30px' }}>
                <h4 style={{ color: '#25805a', marginBottom: '20px' }}>Sections</h4>
                {content.sections && content.sections.map((section, index) => (
                  <div key={index} className="mb-4">
                    <div 
                      style={{
                        background: completedSections.has(index) ? '#d4edda' : '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => toggleSection(index)}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 style={{ color: '#2c3e50', marginBottom: '0' }}>
                          {completedSections.has(index) ? '✅' : '📖'} {section.title}
                        </h5>
                        <Badge bg={completedSections.has(index) ? 'success' : 'secondary'}>
                          {completedSections.has(index) ? 'Completed' : 'Not Started'}
                        </Badge>
                      </div>
                      <p style={{ color: '#6c757d', lineHeight: '1.6', marginBottom: '0' }}>
                        {section.content}
                      </p>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Key Learning Points */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body style={{ padding: '30px' }}>
                <h4 style={{ color: '#25805a', marginBottom: '20px' }}>📚 Key Points</h4>
                <Row>
                  {content.keyPoints && content.keyPoints.map((point, index) => (
                    <Col md={6} key={index} className="mb-3">
                      <div style={{
                        background: '#e8f5e8',
                        padding: '15px',
                        borderRadius: '8px',
                        borderLeft: '4px solid #25805a',
                        height: '100%'
                      }}>
                        <small style={{ color: '#2c3e50', fontWeight: '500', lineHeight: '1.4' }}>
                          💡 {point}
                        </small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* Practical Tips */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body style={{ padding: '30px' }}>
                <h4 style={{ color: '#25805a', marginBottom: '20px' }}>🛠️ Tips</h4>
                <Row>
                  {content.practicalTips && content.practicalTips.map((tip, index) => (
                    <Col md={6} key={index} className="mb-3">
                      <div style={{
                        background: '#fff3cd',
                        padding: '15px',
                        borderRadius: '8px',
                        borderLeft: '4px solid #ffc107',
                        height: '100%'
                      }}>
                        <small style={{ color: '#856404', fontWeight: '500', lineHeight: '1.4' }}>
                          ⚡ {tip}
                        </small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Related Topics */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body style={{ padding: '25px' }}>
                <h6 style={{ color: '#25805a', marginBottom: '15px' }}>🔗 Related</h6>
                {content.relatedTopics.map((topic, index) => (
                  <div key={index} className="mb-3">
                    <Card 
                      style={{ 
                        border: '1px solid #e9ecef', 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => history.push(`/admin/educational-detail/${topic.id}`)}
                    >
                      <Card.Body style={{ padding: '15px' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 style={{ marginBottom: '5px', color: '#2c3e50' }}>{topic.title}</h6>
                            <Badge 
                              bg={topic.type === 'prerequisite' ? 'warning' : topic.type === 'advanced' ? 'danger' : 'info'}
                              style={{ fontSize: '0.7rem' }}
                            >
                              {topic.type}
                            </Badge>
                          </div>
                          <span style={{ color: '#25805a' }}>→</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Resources */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body style={{ padding: '25px' }}>
                <h6 style={{ color: '#25805a', marginBottom: '15px' }}>📖 Resources</h6>
                {content.resources.map((resource, index) => (
                  <div key={index} className="mb-3">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <Card style={{ 
                        border: '1px solid #e9ecef',
                        transition: 'all 0.3s ease'
                      }}>
                        <Card.Body style={{ padding: '15px' }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 style={{ marginBottom: '5px', color: '#25805a' }}>{resource.text}</h6>
                              <Badge bg="light" text="dark" style={{ fontSize: '0.7rem' }}>
                                {resource.type}
                              </Badge>
                            </div>
                            <span style={{ color: '#25805a' }}>🔗</span>
                          </div>
                        </Card.Body>
                      </Card>
                    </a>
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Course Actions */}
            <Card className="shadow-sm border-0">
              <Card.Body style={{ padding: '25px', textAlign: 'center' }}>
                <Button 
                  style={{
                    background: 'linear-gradient(135deg, #25805a, #1e6b47)',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '12px 30px',
                    width: '100%',
                    marginBottom: '15px'
                  }}
                  onClick={() => setCompletedSections(new Set([0, 1, 2, 3]))}
                >
                  Mark as Complete
                </Button>
                <Button 
                  variant="outline-success"
                  style={{
                    borderRadius: '25px',
                    padding: '12px 30px',
                    width: '100%'
                  }}
                  onClick={() => history.push('/admin/educational-content')}
                >
                  Browse More Courses
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EducationalDetail;