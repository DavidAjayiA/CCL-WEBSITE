const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();

const rssFeeds = [
  { url: 'https://www.mckinsey.com/feed', category: 'consulting' },
  { url: 'https://www.bcg.com/feed', category: 'consulting' },
  { url: 'https://ventureburn.com/feed/', category: 'african' },
  { url: 'http://feeds.bbc.co.uk/news/business/rss.xml', category: 'strategy' },
  { url: 'https://techcrunch.com/feed/', category: 'tech' },
  { url: 'https://feeds.bloomberg.com/markets/news.rss', category: 'strategy' }
];

const SEARCH_QUERIES = {
  consulting: ['management consulting', 'strategy consulting', 'business consulting', 'McKinsey', 'BCG', 'Bain'],
  african: ['Nigeria economy', 'African startups', 'Lagos business', 'African tech', 'West Africa'],
  tech: ['technology innovation', 'artificial intelligence', 'business technology', 'digital transformation'],
  strategy: ['business strategy', 'market analysis', 'industry trends', 'economic outlook']
};

function categorizeArticle(text) {
  const lower = text.toLowerCase();
  if (SEARCH_QUERIES.consulting.some(q => lower.includes(q.toLowerCase()))) return 'consulting';
  if (SEARCH_QUERIES.african.some(q => lower.includes(q.toLowerCase()))) return 'african';
  if (SEARCH_QUERIES.tech.some(q => lower.includes(q.toLowerCase()))) return 'tech';
  if (SEARCH_QUERIES.strategy.some(q => lower.includes(q.toLowerCase()))) return 'strategy';
  return 'all';
}

function extractImageFromContent(content) {
  if (!content) return null;
  const match = content.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/);
  return match ? match[1] : null;
}

function getPlaceholderImage(category) {
  const images = {
    consulting: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    tech: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop',
    african: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    strategy: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    default: 'https://images.unsplash.com/photo-1497993128226-dc7e82b4f1e5?w=400&h=250&fit=crop'
  };
  return images[category] || images.default;
}

async function fetchAllFeeds() {
  const allArticles = [];

  for (const feed of rssFeeds) {
    try {
      console.log(`Fetching: ${feed.url}`);
      const feedData = await parser.parseURL(feed.url);

      feedData.items.slice(0, 4).forEach(item => {
        const category = categorizeArticle(item.title + ' ' + (item.contentSnippet || ''));
        allArticles.push({
          title: item.title,
          excerpt: (item.contentSnippet || item.content || 'Read the full story').substring(0, 200),
          date: new Date(item.pubDate || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
          source: feed.url.split('/')[2].replace('www.', '').toUpperCase(),
          url: item.link || '#',
          image: item.image?.url || extractImageFromContent(item.content) || getPlaceholderImage(category),
          category: category
        });
      });
    } catch (error) {
      console.error(`Error fetching ${feed.url}:`, error.message);
    }
  }

  // Sort by date and remove duplicates
  const uniqueNews = allArticles
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((article, idx, self) => self.findIndex(a => a.title === article.title) === idx)
    .slice(0, 30);

  // Save to file
  const outputPath = path.join(process.cwd(), 'news-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(uniqueNews, null, 2));
  console.log(`✓ Saved ${uniqueNews.length} articles to news-data.json`);
}

fetchAllFeeds().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
