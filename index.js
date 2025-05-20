'use strict';
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeFrontPage() {
  try {
    const { data } = await axios.get('https://scratch.mit.edu/discuss/1');
    const $ = cheerio.load(data);
    $('tr').slice(1).each((_, row) => {
        const relevantTd = $(row).find('td').eq(0);
        const link = relevantTd.find('a');
        console.log(link.attr("href"))
        console.log(link.html());
    });
  } catch (error) {
    console.error('Error fetching the page:', error);
  }
}

scrapeFrontPage();