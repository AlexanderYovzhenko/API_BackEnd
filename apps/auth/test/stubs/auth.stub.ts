export const authStub = () => {
  return {
    user_id: '1982ecf2-8fae-471c-8ddf-2e3cbdab360e',
    email: 'admin@gmail.com',
    password: '$2a$10$K.aKXFUGQUB.ShtkQ57.Xu/WVENFds5Qb52XK4KX4AANDCTrD1ynW',
  };
};

export const tokenStub = () => {
  return {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjdiMmJjMTUtZWE0OS00NTNlLWE5MjQtYzBjMzJiMjFjZWUwIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlcyI6W3sicm9sZV9pZCI6ImFiMjBhYjU5LThhMjYtNDUwYy04MWYwLTliNWNiZTQ2YjNlNCIsInZhbHVlIjoiYWRtaW4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIn1dLCJpYXQiOjE2ODM5OTg5MDQsImV4cCI6MTY4NDA4NTMwNH0.KgFXGBz5L_JKT7Xy3KxsnvJAEYsVREujAnb5zScCl1M',
  };
};

export const hashPasswordStub = () => {
  return {
    hashPassword: '$2a$10$',
  };
};
