export const commentStub = () => {
  return {
    comment_id: '9982ecf2-8fae-471c-8ddf-2e3cbdab360e',
    title: 'comment one',
    text: 'comment about film',
    film_id: '7982ecf2-8fae-471c-8ddf-2e3cbdab360e',
    parent_id: '3982ecf2-8fae-471c-8ddf-2e3cbdab360e',
    user_id: '1982ecf2-8fae-471c-8ddf-2e3cbdab360e',
  };
};

export const commentWithoutParentStub = () => {
  return {
    comment_id: '9982ecf2-8fae-471c-8ddf-2e3cbdab360e',
    title: 'comment one',
    text: 'comment about film',
    film_id: '7982ecf2-8fae-471c-8ddf-2e3cbdab360e',
    parent_id: null,
    user_id: '1982ecf2-8fae-471c-8ddf-2e3cbdab360e',
  };
};
