const cherio = require('cherio');
const PuppeteerHandler = require('../helpers/puppeteer.js');
const { savePerson } = require('./saver.js');

const puppeteer = new PuppeteerHandler();

const dataPersons =[];

async function personPageHandler(url, closed) {
  try {
    const pageContent = await puppeteer.getPageContent(url);
    const $ = cherio.load(pageContent);

    const dataPerson = {};

    // PERSON -------------------------------------------------------------------------------

    // --------------------------------------------------
    // name ru

    $('.styles_primaryName__2Zu1T').each((_, data) => {
      const name = $(data).text().trim();

      const nameData = name.split(' ');

      dataPerson.first_name_ru = nameData[0] || '';
      dataPerson.last_name_ru = nameData[1] || '';
    });

    // --------------------------------------------------
    // name en

    const checkNameEn = $('.styles_secondaryName__MpB48');

    if (checkNameEn) {
      $('.styles_secondaryName__MpB48').each((_, data) => {
        const name = $(data).text().trim();
  
        const nameData = name.split(' ');
  
        dataPerson.first_name_en = nameData[0] || '';
        dataPerson.last_name_en = nameData[1] || '';
      });
    } else {
      dataPerson.first_name_en = '';
      dataPerson.last_name_en = '';
    }

    // --------------------------------------------------
    // image

    const checkImg = $('.styles_sidebar__mZOfP .image');

    if (checkImg) {
      $('.styles_sidebar__mZOfP .image').each((_, data) => {
        const img = $(data).attr('src').trim();
  
        dataPerson.img = img || '';
      });
    } else {
      dataPerson.img = '';
    }


    dataPersons.push(dataPerson);

    console.info(dataPerson);

    if (dataPersons.length === 50) {
      await savePerson(dataPersons);

      dataPersons.length = 0;
    }

    if (closed) {
      puppeteer.closeBrowser();
    }

  } catch (err) {
    console.error('An error has occured \n', err);
  }
}

module.exports = personPageHandler;
