import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Container, Row, Col, Button, Card, ListGroup, Collapse, Nav } from "react-bootstrap";

function EducationalDetail() {
  const { topicId } = useParams();
  const history = useHistory();
  const [content, setContent] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState([0]);
  
  const trainerNames = [
    { name: "Dr. Sarah Johnson", title: "Environmental Science Professor", initials: "SJ" },
    { name: "Michael Chen", title: "Renewable Energy Specialist", initials: "MC" },
    { name: "Dr. Amina Hassan", title: "Biogas Technology Expert", initials: "AH" },
    { name: "James Omondi", title: "Waste Management Consultant", initials: "JO" },
    { name: "Dr. Emily Rodriguez", title: "Sustainable Development Advisor", initials: "ER" }
  ];
  
  const trainer = trainerNames[Math.floor(Math.random() * trainerNames.length)];

  const courseData = {
    1: {
      title: "Understanding Biogas Technology",
      description: "Comprehensive guide to biogas production through anaerobic digestion",
      chapters: [
        {
          title: "Introduction to Biogas",
          topics: [
            {
              title: "What is Biogas?",
              content: `Biogas is a renewable energy source produced through the anaerobic digestion of organic matter. It consists primarily of methane (CH4) at 50-70% and carbon dioxide (CO2) at 30-40%, with trace amounts of hydrogen sulfide, nitrogen, and water vapor.

The energy content of biogas ranges from 21-24 MJ/m³, making it comparable to natural gas when purified. One cubic meter of biogas is equivalent to approximately 0.6 liters of diesel fuel in terms of energy output.

Biogas production occurs naturally in environments devoid of oxygen, such as wetlands, rice paddies, and the digestive systems of ruminant animals. However, controlled anaerobic digestion in purpose-built digesters allows for efficient capture and utilization of this valuable energy resource.`,
              links: [
                { text: "International Energy Agency - Biogas Report", url: "https://www.iea.org/reports/outlook-for-biogas-and-biomethane-prospects-for-organic-growth" },
                { text: "EPA Guide to Anaerobic Digestion", url: "https://www.epa.gov/anaerobic-digestion" },
                { text: "World Biogas Association", url: "https://www.worldbiogasassociation.org/" }
              ]
            },
            {
              title: "The Anaerobic Digestion Process",
              content: `Anaerobic digestion is a complex biological process involving four distinct stages:

Hydrolysis: Complex organic polymers (carbohydrates, proteins, lipids) are broken down into simpler monomers (sugars, amino acids, fatty acids) by hydrolytic bacteria. This is often the rate-limiting step in the process.

Acidogenesis: Acidogenic bacteria convert the monomers into volatile fatty acids (VFAs), alcohols, hydrogen, and carbon dioxide. This stage produces organic acids that lower the pH of the digester.

Acetogenesis: Acetogenic bacteria convert the VFAs and alcohols into acetic acid, hydrogen, and carbon dioxide. This stage is crucial for maintaining the proper substrate for methane production.

Methanogenesis: Methanogenic archaea convert acetic acid and hydrogen/carbon dioxide into methane and carbon dioxide. This final stage produces the combustible biogas.

The entire process requires strict anaerobic conditions, with optimal temperature ranges of 35-40°C (mesophilic) or 50-60°C (thermophilic). pH must be maintained between 6.8-7.2 for optimal microbial activity.`,
              links: [
                { text: "Anaerobic Digestion Fundamentals", url: "https://www.sciencedirect.com/topics/engineering/anaerobic-digestion" },
                { text: "Microbiology of Biogas Production", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4626696/" }
              ]
            }
          ]
        },
        {
          title: "Digester Design and Components",
          topics: [
            {
              title: "Types of Biogas Digesters",
              content: `Fixed Dome Digesters: Underground masonry structures with a fixed gas storage dome. Advantages include long lifespan (20-25 years), no moving parts, and space efficiency. Commonly used in China and India for household and community-scale applications.

Floating Drum Digesters: Feature a movable gas holder that rises and falls with gas production. Provide visible indication of gas availability but require regular maintenance of the drum. Popular in South Asia for small to medium-scale installations.

Flexible Bag Digesters: Made from PVC or polyethylene materials, these low-cost systems are portable and easy to install. Suitable for tropical climates but have shorter lifespans (5-10 years) and are vulnerable to damage.

Plug Flow Digesters: Horizontal rectangular tanks where feedstock moves from inlet to outlet. Ideal for high-solids content waste like animal manure. Commonly used in commercial livestock operations.

Complete Mix Digesters: Mechanically mixed tanks ensuring uniform temperature and substrate distribution. Suitable for diverse waste streams and co-digestion applications. Used in industrial-scale facilities.`,
              links: [
                { text: "Biogas Digester Design Manual", url: "https://www.giz.de/en/downloads/giz2013-en-biogas-digest-volume-1.pdf" },
                { text: "FAO Biogas Technology Guide", url: "http://www.fao.org/3/i3441e/i3441e.pdf" }
              ]
            },
            {
              title: "System Components and Materials",
              content: `Digester Tank: The main fermentation chamber must be airtight, structurally sound, and resistant to corrosion. Materials include reinforced concrete, brick with cement plaster, steel, or high-density polyethylene (HDPE).

Gas Storage: Can be integrated (fixed dome) or separate (floating drum, gas bag). Storage capacity should match daily production and consumption patterns. Pressure regulation is essential for safe operation.

Inlet and Outlet: Designed for easy feeding and removal of digestate. Inlet pipes should prevent air entry, while outlet chambers allow for hydraulic pressure management.

Mixing System: Mechanical or hydraulic mixing improves gas production by 15-20% by ensuring uniform temperature and preventing stratification. Can be manual, mechanical, or biogas-powered.

Heating System: In cold climates, maintaining optimal temperature requires insulation and/or active heating. Solar water heaters, heat exchangers, or biogas-fired boilers can be used.

Gas Cleaning and Conditioning: Removal of hydrogen sulfide (H2S), moisture, and CO2 improves combustion efficiency and prevents corrosion. Methods include iron oxide filters, water scrubbing, and activated carbon.

Safety Equipment: Pressure relief valves, flame arrestors, gas leak detectors, and emergency shut-off valves are essential for safe operation.`,
              links: [
                { text: "Biogas Plant Construction Manual", url: "https://www.snv.org/cms/sites/default/files/explore/download/biogas_construction_manual.pdf" },
                { text: "Materials Selection Guide", url: "https://www.irena.org/publications/2017/Mar/Biogas-for-domestic-cooking" }
              ]
            }
          ]
        },
        {
          title: "Feedstock and Substrate Management",
          topics: [
            {
              title: "Suitable Feedstock Materials",
              content: `Animal Manure: Cattle, pig, and poultry manure are excellent feedstocks with C:N ratios of 15-25:1. Fresh manure contains 70-90% moisture, ideal for anaerobic digestion. Biogas yield: 200-400 m³/ton volatile solids.

Kitchen Waste: Food scraps, vegetable peels, and cooking waste have high biogas potential (400-500 m³/ton VS) but require pH management due to rapid acidification. Should be mixed with other substrates.

Agricultural Residues: Crop residues, straw, and plant materials provide carbon-rich substrate. Require pre-treatment (chopping, soaking) to improve digestibility. C:N ratio: 50-100:1.

Market Waste: Spoiled fruits, vegetables, and organic market waste offer consistent supply in urban areas. High moisture content and readily biodegradable.

Slaughterhouse Waste: Blood, intestinal contents, and soft tissues have very high biogas potential (600-800 m³/ton VS) but require careful management to prevent ammonia inhibition.

Energy Crops: Purpose-grown crops like maize, grass, and sorghum can be used but compete with food production. Mainly used in large-scale commercial facilities.`,
              links: [
                { text: "Feedstock Characteristics Database", url: "https://www.biogas-renewable-energy.info/biogas_feedstocks.html" },
                { text: "Substrate Pre-treatment Methods", url: "https://www.sciencedirect.com/science/article/pii/S0960852413018263" }
              ]
            },
            {
              title: "Co-digestion and Optimization",
              content: `Co-digestion involves mixing different substrates to optimize biogas production. Benefits include:

Nutrient Balance: Combining carbon-rich and nitrogen-rich materials achieves optimal C:N ratio of 25-30:1. For example, mixing straw (high C:N) with manure (low C:N).

Dilution of Inhibitors: Mixing substrates dilutes potentially toxic compounds like ammonia, salts, or heavy metals that might inhibit digestion in concentrated form.

Increased Biogas Yield: Synergistic effects can increase gas production by 25-40% compared to mono-digestion. Different substrates provide diverse nutrients for microbial communities.

Improved Process Stability: Diverse substrate mix buffers against fluctuations in individual feedstock availability or quality.

Optimal Mixing Ratios:
- Cattle manure 60% + kitchen waste 40%
- Pig manure 50% + crop residues 50%
- Poultry manure 30% + vegetable waste 70%

Loading Rate: Organic loading rate (OLR) should be 1-4 kg VS/m³/day for stable operation. Overloading causes acid accumulation and process failure.

Hydraulic Retention Time (HRT): Typically 20-40 days depending on temperature and substrate. Longer HRT ensures complete digestion but requires larger digesters.`,
              links: [
                { text: "Co-digestion Best Practices", url: "https://www.irena.org/publications/2017/Mar/Biogas-for-domestic-cooking" },
                { text: "Process Optimization Guide", url: "https://www.extension.iastate.edu/alternativeag/cropproduction/pdf/methaneproduction.pdf" }
              ]
            }
          ]
        },
        {
          title: "Operation and Maintenance",
          topics: [
            {
              title: "Daily Operations",
              content: `Feeding Schedule: Maintain consistent daily feeding times to establish stable microbial populations. Feed in small batches rather than large single loads to prevent pH shock.

Monitoring Parameters:
- Temperature: Check daily, maintain within ±2°C of optimal range
- pH: Test weekly, should be 6.8-7.2
- Gas production: Record daily volume to track performance
- Pressure: Monitor gas storage pressure for safety
- Foam formation: Indicates overloading or imbalance

Mixing: Stir digester contents 2-3 times daily for household systems, continuous for commercial systems. Prevents scum formation and ensures uniform temperature.

Gas Utilization: Use biogas regularly to maintain steady production. Unused gas should be safely flared rather than vented.

Record Keeping: Maintain logs of feeding amounts, gas production, temperature, and any operational issues. Helps identify trends and optimize performance.`,
              links: [
                { text: "Operation and Maintenance Manual", url: "https://www.snv.org/cms/sites/default/files/explore/download/biogas_operation_manual.pdf" },
                { text: "Troubleshooting Guide", url: "https://www.biogas-renewable-energy.info/biogas_troubleshooting.html" }
              ]
            },
            {
              title: "Maintenance and Troubleshooting",
              content: `Routine Maintenance:
- Weekly: Check for gas leaks using soap solution, inspect pipes and connections
- Monthly: Clean gas pipes and water traps, check pressure relief valves
- Quarterly: Inspect digester structure for cracks, test safety equipment
- Annually: Empty and clean digester, inspect internal components, replace worn parts

Common Problems and Solutions:

Low Gas Production:
- Cause: Low temperature, overloading, toxic substances, nutrient imbalance
- Solution: Adjust feeding rate, improve insulation, check substrate quality, add buffer materials

Foul Odor:
- Cause: Gas leaks, incomplete combustion, H2S buildup
- Solution: Repair leaks, clean burners, install H2S scrubber

Foam Formation:
- Cause: Overloading, high protein content, rapid gas production
- Solution: Reduce feeding rate, add anti-foaming agents, improve mixing

pH Drop:
- Cause: Overloading, insufficient alkalinity
- Solution: Reduce feeding, add lime or wood ash, increase HRT

Scum Layer:
- Cause: High fat content, insufficient mixing
- Solution: Improve mixing, reduce fat input, break up scum manually

Safety Considerations:
- Never enter digester without proper ventilation and safety equipment
- Test for methane and oxygen levels before entry
- Use explosion-proof lighting and tools
- Have emergency procedures in place
- Train all operators in safety protocols`,
              links: [
                { text: "Safety Guidelines", url: "https://www.hse.gov.uk/waste/biogas.htm" },
                { text: "Maintenance Checklist", url: "https://www.biogas-renewable-energy.info/biogas_maintenance.html" }
              ]
            }
          ]
        }
      ]
    },
    2: {
      title: "Organic Waste Collection & Management",
      description: "Comprehensive strategies for collecting and managing organic waste for biogas production",
      chapters: [
        {
          title: "Waste Stream Identification",
          topics: [
            {
              title: "Municipal Organic Waste",
              content: `Municipal solid waste in developing countries contains 40-60% organic material, representing a significant resource for biogas production.

Residential Waste: Kitchen scraps, food waste, garden trimmings. Generation rate: 0.3-0.5 kg/person/day. Characteristics: High moisture (70-80%), readily biodegradable, variable composition.

Commercial Waste: Restaurants, hotels, food processing facilities. Generation rate: 2-10 kg/employee/day. Characteristics: Consistent quality, high organic content, potential for contamination with packaging.

Market Waste: Spoiled produce, vegetable trimmings, unsold items. Generation rate: 50-200 kg/vendor/day. Characteristics: Seasonal variation, high moisture, rapid decomposition.

Institutional Waste: Schools, hospitals, prisons. Generation rate: 0.2-0.4 kg/person/day. Characteristics: Predictable generation, controlled quality, regular collection schedule.

Collection Strategies:
- Source separation at point of generation
- Color-coded bins for different waste types
- Regular collection schedules (daily for food waste)
- Quality control to prevent contamination
- Incentive programs for participation`,
              links: [
                { text: "World Bank Waste Management Report", url: "https://openknowledge.worldbank.org/handle/10986/30317" },
                { text: "UN Environment Waste Guidelines", url: "https://www.unep.org/resources/report/global-waste-management-outlook" }
              ]
            },
            {
              title: "Agricultural and Livestock Waste",
              content: `Agricultural waste represents the largest potential feedstock for biogas production globally.

Crop Residues: Straw, stalks, husks, leaves. Generation: 1-3 tons/hectare/harvest. Characteristics: High C:N ratio (50-100:1), requires pre-treatment, seasonal availability.

Animal Manure: Cattle, pigs, poultry, sheep. Generation: 10-40 kg/animal/day (cattle), 2-4 kg/animal/day (pigs). Characteristics: Consistent composition, optimal C:N ratio, year-round availability.

Processing Waste: Fruit pulp, vegetable trimmings, grain waste. Generation: 10-30% of processed material. Characteristics: High biogas potential, concentrated source, may require pH adjustment.

Slaughterhouse Waste: Blood, intestinal contents, soft tissues, bones. Generation: 20-40 kg/animal slaughtered. Characteristics: Very high biogas potential, requires careful handling, potential pathogen concerns.

Collection Considerations:
- Proximity to generation source
- Transportation costs and logistics
- Storage requirements
- Seasonal variations
- Quality control measures
- Biosecurity protocols`,
              links: [
                { text: "FAO Agricultural Waste Management", url: "http://www.fao.org/3/i3388e/i3388e.pdf" },
                { text: "Livestock Waste Utilization", url: "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/livestock-waste" }
              ]
            }
          ]
        },
        {
          title: "Collection Systems Design",
          topics: [
            {
              title: "Collection Infrastructure",
              content: `Effective waste collection requires appropriate infrastructure, equipment, and logistics.

Storage Containers:
- Household: 20-50 liter bins with tight-fitting lids
- Commercial: 120-240 liter wheeled bins
- Bulk: 1-10 cubic meter containers or compactors
- Materials: HDPE plastic, galvanized steel, or fiberglass
- Features: Ventilation holes, drainage, easy cleaning, pest-proof

Collection Vehicles:
- Small-scale: Handcarts, bicycle trailers, motorcycles with trailers
- Medium-scale: Pickup trucks, small compactor trucks
- Large-scale: Rear-loader trucks, side-loader trucks, roll-off trucks
- Capacity: Match to route density and distance to processing facility

Transfer Stations:
- Purpose: Consolidate waste from multiple collection routes
- Location: Strategic points between collection areas and processing facility
- Features: Covered area, weighbridge, quality control station, temporary storage
- Benefits: Reduce transportation costs, improve efficiency, enable quality control

Route Optimization:
- Use GIS mapping to plan efficient routes
- Consider traffic patterns and road conditions
- Balance load across collection days
- Minimize travel distance and time
- Account for seasonal variations

Collection Frequency:
- Food waste: Daily or every 2 days (rapid decomposition)
- Garden waste: Weekly
- Agricultural waste: Seasonal, as available
- Market waste: Daily
- Institutional waste: Daily or every 2 days`,
              links: [
                { text: "Waste Collection Best Practices", url: "https://www.epa.gov/sites/production/files/2016-03/documents/r5_mswc_final.pdf" },
                { text: "Route Optimization Tools", url: "https://www.waste360.com/fleet-technology/route-optimization-software-guide" }
              ]
            },
            {
              title: "Quality Control and Monitoring",
              content: `Quality control ensures feedstock suitability for biogas production and prevents process disruptions.

Acceptance Criteria:
- Organic content: >80% by weight
- Moisture content: 60-90% for wet digestion
- Contamination: <5% non-organic materials
- Particle size: <50mm for most digesters
- pH: 5-9 (will be adjusted in digester)
- No toxic substances: heavy metals, pesticides, antibiotics

Inspection Procedures:
- Visual inspection at collection point
- Random sampling for detailed analysis
- Rejection of contaminated loads
- Documentation of waste sources and quantities
- Regular feedback to waste generators

Weighing and Recording:
- Weighbridge or platform scales at facility
- Record weight, source, date, and quality
- Track seasonal variations
- Calculate biogas yield per source
- Identify best-performing sources

Pre-treatment:
- Sorting to remove contaminants
- Size reduction (shredding, chopping)
- Moisture adjustment if needed
- Mixing different waste streams
- Hygienization if required (pathogens)

Storage Management:
- Maximum storage time: 2-3 days for food waste
- Covered storage to prevent odors and pests
- First-in-first-out (FIFO) system
- Temperature monitoring
- Leachate collection and management`,
              links: [
                { text: "Quality Control Guidelines", url: "https://www.biogas-renewable-energy.info/biogas_feedstocks.html" },
                { text: "Waste Characterization Methods", url: "https://www.sciencedirect.com/topics/engineering/waste-characterization" }
              ]
            }
          ]
        },
        {
          title: "Community Engagement",
          topics: [
            {
              title: "Stakeholder Participation",
              content: `Successful waste management requires active participation from all stakeholders.

Awareness Campaigns:
- Public meetings and workshops
- School education programs
- Mass media campaigns (radio, posters, social media)
- Demonstration projects
- Success story sharing

Incentive Programs:
- Reduced waste collection fees for participants
- Payment for delivered organic waste
- Free compost or biogas for contributors
- Recognition and awards for best performers
- Community benefit sharing from biogas sales

Training Programs:
- Waste separation techniques
- Proper storage and handling
- Collection schedules and procedures
- Benefits of participation
- Environmental and health impacts

Feedback Mechanisms:
- Regular community meetings
- Complaint and suggestion systems
- Performance reporting
- Transparent operations
- Responsive management

Behavior Change:
- Start with early adopters and champions
- Demonstrate tangible benefits
- Make participation easy and convenient
- Provide ongoing support and encouragement
- Celebrate successes and milestones`,
              links: [
                { text: "Community Engagement Guide", url: "https://www.worldbank.org/en/topic/urbandevelopment/brief/solid-waste-management" },
                { text: "Behavior Change Strategies", url: "https://www.unep.org/resources/report/global-waste-management-outlook" }
              ]
            }
          ]
        }
      ]
    }
  };

  useEffect(() => {
    const course = courseData[parseInt(topicId)];
    if (course) {
      setContent(course);
      if (course.chapters[0]?.topics[0]) {
        setSelectedTopic(course.chapters[0].topics[0]);
      }
    }
  }, [topicId]);

  const toggleChapter = (index) => {
    setExpandedChapters(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };
  
  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  if (!content) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h3>Course not found</h3>
          <Button variant="success" onClick={() => history.push('/admin/educational-content')}>
            Back to Courses
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div style={{ background: "#f7f9fa", minHeight: "100vh" }}>
      {/* Top Navigation */}
      <div style={{ background: "#fff", borderBottom: "1px solid #d1d7dc", padding: "12px 0" }}>
        <Container fluid style={{ maxWidth: "1340px" }}>
          <Nav style={{ fontSize: "14px" }}>
            <Nav.Link href="#" style={{ color: "#1c1d1f", padding: "8px 16px" }}>Home</Nav.Link>
            <Nav.Link href="#" style={{ color: "#1c1d1f", padding: "8px 16px", fontWeight: 600 }}>My Learning</Nav.Link>
            <Nav.Link href="#" style={{ color: "#1c1d1f", padding: "8px 16px" }}>Catalog</Nav.Link>
            <Nav.Link href="#" style={{ color: "#1c1d1f", padding: "8px 16px" }}>Favorites <span style={{ background: "#e4e8eb", padding: "2px 8px", borderRadius: "3px", marginLeft: "4px" }}>1</span></Nav.Link>
          </Nav>
        </Container>
      </div>

      {/* Course Title Bar */}
      <div style={{ background: "#2d2f31", color: "#fff", padding: "16px 0" }}>
        <Container fluid style={{ maxWidth: "1340px", display: "flex", alignItems: "center" }}>
          <Button 
            variant="link" 
            onClick={() => history.push('/admin/educational-content')} 
            style={{ 
              color: "#fff", 
              textDecoration: "none", 
              padding: "0 12px 0 0", 
              fontSize: "20px",
              fontWeight: 300,
              border: "none",
              background: "none"
            }}
          >
            &lt;
          </Button>
          <h5 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>{content.title}</h5>
        </Container>
      </div>

      {/* Main Content Layout */}
      <Container fluid style={{ padding: 0, maxWidth: "1340px" }}>
        <Row style={{ margin: 0 }}>
          {/* Left Sidebar - Chapter List */}
          <Col md={7} lg={8} style={{ background: "#fff", padding: "24px", maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}>
            {content.chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} style={{ marginBottom: "16px" }}>
                <div
                  onClick={() => toggleChapter(chapterIndex)}
                  style={{
                    padding: "14px 16px",
                    background: "#f7f9fa",
                    border: "1px solid #d1d7dc",
                    borderRadius: "0",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1c1d1f",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span>📄 {chapter.title}</span>
                  <span style={{ fontSize: "12px", color: "#6a6f73" }}>{chapter.topics.length} chapter</span>
                </div>
                <Collapse in={expandedChapters.includes(chapterIndex)}>
                  <div>
                    {chapter.topics.map((topic, topicIndex) => {
                      const isSelected = selectedTopic?.title === topic.title;
                      return (
                        <div
                          key={topicIndex}
                          onClick={() => handleTopicClick(topic)}
                          style={{
                            cursor: "pointer",
                            background: isSelected ? "#f7f9fa" : "#fff",
                            border: "1px solid #d1d7dc",
                            borderTop: "none",
                            padding: "12px 16px 12px 40px",
                            fontSize: "14px",
                            color: "#1c1d1f"
                          }}
                        >
                          📄 Chapter {topicIndex + 1}: {topic.title}
                        </div>
                      );
                    })}
                  </div>
                </Collapse>
              </div>
            ))}
          </Col>

          {/* Right Sidebar - Course Details */}
          <Col md={5} lg={4} style={{ background: "#fff", padding: "24px", borderLeft: "1px solid #d1d7dc", maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}>
            {/* Topic Content Display */}
            {selectedTopic && (
              <Card style={{ border: "1px solid #d1d7dc", borderRadius: "0", marginBottom: "20px" }}>
                <Card.Body style={{ padding: "20px" }}>
                  <h5 style={{ fontSize: "18px", fontWeight: 700, color: "#1c1d1f", marginBottom: "16px" }}>{selectedTopic.title}</h5>
                  <div style={{ fontSize: "14px", color: "#1c1d1f", lineHeight: 1.7, whiteSpace: "pre-line", marginBottom: "20px" }}>
                    {selectedTopic.content}
                  </div>
                  
                  {selectedTopic.links && selectedTopic.links.length > 0 && (
                    <div>
                      <h6 style={{ fontSize: "14px", fontWeight: 600, color: "#1c1d1f", marginBottom: "12px" }}>Additional Resources:</h6>
                      {selectedTopic.links.map((link, index) => (
                        <div key={index} style={{ marginBottom: "8px" }}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#5624d0", textDecoration: "none", fontSize: "13px" }}
                          >
                            → {link.text}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
            
            <Card style={{ border: "1px solid #d1d7dc", borderRadius: "0", marginBottom: "20px" }}>
              <Card.Body style={{ padding: "20px" }}>
                <h6 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1d1f", marginBottom: "16px" }}>Details content</h6>
                
                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", fontSize: "14px" }}>
                  <span style={{ marginRight: "8px" }}>⏱️</span>
                  <span style={{ color: "#1c1d1f" }}>3 Hours Estimation</span>
                </div>
                
                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", fontSize: "14px" }}>
                  <span style={{ marginRight: "8px" }}>⚡</span>
                  <span style={{ color: "#1c1d1f" }}>100 Points</span>
                </div>
                
                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", fontSize: "14px" }}>
                  <span style={{ marginRight: "8px" }}>🌐</span>
                  <span style={{ color: "#1c1d1f" }}>English</span>
                </div>
                
                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", fontSize: "14px" }}>
                  <span style={{ marginRight: "8px" }}>🎓</span>
                  <span style={{ color: "#1c1d1f" }}>Certificate of Completion</span>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
                  <span style={{ marginRight: "8px" }}>📅</span>
                  <span style={{ color: "#1c1d1f" }}>No due date for this content</span>
                </div>
              </Card.Body>
            </Card>

            <Card style={{ border: "1px solid #d1d7dc", borderRadius: "0" }}>
              <Card.Body style={{ padding: "20px" }}>
                <h6 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1d1f", marginBottom: "16px" }}>Trainer</h6>
                
                <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#5624d0", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px", fontWeight: 600, marginRight: "12px" }}>
                    {trainer.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#1c1d1f" }}>{trainer.name}</div>
                    <div style={{ fontSize: "12px", color: "#6a6f73" }}>{trainer.title}</div>
                  </div>
                </div>
                
                <div style={{ fontSize: "12px", color: "#6a6f73", padding: "8px 12px", background: "#f7f9fa", borderRadius: "4px" }}>
                  Content Author
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EducationalDetail;
