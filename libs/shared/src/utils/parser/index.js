const filmPageHandler = require('./handlers/filmPageHandler.js');
const personPageHandler = require('./handlers/personPageHandler.js');

const SITE_FILM = 'https://www.kinopoisk.ru/film/';
let START_PAGE_FILM = 7843; // 535341  1405508  1267348

const interval = 3000;
let closed = false;

async function film() {
  for (let index = START_PAGE_FILM; index <= START_PAGE_FILM + 1000; index++) {
    try {
      await Promise.all([
        filmPageHandler(SITE_FILM + index, closed),
        timeout(index === START_PAGE_FILM ? 30000 : interval),
      ]);

      console.info(index);

      if (index === START_PAGE_FILM + 999) {
        console.info('---------------------------------');
        closed = true;
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const SITE_PERSON = 'https://www.kinopoisk.ru/name/';
let START_PAGE_PERSON = 1; 

async function person() {
  for (let index = START_PAGE_PERSON; index <= START_PAGE_PERSON + 201; index++) {
    try {
      await Promise.all([
        personPageHandler(SITE_PERSON + index, closed),
        timeout(index === START_PAGE_PERSON ? 30000 : interval),
      ]);

      console.info(index);

      if (index === START_PAGE_PERSON + 200) {
        console.info('---------------------------------');
        closed = true;
      }

    } catch (error) {
      console.error(error);
    }
  }
}

function timeout(interval) {
  return new Promise(resolve => setTimeout(resolve, interval));
}

film();
person();