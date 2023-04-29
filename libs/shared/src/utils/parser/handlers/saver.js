const { slugify } = require("transliteration");

const urlFilms = 'http://localhost:4000/films';
const urlPerson = 'http://localhost:4000/persons';

async function saveFilm(dataFilm) {
  console.info(dataFilm);

  try {
    const resFilm = await fetch(urlFilms, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataFilm),
    });

    console.info(resFilm.status);

    return;
  } catch (error) {
    console.error(error);
  }
}

let start = 0;
let amount = 250;
const checkPerson = [];
const ROLES = ['режиссер', 'сценарий', 'продюсер', 'оператор', 'композитор', 'художник', 'актёр', 'актёр-дубляжа'];

async function savePerson(dataPersons) {
  console.info(dataPersons);

  try {
    const resFilms = await fetch(urlFilms + '?' + new URLSearchParams({ limit: 1000 }), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const resDataFilms = await resFilms.json();

    for (let index = start; index < start + amount; index++) {
      const resPerson = await fetch(urlPerson, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          film_id: resDataFilms[index].film_id, 
          persons: [
            {  
              film_role: ROLES[0],
              film_role_slug: slugify(ROLES[0]),
              ...dataPersons[await randomInteger(1, 5, checkPerson, 1)] 
            },
            {  
              film_role: ROLES[1],
              film_role_slug: slugify(ROLES[1]),
              ...dataPersons[await randomInteger(6, 10, checkPerson, 2)] 
            },
            {  
              film_role: ROLES[1],
              film_role_slug: slugify(ROLES[1]),
              ...dataPersons[await randomInteger(6, 10, checkPerson, 2)] 
            },
            {  
              film_role: ROLES[2],
              film_role_slug: slugify(ROLES[2]),
              ...dataPersons[await randomInteger(10, 15, checkPerson, 3)] 
            },
            {  
              film_role: ROLES[2],
              film_role_slug: slugify(ROLES[2]),
              ...dataPersons[await randomInteger(11, 15, checkPerson, 3)] 
            },
            {  
              film_role: ROLES[2],
              film_role_slug: slugify(ROLES[2]),
              ...dataPersons[await randomInteger(11, 15, checkPerson, 3)] 
            },
            {  
              film_role: ROLES[3],
              film_role_slug: slugify(ROLES[3]),
              ...dataPersons[await randomInteger(16, 20, checkPerson, 1)] 
            },
            {  
              film_role: ROLES[4],
              film_role_slug: slugify(ROLES[4]),
              ...dataPersons[await randomInteger(21, 25, checkPerson, 1)] 
            },
            {  
              film_role: ROLES[5],
              film_role_slug: slugify(ROLES[5]),
              ...dataPersons[await randomInteger(21, 29, checkPerson, 2)] 
            },
            {  
              film_role: ROLES[5],
              film_role_slug: slugify(ROLES[5]),
              ...dataPersons[await randomInteger(26, 29, checkPerson, 2)] 
            },
            {  
              film_role: ROLES[6],
              film_role_slug: slugify(ROLES[6]),
              ...dataPersons[await randomInteger(30, 45, checkPerson, 10)] 
            },
            {  
              film_role: ROLES[6],
              film_role_slug: slugify(ROLES[6]),
              ...dataPersons[await randomInteger(30, 45, checkPerson, 10)] 
            },
            {  
              film_role: ROLES[6],
              film_role_slug: slugify(ROLES[6]),
              ...dataPersons[await randomInteger(30, 45, checkPerson, 10)] 
            },
            {  
              film_role: ROLES[6],
              film_role_slug: slugify(ROLES[6]),
              ...dataPersons[await randomInteger(30, 45, checkPerson, 10)] 
            },
            {  
              film_role: ROLES[6],
              film_role_slug: slugify(ROLES[6]),
              ...dataPersons[await randomInteger(30, 45, checkPerson, 10)] 
            },
            {  
              film_role: ROLES[6],
              film_role_slug: slugify(ROLES[6]),
              ...dataPersons[await randomInteger(30, 45, checkPerson, 10)] 
            },
            {  
              film_role: ROLES[6],
              film_role_slug: slugify(ROLES[6]),
              ...dataPersons[await randomInteger(30, 45, checkPerson, 10)] 
            },
            {  
              film_role: ROLES[6],
              film_role_slug: slugify(ROLES[6]),
              ...dataPersons[await randomInteger(30, 45, checkPerson, 10)] 
            },
            {  
              film_role: ROLES[6],
              film_role_slug: slugify(ROLES[6]),
              ...dataPersons[await randomInteger(30, 45, checkPerson, 10)] 
            },
            {  
              film_role: ROLES[6],
              film_role_slug: slugify(ROLES[6]),
              ...dataPersons[await randomInteger(30, 45, checkPerson, 10)] 
            },
            {  
              film_role: ROLES[7],
              film_role_slug: slugify(ROLES[7]),
              ...dataPersons[await randomInteger(41, 49, checkPerson, 5)] 
            },
            {  
              film_role: ROLES[7],
              film_role_slug: slugify(ROLES[7]),
              ...dataPersons[await randomInteger(41, 49, checkPerson, 5)] 
            },
            {  
              film_role: ROLES[7],
              film_role_slug: slugify(ROLES[7]),
              ...dataPersons[await randomInteger(41, 49, checkPerson, 5)] 
            },
            {  
              film_role: ROLES[7],
              film_role_slug: slugify(ROLES[7]),
              ...dataPersons[await randomInteger(41, 49, checkPerson, 5)] 
            },
            {  
              film_role: ROLES[7],
              film_role_slug: slugify(ROLES[7]),
              ...dataPersons[await randomInteger(41, 49, checkPerson, 5)] 
            },
          ] 
        }),
      });
  
      console.info(index);
      console.info(resPerson.status);
    }

    start += amount;

    return;
  } catch (error) {
    console.error(error);
  }
}

async function randomInteger(min, max, checkPerson, amountPerson) {
  return new Promise(res => {
		setTimeout(async () => {
      let rand = min + Math.random() * (max + 1 - min);

      let result = Math.floor(rand);
    
      if (checkPerson.includes(result)) {
         res(await randomInteger(min, max, checkPerson, amountPerson));
      } else {
        checkPerson.push(result);
        
        if (checkPerson.length === amountPerson) {
          checkPerson.length = 0;
        }
    
        res(result);
      }
		}, 10)
	})
}

module.exports = { saveFilm, savePerson};
