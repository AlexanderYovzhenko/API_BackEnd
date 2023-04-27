const cherio = require('cherio');
const { slugify } = require('transliteration');
const PuppeteerHandler = require('../helpers/puppeteer.js');
const { saveFilm } = require('./saver.js');

const puppeteer = new PuppeteerHandler();
const dataFilm = {};

async function filmPageHandler(url, closed) {
  try {
    const pageContent = await puppeteer.getPageContent(url);
    const $ = cherio.load(pageContent);

    // FILM -------------------------------------------------------------------------------

    // --------------------------------------------------
    // name ru

    $('[data-tid="75209b22"]').each((_, data) => {
      const name_ru = $(data).text().trim().split('(')[0].trim();

      dataFilm.name_ru = name_ru;
    });

    // --------------------------------------------------
    // name en

    const checkNameEn = $('.styles_originalTitle__JaNKM').length;

    if (checkNameEn) {
      $('.styles_originalTitle__JaNKM').each((_, data) => {
        const name_en = $(data).text().trim();
        
        dataFilm.name_en = name_en;
      });  
    } else {
      dataFilm.name_en = '';
    }

    // --------------------------------------------------
    // description

    const checkDescription = $('.styles_filmSynopsis__Cu2Oz').length;

    if (checkDescription) {
      $('.styles_filmSynopsis__Cu2Oz').each((_, data) => {
        const description = $(data).text().trim();
        
        dataFilm.description = description;
      });
    } else {
      dataFilm.description = '';
    }

    // --------------------------------------------------
    // year

    let yearData = '';
    $('.styles_row__da_RK [data-tid="cfbe5a01"]').each((_, data) => {
      yearData += $(data).text().trim() + ' ';
   
      const year = yearData.split(' ')[0];
      dataFilm.year = +year;
    });

    // --------------------------------------------------
    // country

    let countryData = '';
    $('.styles_row__da_RK [data-tid="d5ff4cc"]').each((_, data) => {
      countryData += $(data).text().trim() + '~';

      const country = countryData.split('~')[0];

      if (country.includes(',')) {
        dataFilm.country = country.split(',')[0];
      } else {
        dataFilm.country = country;
      }
    });

    // --------------------------------------------------
    // rating

    let ratingData = '';
    $('.film-rating-value').each((_, data) => {
      ratingData += $(data).text().trim() + '~';

      const rating =ratingData.split('~')[0];

      dataFilm.rating = isNaN(rating) ? 0 : +rating;
    });

    // --------------------------------------------------
    // assessments

    let assessmentsData = '';
    $('.styles_count__iOIwD .styles_count__89cAz').each((_, data) => {
      assessmentsData += $(data).text().trim() + ' ';

      const assessments = assessmentsData.split(' оце')[0];
      const assessmentsNum = assessments.split(' ').join('');

      dataFilm.assessments = isNaN(assessmentsNum) ? 0 : +assessmentsNum;
    });

    // --------------------------------------------------
    // reviews

    const checkReviews = $('.styles_reviewCount__w_RrM').length;

    if (checkReviews) {
      $('.styles_reviewCount__w_RrM').each((_, data) => {
        const reviews = $(data).text().trim();
  
        dataFilm.reviews = +reviews.split(' ')[0];
      });
    } else {
      dataFilm.reviews = 0;
    }

    // --------------------------------------------------
    // age limit

    const checkAgeLimit = $('.styles_ageRate__340KC').length;
    if (checkAgeLimit) {
      $('.styles_ageRate__340KC').each((_, data) => {
        const age_limit = $(data).text().trim();
  
        dataFilm.age_limit = +age_limit.slice(0, -1);
      });
    } else {
      dataFilm.age_limit = 16;
    }

    // --------------------------------------------------
    // duration

    $('[data-tid="e1e37c21"]').each((_, data) => {
      const duration = $(data).text().trim();

      dataFilm.duration = +duration.split(' ')[0];
    });

    // --------------------------------------------------
    // film img

    const checkImg = $('.film-poster').length;

    if (checkImg) {
      $('.film-poster').each((_, data) => {
        const img = $(data).attr('src').trim();
  
        dataFilm.img = img;
      });
    } else {
      dataFilm.img = '';
    }

    // --------------------------------------------------
    // qualities

    const checkQualities = $('.styles_movieDetails__FOUgq [data-tid="43b9c55a"]').length;

    if (checkQualities) {
      dataFilm.qualities = ['2K', 'FullHD', 'HD', '1080', '720', '5.1'];
    } else {
      dataFilm.qualities = ['FullHD', 'HD', '1080', '720', '5.1'];
    }

    // --------------------------------------------------
    // trailers

    const checkTrailers = $('.film-trailer .styles_title__vd96O').length;

    if (checkTrailers) {
      dataFilm.trailers = [];
      $('.film-trailer .styles_title__vd96O').each((index, data) => {
        const trailerHref = $(data).attr('href').trim();
  
        dataFilm.trailers.push({ trailer: 'https://www.kinopoisk.ru' + trailerHref });
  
        let imgData = '';
        $('.styles_preview__ruOp9 .image').each((_, data) => {
          imgData += $(data).attr('src').trim() + '~';
    
          const images = imgData.split('~');
    
          dataFilm.trailers[index].img = images[index];
        });
  
        let imgDate = '';
        $('.film-trailer .styles_date__d5xwh').each((_, data) => {
          imgDate += $(data).text().trim() + '~';
    
          const dates = imgDate.split('~');
  
          dataFilm.trailers[index].date = dates[index];
        });
      });
    } else {
      dataFilm.trailers = [{ trailer: '', img: '', date: '' }];
    }

    // --------------------------------------------------
    // languages audio
   
    const checkLanguages = $('.styles_movieDetails__FOUgq [data-tid="e1e37c21"]').length;

    if (checkLanguages) {
      let languagesAudioData = '';
      dataFilm.languagesAudio = [];
      $('.styles_movieDetails__FOUgq [data-tid="e1e37c21"]').each((_, data) => {
        languagesAudioData += $(data).text().trim() + '~';
  
        const languagesAudioString = languagesAudioData.split('~')[0];
  
        const languagesAudio = languagesAudioString.split(',');
  
        dataFilm.languagesAudio = [...languagesAudio];
      });

      // --------------------------------------------------
      // languages subtitle

      let languagesSubtitleData = '';
      dataFilm.languagesSubtitle = [];
      $('.styles_movieDetails__FOUgq [data-tid="e1e37c21"]').each((_, data) => {
        languagesSubtitleData += $(data).text().trim() + '~';

        const languagesSubtitleString = languagesSubtitleData.split('~')[1];

        const languagesSubtitle = languagesSubtitleString.split(',');

        dataFilm.languagesSubtitle = [...languagesSubtitle];
      });
    } else {
      dataFilm.languagesAudio = ['Русский'];
      dataFilm.languagesSubtitle = ['Русский'];
    }

    // --------------------------------------------------
    // genres

    dataFilm.genres = [];
    $('.styles_root__5PEXQ [data-tid="603f73a4"]').each((_, data) => {
      const genre_ru = $(data).text().trim();

      const genre_en = '';
      const slug = slugify(genre_ru);

      dataFilm.genres.push({ genre_ru, genre_en, slug});
    });


    await saveFilm(dataFilm);   

    if (closed) {
      puppeteer.closeBrowser();
    }

  } catch (err) {
    console.error('An error has occured \n', err);
  }
}

module.exports = filmPageHandler;
