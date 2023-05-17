export const authStub = () => {
  return {
    user_id: '1982ecf2-8fae-471c-8ddf-2e3cbdab360e',
    email: 'admin@gmail.com',
    password: '$2a$10$K.aKXFUGQUB.ShtkQ57.Xu/WVENFds5Qb52XK4KX4AANDCTrD1ynW',
  };
};

export const tokensStub = () => {
  return {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjdiMmJjMTUtZWE0OS00NTNlLWE5MjQtYzBjMzJiMjFjZWUwIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlcyI6W3sicm9sZV9pZCI6ImFiMjBhYjU5LThhMjYtNDUwYy04MWYwLTliNWNiZTQ2YjNlNCIsInZhbHVlIjoiYWRtaW4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIn1dLCJpYXQiOjE2ODQyNDM2ODMsImV4cCI6MTY4NDI0NTQ4M30.ZmokrU9f2MyyAJCX_eI5-2D6Qv3uQgGDrMxHv5_G7fc',
    refreshToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjdiMmJjMTUtZWE0OS00NTNlLWE5MjQtYzBjMzJiMjFjZWUwIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlcyI6W3sicm9sZV9pZCI6ImFiMjBhYjU5LThhMjYtNDUwYy04MWYwLTliNWNiZTQ2YjNlNCIsInZhbHVlIjoiYWRtaW4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIn1dLCJpYXQiOjE2ODQyNDQzNjIsImV4cCI6MTY4NjgzNjM2Mn0.C2eaax5AtkxcVXVTM4PyQvw2atBACKXXz4VeqkkuQwQ',
  };
};

export const refreshTokenDBStub = () => {
  return {
    token_id: '2982ecf2-8fae-471c-8ddf-2e3cbdab360e',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjdiMmJjMTUtZWE0OS00NTNlLWE5MjQtYzBjMzJiMjFjZWUwIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlcyI6W3sicm9sZV9pZCI6ImFiMjBhYjU5LThhMjYtNDUwYy04MWYwLTliNWNiZTQ2YjNlNCIsInZhbHVlIjoiYWRtaW4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIn1dLCJpYXQiOjE2ODQyNDQzNjIsImV4cCI6MTY4NjgzNjM2Mn0.C2eaax5AtkxcVXVTM4PyQvw2atBACKXXz4VeqkkuQwQ',
    user_id: '1982ecf2-8fae-471c-8ddf-2e3cbdab360e',
  };
};

export const hashPasswordStub = () => {
  return {
    hashPassword: '$2a$10$',
  };
};
