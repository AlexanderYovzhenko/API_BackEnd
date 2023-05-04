export interface ICreateComment {
  title?: string | null;
  text: string;
  film_id?: string | null;
  parent_id?: string | null;
  user_id: number;
}

export interface IUpdateComment {
  title?: string;
  text: string;
}
