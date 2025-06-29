import axios from 'axios';
import * as cheerio from 'cheerio';

interface ForumObj {
  title: string | null;
  link: string | undefined;
  owner: string | null;
}

async function scrapePage(): Promise<ForumObj[]> {
  try {
    const { data } = await axios.get('https://scratch.mit.edu/discuss/1');
    const $ = cheerio.load(data);
    const frontPage: ForumObj[] = [];
    $('tr').slice(1).each((_, row) => {
      const relevantTd = $(row).find('td').eq(0);
      const link = relevantTd.find('a');
      const forum_link = link.attr('href');
      const forum_title = link.html();
      const ownerSpan = relevantTd.find('span').html();
      const forum_owner = ownerSpan ? ownerSpan.slice(3) : null;
      const forumObj: ForumObj = {
        title: forum_title,
        link: forum_link,
        owner: forum_owner,
      };
      frontPage.push(forumObj);
    });
    console.log(frontPage);
    return frontPage;
  } catch (error) {
    console.error('Error fetching the page:', error);
    return [];
  }
}

scrapePage();