import axios from 'axios';
import * as cheerio from 'cheerio';

interface ForumTopic {
  title: string | null;
  link: string | undefined;
  owner: string | null;
}

async function scrapeTopicPage(page: number, category: number): Promise<ForumTopic[]> {
  try {
    const url = `https://scratch.mit.edu/discuss/${category}/?page=${page}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const frontPage: ForumTopic[] = [];

    $('tr').slice(1).each((_, row) => {
      const relevantTd = $(row).find('td').eq(0);
      const link = relevantTd.find('a');
      const forum_link = link.attr('href') ? `https://scratch.mit.edu${link.attr('href')}` : undefined;
      const forum_title = link.text().trim();
      const ownerRaw = relevantTd.find('span').text().trim();
      const forum_owner = ownerRaw.replace(/^by\s+/i, '') || null;
      frontPage.push({
        title: forum_title || null,
        link: forum_link,
        owner: forum_owner,
      });
    });

    return frontPage;
  } catch (error) {
    console.error('Error fetching the page:', error);
    return [];
  }
}

scrapeTopicPage(1, 1)
