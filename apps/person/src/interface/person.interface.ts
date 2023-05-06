export interface ICreatePerson {
  film_role: string;
  film_role_slug: string;
  first_name_ru: string;
  last_name_ru: string;
  first_name_en: string;
  last_name_en: string;
  img: string;
}

export interface IShortPerson {
  first_name: string;
  last_name: string;
  film_role: string;
}
