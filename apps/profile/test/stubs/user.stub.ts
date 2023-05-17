import { profileStub } from './profile.stub';

export const userStub = () => {
  return {
    user_id: '7982ecf2-8fae-471c-8ddf-2e3cbdab360e',
    email: 'admin@gmail.com',
    password: 'admin',
    profile: null,
  };
};

export const userWithProfileStub = () => {
  return {
    user_id: '7982ecf2-8fae-471c-8ddf-2e3cbdab360e',
    email: 'admin@gmail.com',
    password: 'admin',
    profile: profileStub(),
  };
};
