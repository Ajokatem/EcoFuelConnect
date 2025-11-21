const express = require('express');
const router = express.Router();
const axios = require('axios');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

router.use(helmet());

const educationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests, please try again later.' }
});

router.use(educationLimiter);

// Fallback educational content
const fallbackContent = {
  'biogas': {
    title: 'Biogas Technology',
    extract: 'Biogas is a renewable energy source produced through anaerobic digestion of organic matter. It consists primarily of methane and carbon dioxide, making it an excellent clean fuel alternative for cooking, heating, and electricity generation.',
    url: 'https://en.wikipedia.org/wiki/Biogas'
  },
  'organic waste management': {
    title: 'Organic Waste Management',
    extract: 'Organic waste management involves the collection, processing, and disposal of biodegradable waste materials. Effective management reduces environmental impact and can generate valuable resources like compost and biogas.',
    url: 'https://en.wikipedia.org/wiki/Organic_waste'
  },
  'renewable energy': {
    title: 'Renewable Energy',
    extract: 'Renewable energy comes from natural sources that are constantly replenished, including solar, wind, hydroelectric, and biomass energy. These sources are sustainable and environmentally friendly alternatives to fossil fuels.',
    url: 'https://en.wikipedia.org/wiki/Renewable_energy'
  },
  'climate change': {
    title: 'Climate Change',
    extract: 'Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, human activities have been the main driver of climate change since the 1800s.',
    url: 'https://en.wikipedia.org/wiki/Climate_change'
  },
  'sustainable development': {
    title: 'Sustainable Development',
    extract: 'Sustainable development meets present needs without compromising future generations ability to meet their own needs. It balances economic growth, environmental protection, and social equity.',
    url: 'https://en.wikipedia.org/wiki/Sustainable_development'
  }
};

const fallbackNews = [
  {
    title: 'Biogas Production Increases Globally',
    description: 'Recent studies show significant growth in biogas production worldwide, with developing countries leading adoption of small-scale digesters.',
    url: '#'
  },
  {
    title: 'Waste-to-Energy Projects Expand in Africa',
    description: 'African nations are increasingly investing in waste-to-energy infrastructure to address both waste management and energy needs.',
    url: '#'
  },
  {
    title: 'Climate Benefits of Organic Waste Recycling',
    description: 'New research highlights the significant climate benefits of converting organic waste to energy rather than allowing it to decompose in landfills.',
    url: '#'
  }
];

// Wikipedia API for educational content with fallback
const getWikipediaContent = async (topic) => {
  try {
    const response = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(topic), {
      timeout: 5000
    });
    return {
      title: response.data.title,
      extract: response.data.extract,
      thumbnail: response.data.thumbnail?.source,
      url: response.data.content_urls?.desktop?.page
    };
  } catch (error) {
    console.log(`Wikipedia API failed for ${topic}, using fallback`);
    return fallbackContent[topic.toLowerCase()] || {
      title: topic,
      extract: `Learn about ${topic} and its applications in sustainable development and environmental protection.`,
      url: '#'
    };
  }
};

// News API for environmental articles with fallback
const getEnvironmentalNews = async (query) => {
  try {
    if (!process.env.NEWS_API_KEY || process.env.NEWS_API_KEY === 'demo') {
      return fallbackNews;
    }
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 5,
        apiKey: process.env.NEWS_API_KEY
      },
      timeout: 5000
    });
    return response.data.articles || fallbackNews;
  } catch (error) {
    console.log(`News API failed for ${query}, using fallback`);
    return fallbackNews;
  }
};

// GET /api/education/topics - Get educational topics with external content
router.get('/topics', async (req, res) => {
  try {
    const topics = [
      {
        id: 1,
        title: "Biogas Technology",
        category: "Renewable Energy",
        description: "Learn about biogas production, applications, and benefits",
        searchTerms: ["biogas", "anaerobic digestion", "methane production"]
      },
      {
        id: 2,
        title: "Waste Management",
        category: "Environmental Science",
        description: "Organic waste collection and processing techniques",
        searchTerms: ["organic waste management", "composting", "waste recycling"]
      },
      {
        id: 3,
        title: "Renewable Energy",
        category: "Clean Technology",
        description: "Sustainable energy sources and technologies",
        searchTerms: ["renewable energy", "solar power", "wind energy"]
      },
      {
        id: 4,
        title: "Climate Change",
        category: "Environmental Impact",
        description: "Understanding climate change and mitigation strategies",
        searchTerms: ["climate change", "global warming", "carbon footprint"]
      },
      {
        id: 5,
        title: "Sustainable Development",
        category: "Development Studies",
        description: "Sustainable development goals and practices",
        searchTerms: ["sustainable development", "SDGs", "environmental sustainability"]
      }
    ];

    // Fetch external content for each topic
    const enrichedTopics = await Promise.all(
      topics.map(async (topic) => {
        const wikiContent = await getWikipediaContent(topic.searchTerms[0]);
        const news = await getEnvironmentalNews(topic.searchTerms[0]);
        
        return {
          ...topic,
          externalContent: {
            wikipedia: wikiContent,
            news: news.slice(0, 3)
          }
        };
      })
    );

    res.json({
      success: true,
      topics: enrichedTopics
    });
  } catch (error) {
    console.error('Error fetching educational topics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch educational content'
    });
  }
});

// GET /api/education/topic/:id - Get detailed topic content
router.get('/topic/:id', async (req, res) => {
  try {
    const topicId = parseInt(req.params.id);
    
    const topicMap = {
      1: { title: "Biogas Technology", terms: ["biogas", "anaerobic digestion", "methane production"] },
      2: { title: "Waste Management", terms: ["organic waste management", "composting", "waste recycling"] },
      3: { title: "Renewable Energy", terms: ["renewable energy", "solar power", "wind energy"] },
      4: { title: "Climate Change", terms: ["climate change", "global warming", "carbon footprint"] },
      5: { title: "Sustainable Development", terms: ["sustainable development", "SDGs", "environmental sustainability"] }
    };

    const topic = topicMap[topicId];
    if (!topic) {
      return res.status(404).json({
        success: false,
        error: 'Topic not found'
      });
    }

    // Fetch comprehensive content
    const [wikiContent, news] = await Promise.all([
      getWikipediaContent(topic.terms[0]),
      getEnvironmentalNews(topic.terms.join(' OR '))
    ]);

    // Get additional Wikipedia articles for related terms
    const relatedArticles = await Promise.all(
      topic.terms.slice(1).map(term => getWikipediaContent(term))
    );

    res.json({
      success: true,
      topic: {
        id: topicId,
        title: topic.title,
        mainContent: wikiContent,
        relatedArticles: relatedArticles.filter(article => article !== null),
        news: news.slice(0, 5),
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching topic details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch topic details'
    });
  }
});

// GET /api/education/search - Search educational content
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const [wikiContent, news] = await Promise.all([
      getWikipediaContent(q),
      getEnvironmentalNews(q)
    ]);

    res.json({
      success: true,
      results: {
        wikipedia: wikiContent,
        news: news.slice(0, 10),
        query: q
      }
    });
  } catch (error) {
    console.error('Error searching educational content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search content'
    });
  }
});

module.exports = router;
