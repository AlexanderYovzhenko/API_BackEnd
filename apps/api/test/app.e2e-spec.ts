import * as supertest from 'supertest';
import { config } from 'dotenv';
import {
  adminStub,
  commentStub,
  filmStub,
  genreStub,
  profileStub,
  roleStub,
  userRoleStub,
  userStub,
  userTestStub,
} from './stubs';

config();

describe('API tests (e2e)', () => {
  const HOST = process.env.HOST || 'localhost';
  const PORT = process.env.PORT || 4000;
  const url = `${HOST}:${PORT}`;

  const request = supertest(url);

  let adminBearerToken = '';
  let userBearerToken = '';
  let userId = '';

  beforeAll(async () => {
    const adminResToken = await request.post('/login').send(adminStub());
    const adminToken = await adminResToken.body.accessToken;

    adminBearerToken = `Bearer ${adminToken}`;

    const userResId = await request.post('/signup').send(userStub());
    userId = await userResId.body.user_id;

    const userResToken = await request.post('/login').send(userStub());
    const userToken = await userResToken.body.accessToken;

    userBearerToken = `Bearer ${userToken}`;
  });

  describe('/ (GET) Check is server', () => {
    it('should be return status 200 and text "Server is running!"', async () => {
      await request.get('/').expect(200).expect('Server is running!');
    });
  });

  describe('AUTH', () => {
    describe('/signup (POST)', () => {
      it('should be return status 400', async () => {
        await request
          .post('/signup')
          .set('Accept', 'application/json')
          .send({ ...userTestStub(), password: '123' })
          .expect(400);
      });

      it('should be return status 201', async () => {
        await request
          .post('/signup')
          .set('Accept', 'application/json')
          .send(userTestStub())
          .expect(201);
      });
    });

    describe('/login (POST)', () => {
      it('should be return status 403', async () => {
        await request
          .post('/login')
          .set('Accept', 'application/json')
          .send({ ...userStub(), password: '11111' })
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .post('/login')
          .set('Accept', 'application/json')
          .send({ ...userStub(), password: '123' })
          .expect(400);
      });

      it('should be return status 201', async () => {
        await request
          .post('/login')
          .set('Accept', 'application/json')
          .send(userStub())
          .expect(201);
      });
    });
  });

  describe('USER', () => {
    describe('/users (GET)', () => {
      it('should be return status 401', async () => {
        await request
          .get('/users')
          .set('Accept', 'application/json')
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .get('/users')
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .expect(403);
      });

      it('should be return status 200', async () => {
        await request
          .get('/users')
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(200);
      });
    });

    describe('/users{email} (GET)', () => {
      it('should be return status 404', async () => {
        await request
          .get(`/users/${'fake@gmail.com'}`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .expect(404);
      });

      it('should be return status 200', async () => {
        await request
          .get(`/users/${userStub().email}`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .expect(200);
      });
    });

    describe('/users{user_id} (PATCH)', () => {
      it('should be return status 401', async () => {
        await request
          .patch(`/users/${userId}`)
          .set('Accept', 'application/json')
          .send(userStub())
          .expect(401);
      });

      it('should be return status 403', async () => {
        const userResToken = await request.post('/login').send(userTestStub());
        const userToken = await userResToken.body.accessToken;

        const token = `Bearer ${userToken}`;

        await request
          .patch(`/users/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .send(userStub())
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .patch(`/users/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .send({ ...userStub(), password: '123' })
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .patch(`/users/${'37b2bc15-ea49-453e-a924-c0c32b21cee0'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(userStub())
          .expect(404);
      });

      it('should be return status 200', async () => {
        await request
          .patch(`/users/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .send(userStub())
          .expect(200);
      });
    });

    describe('/users{user_id} (DELETE)', () => {
      it('should be return status 401', async () => {
        await request
          .delete(`/users/${userId}`)
          .set('Accept', 'application/json')
          .expect(401);
      });

      it('should be return status 403', async () => {
        const userResToken = await request.post('/login').send(userTestStub());
        const userToken = await userResToken.body.accessToken;

        const token = `Bearer ${userToken}`;

        await request
          .delete(`/users/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .delete(`/users/${'123'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .delete(`/users/${'37b2bc15-ea49-453e-a924-c0c32b21cee0'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(404);
      });

      it('should be return status 204', async () => {
        const userResId = await request
          .post('/signup')
          .send({ email: 'fake@gmail.com', password: 'password' });

        const id = await userResId.body.user_id;

        await request
          .delete(`/users/${id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(204);
      });
    });
  });

  describe('PROFILE', () => {
    describe('/profiles (POST)', () => {
      it('should be return status 401', async () => {
        await request
          .post(`/profiles`)
          .set('Accept', 'application/json')
          .send({ ...profileStub(), userId })
          .expect(401);
      });

      it('should be return status 400', async () => {
        await request
          .post(`/profiles`)
          .set('Accept', 'application/json')
          .send({ ...profileStub(), user_id: '123' })
          .set('Authorization', userBearerToken)
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .post(`/profiles`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .send(profileStub())
          .expect(404);
      });

      it('should be return status 201', async () => {
        await request
          .post(`/profiles`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .send({ ...profileStub(), user_id: userId })
          .expect(201);
      });
    });

    describe('/profiles (GET)', () => {
      it('should be return status 401', async () => {
        await request
          .get('/profiles')
          .set('Accept', 'application/json')
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .get('/profiles')
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .expect(403);
      });

      it('should be return status 200', async () => {
        await request
          .get('/profiles')
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(200);
      });
    });

    describe('/profiles{user_id} (GET)', () => {
      it('should be return status 401', async () => {
        await request
          .get(`/profiles/${userId}`)
          .set('Accept', 'application/json')
          .expect(401);
      });

      it('should be return status 403', async () => {
        const userResToken = await request.post('/login').send(userTestStub());
        const userToken = await userResToken.body.accessToken;

        const token = `Bearer ${userToken}`;

        await request
          .get(`/profiles/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .get(`/profiles/${'123'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .get(`/profiles/${profileStub().user_id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(404);
      });

      it('should be return status 200', async () => {
        await request
          .get(`/profiles/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .expect(200);
      });
    });

    describe('/profiles{user_id} (PATCH)', () => {
      it('should be return status 401', async () => {
        await request
          .patch(`/profiles/${userId}`)
          .set('Accept', 'application/json')
          .send(profileStub())
          .expect(401);
      });

      it('should be return status 403', async () => {
        const userResToken = await request.post('/login').send(userTestStub());
        const userToken = await userResToken.body.accessToken;

        const token = `Bearer ${userToken}`;

        await request
          .patch(`/profiles/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .send(profileStub())
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .patch(`/profiles/${'123'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(profileStub())
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .patch(`/profiles/${'37b2bc15-ea49-453e-a924-c0c32b21cee0'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(profileStub())
          .expect(404);
      });

      it('should be return status 200', async () => {
        const admin = await request
          .get(`/users/${adminStub().email}`)
          .set('Authorization', adminBearerToken);

        await request
          .patch(`/profiles/${admin.body.user_id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send({ first_name: 'Victor' })
          .expect(200);
      });
    });

    describe('/profiles{user_id} (DELETE)', () => {
      it('should be return status 401', async () => {
        await request
          .delete(`/profiles/${userId}`)
          .set('Accept', 'application/json')
          .expect(401);
      });

      it('should be return status 403', async () => {
        const userResToken = await request.post('/login').send(userTestStub());
        const userToken = await userResToken.body.accessToken;

        const token = `Bearer ${userToken}`;

        await request
          .delete(`/profiles/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', token)
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .delete(`/profiles/${'123'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .delete(`/profiles/${'37b2bc15-ea49-453e-a924-c0c32b21cee0'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(404);
      });

      it('should be return status 204', async () => {
        const userResId = await request
          .post('/signup')
          .set('Accept', 'application/json')
          .send({ email: 'fakeUser@gmail.com', password: 'password' });

        const id = await userResId.body.user_id;

        await request
          .post('/profiles')
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send({
            user_id: id,
            first_name: 'Victor',
            last_name: 'Barinov',
            phone: '88005553515',
            city: 'Moscow',
          });

        await request
          .delete(`/profiles/${id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(204);

        await request
          .delete(`/users/${id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken);
      });
    });
  });

  describe('ROLE', () => {
    describe('/roles (POST)', () => {
      it('should be return status 401', async () => {
        await request
          .post(`/roles`)
          .set('Accept', 'application/json')
          .send(roleStub())
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .post(`/roles`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .send(roleStub())
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .post(`/roles`)
          .set('Accept', 'application/json')
          .send({ ...roleStub(), value: 'admin' })
          .set('Authorization', adminBearerToken)
          .expect(400);
      });

      it('should be return status 201', async () => {
        await request
          .post(`/roles`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(roleStub())
          .expect(201);

        await request
          .delete(`/roles/${roleStub().value}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken);
      });
    });

    describe('/roles (GET)', () => {
      it('should be return status 401', async () => {
        await request
          .get('/roles')
          .set('Accept', 'application/json')
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .get('/roles')
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .expect(403);
      });

      it('should be return status 200', async () => {
        await request
          .get('/roles')
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(200);
      });
    });

    describe('/roles{value} (GET)', () => {
      it('should be return status 401', async () => {
        await request
          .get(`/roles/${roleStub().value}`)
          .set('Accept', 'application/json')
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .get(`/roles/${roleStub().value}`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .expect(403);
      });

      it('should be return status 404', async () => {
        await request
          .get(`/roles/${'fake'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(404);
      });

      it('should be return status 200', async () => {
        await request
          .get(`/roles/${'admin'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(200);
      });
    });

    describe('/roles{value} (PATCH)', () => {
      it('should be return status 401', async () => {
        await request
          .patch(`/roles/${roleStub().value}`)
          .set('Accept', 'application/json')
          .send(roleStub())
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .patch(`/roles/${roleStub().value}`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .send(roleStub())
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .patch(`/roles/${'admin'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send({ ...roleStub(), value: 'admin' })
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .patch(`/roles/${'fake'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(roleStub())
          .expect(404);
      });

      it('should be return status 200', async () => {
        await request
          .post(`/roles`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(roleStub());

        await request
          .patch(`/roles/${roleStub().value}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send({ value: 'super', description: 'super user' })
          .expect(200);

        await request
          .delete(`/roles/${'super'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken);
      });
    });

    describe('/roles{value} (DELETE)', () => {
      it('should be return status 401', async () => {
        await request
          .delete(`/roles/${roleStub().value}`)
          .set('Accept', 'application/json')
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .delete(`/roles/${roleStub().value}`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .expect(403);
      });

      it('should be return status 404', async () => {
        await request
          .delete(`/roles/${'fake'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(404);
      });

      it('should be return status 204', async () => {
        await request
          .post('/roles')
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(roleStub());

        await request
          .delete(`/roles/${roleStub().value}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(204);
      });
    });

    describe('/user/role (POST)', () => {
      it('should be return status 401', async () => {
        await request
          .post(`/user/role`)
          .set('Accept', 'application/json')
          .send(userRoleStub())
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .post(`/user/role`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .send(userRoleStub())
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .post(`/user/role`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(userRoleStub())
          .expect(400);
      });

      it('should be return status 201', async () => {
        const role = await request
          .post('/roles')
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(roleStub());

        await request
          .post(`/user/role`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send({ user_id: userId, role_id: role.body.role_id })
          .expect(201);

        await request
          .delete(`/roles/${roleStub().value}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken);
      });
    });

    describe('/user/role (DELETE)', () => {
      it('should be return status 401', async () => {
        await request
          .delete(`/user/role`)
          .set('Accept', 'application/json')
          .send(userRoleStub())
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .delete(`/user/role`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .send(userRoleStub())
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .delete(`/user/role`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(userRoleStub())
          .expect(400);
      });

      it('should be return status 204', async () => {
        const role = await request
          .post('/roles')
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(roleStub());

        await request
          .post(`/user/role`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send({ user_id: userId, role_id: role.body.role_id });

        await request
          .delete(`/user/role`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send({ user_id: userId, role_id: role.body.role_id })
          .expect(204);

        await request
          .delete(`/roles/${roleStub().value}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken);
      });
    });
  });

  describe('FILM', () => {
    describe('/films (POST)', () => {
      it('should be return status 401', async () => {
        await request
          .post(`/films`)
          .set('Accept', 'application/json')
          .send(filmStub())
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .post(`/films`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .send(filmStub())
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .post(`/films`)
          .set('Accept', 'application/json')
          .send({ name_ru: 'Один дома' })
          .set('Authorization', adminBearerToken)
          .expect(400);
      });

      it('should be return status 201', async () => {
        const film = await request
          .post(`/films`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(filmStub())
          .expect(201);

        await request
          .delete(`/films/${film.body.film_id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken);
      });
    });

    describe('/films (GET)', () => {
      it('should be return status 200', async () => {
        await request
          .get('/films')
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(200);
      });
    });

    describe('/films{film_id} (GET)', () => {
      it('should be return status 400', async () => {
        await request
          .get(`/films/${'123'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .get(`/films/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(404);
      });

      it('should be return status 200', async () => {
        await request
          .get(`/films/${'1ac5625b-d78c-4de2-9909-85c0fa002686'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(200);
      });
    });

    describe('/films{film_id} (PATCH)', () => {
      it('should be return status 401', async () => {
        await request
          .patch(`/films/${'1ac5625b-d78c-4de2-9909-85c0fa002686'}`)
          .set('Accept', 'application/json')
          .send(filmStub())
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .patch(`/films/${'1ac5625b-d78c-4de2-9909-85c0fa002686'}`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .send(filmStub())
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .patch(`/films/${'123'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(filmStub())
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .patch(`/films/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(filmStub())
          .expect(404);
      });

      it('should be return status 200', async () => {
        const film = await request
          .post(`/films`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(filmStub());

        await request
          .patch(`/films/${film.body.film_id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(filmStub())
          .expect(200);

        await request
          .delete(`/films/${film.body.film_id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken);
      });
    });

    describe('/films{film_id} (DELETE)', () => {
      it('should be return status 401', async () => {
        await request
          .delete(`/films/${userId}`)
          .set('Accept', 'application/json')
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .delete(`/films/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .delete(`/films/${'123'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .delete(`/films/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(404);
      });

      it('should be return status 204', async () => {
        const film = await request
          .post('/films')
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(filmStub());

        await request
          .delete(`/films/${film.body.film_id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(204);
      });
    });

    describe('/id/films (GET)', () => {
      it('should be return status 400', async () => {
        await request
          .get(`/id/films`)
          .set('Accept', 'application/json')
          .query({ films: ['123'] })
          .expect(400);
      });

      it('should be return status 200', async () => {
        await request
          .get(`/id/films`)
          .set('Accept', 'application/json')
          .query({ films: ['eb5eb005-5818-4cee-9f7b-0fc6c1fae2cc'] })
          .expect(200);
      });
    });

    describe('/name/films (GET)', () => {
      it('should be return status 200', async () => {
        await request
          .get(`/name/films`)
          .set('Accept', 'application/json')
          .query({ name: 'Зеленая миля' })
          .expect(200);
      });
    });

    describe('/filter/films (GET)', () => {
      it('should be return status 200', async () => {
        await request
          .get(`/filter/films`)
          .set('Accept', 'application/json')
          .query({ limit: '10' })
          .expect(200);
      });
    });
  });

  describe('COUNTRY', () => {
    describe('/countries (GET)', () => {
      it('should be return status 200', async () => {
        await request
          .get(`/countries`)
          .set('Accept', 'application/json')
          .expect(200);
      });
    });

    describe('/name/countries (GET)', () => {
      it('should be return status 200', async () => {
        await request
          .get(`/name/countries`)
          .set('Accept', 'application/json')
          .query({ country: 'usa' })
          .expect(200);
      });
    });
  });

  describe('GENRE', () => {
    describe('/genres (GET)', () => {
      it('should be return status 200', async () => {
        await request
          .get(`/genres`)
          .set('Accept', 'application/json')
          .expect(200);
      });
    });

    describe('/genres{genre_id} (GET)', () => {
      it('should be return status 400', async () => {
        await request
          .get(`/genres/${'123'}`)
          .set('Accept', 'application/json')
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .get(`/genres/${userId}`)
          .set('Accept', 'application/json')
          .expect(404);
      });

      it('should be return status 200', async () => {
        await request
          .get(`/genres/${'47b3d35c-dc1c-40d7-bc35-65d888d7f7bd'}`)
          .set('Accept', 'application/json')
          .expect(200);
      });
    });

    describe('/genres{genre_id} (PATCH)', () => {
      it('should be return status 401', async () => {
        await request
          .patch(`/genres/${'47b3d35c-dc1c-40d7-bc35-65d888d7f7bd'}`)
          .set('Accept', 'application/json')
          .expect(401);
      });

      it('should be return status 403', async () => {
        await request
          .patch(`/genres/${'47b3d35c-dc1c-40d7-bc35-65d888d7f7bd'}`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .expect(403);
      });

      it('should be return status 400', async () => {
        await request
          .patch(`/genres/${'123'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(genreStub())
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .patch(`/genres/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(genreStub())
          .expect(404);
      });

      it('should be return status 200', async () => {
        await request
          .patch(`/genres/${'47b3d35c-dc1c-40d7-bc35-65d888d7f7bd'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(genreStub())
          .expect(200);
      });
    });
  });

  describe('PERSON', () => {
    describe('/persons (GET)', () => {
      it('should be return status 200', async () => {
        await request
          .get(`/persons`)
          .set('Accept', 'application/json')
          .expect(200);
      });
    });

    describe('/persons{person_id} (GET)', () => {
      it('should be return status 400', async () => {
        await request
          .get(`/persons/${'123'}`)
          .set('Accept', 'application/json')
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .get(`/persons/${userId}`)
          .set('Accept', 'application/json')
          .expect(404);
      });

      it('should be return status 200', async () => {
        await request
          .get(`/persons/${'5415905d-60e6-47a9-a233-b4524a2490ac'}`)
          .set('Accept', 'application/json')
          .expect(200);
      });
    });

    describe('/persons/films/{film_id} (GET)', () => {
      it('should be return status 400', async () => {
        await request
          .get(`/persons/films/${'123'}`)
          .set('Accept', 'application/json')
          .expect(400);
      });

      it('should be return status 200', async () => {
        await request
          .get(`/persons/films/${'5415905d-60e6-47a9-a233-b4524a2490ac'}`)
          .set('Accept', 'application/json')
          .expect(200);
      });
    });

    describe('/name/persons (GET)', () => {
      it('should be return status 400', async () => {
        await request
          .get(`/name/persons`)
          .set('Accept', 'application/json')
          .query({ first_name: 'Шлегель' })
          .expect(400);
      });

      it('should be return status 200', async () => {
        await request
          .get(`/name/persons`)
          .set('Accept', 'application/json')
          .query({
            film_role: 'filmmaker',
          })
          .expect(200);
      });
    });
  });

  describe('COMMENT', () => {
    describe('/comments (POST)', () => {
      it('should be return status 401', async () => {
        await request
          .post(`/comments`)
          .set('Accept', 'application/json')
          .send(commentStub())
          .expect(401);
      });

      it('should be return status 400', async () => {
        await request
          .post(`/comments`)
          .set('Accept', 'application/json')
          .send({ ...commentStub(), user_id: '123' })
          .set('Authorization', adminBearerToken)
          .expect(400);
      });

      it('should be return status 201', async () => {
        const comment = await request
          .post(`/comments`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(commentStub())
          .expect(201);

        await request
          .delete(`/comments/${comment.body.comment_id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken);
      });
    });

    describe('/comments/films/{film_id} (GET)', () => {
      it('should be return status 40', async () => {
        await request
          .get(`/comments/films/${'123'}`)
          .set('Accept', 'application/json')
          .expect(400);
      });

      it('should be return status 200', async () => {
        await request
          .get(`/comments/films/${commentStub().film_id}`)
          .set('Accept', 'application/json')
          .set('Authorization', userBearerToken)
          .expect(200);
      });
    });

    describe('/comments{comment_id} (GET)', () => {
      it('should be return status 400', async () => {
        await request
          .get(`/comments/${'123'}`)
          .set('Accept', 'application/json')
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .get(`/comments/${userId}`)
          .set('Accept', 'application/json')
          .expect(404);
      });

      it('should be return status 200', async () => {
        await request
          .get(`/comments/${'e99b8e24-4c99-42ed-b630-416b1dbbaaf8'}`)
          .set('Accept', 'application/json')
          .expect(200);
      });
    });

    describe('/comments{comment_id} (PATCH)', () => {
      it('should be return status 401', async () => {
        await request
          .patch(`/comments/${userId}`)
          .set('Accept', 'application/json')
          .send(commentStub())
          .expect(401);
      });

      it('should be return status 400', async () => {
        await request
          .patch(`/comments/${'123'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(commentStub())
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .patch(`/comments/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(commentStub())
          .expect(404);
      });

      it('should be return status 200', async () => {
        const comment = await request
          .post(`/comments`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(commentStub());

        await request
          .patch(`/comments/${comment.body.comment_id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(commentStub())
          .expect(200);

        await request
          .delete(`/comments/${comment.body.comment_id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken);
      });
    });

    describe('/comments{comment_id} (DELETE)', () => {
      it('should be return status 401', async () => {
        await request
          .delete(`/comments/${userId}`)
          .set('Accept', 'application/json')
          .expect(401);
      });

      it('should be return status 400', async () => {
        await request
          .delete(`/comments/${'123'}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(400);
      });

      it('should be return status 404', async () => {
        await request
          .delete(`/comments/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(404);
      });

      it('should be return status 204', async () => {
        const comment = await request
          .post(`/comments`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .send(commentStub());

        await request
          .delete(`/comments/${comment.body.comment_id}`)
          .set('Accept', 'application/json')
          .set('Authorization', adminBearerToken)
          .expect(204);
      });
    });
  });

  afterAll(async () => {
    const user = await request
      .get(`/users/${userStub().email}`)
      .set('Authorization', adminBearerToken);

    await request
      .delete(`/users/${user.body.user_id}`)
      .set('Authorization', adminBearerToken);

    const userTest = await request
      .get(`/users/${userTestStub().email}`)
      .set('Authorization', adminBearerToken);

    await request
      .delete(`/users/${userTest.body.user_id}`)
      .set('Authorization', adminBearerToken);
  });
});
