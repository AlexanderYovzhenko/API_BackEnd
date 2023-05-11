import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApiModule } from './../src/api.module';

jest.mock('./../src/api.module', () => {
  return {
    ApiModule: jest.fn().mockImplementation(() => {
      // return {
      //   // Здесь можно задать поведение мокового объекта
      // };
    }),
  };
});

describe('ApiController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
      providers: [
        {
          provide: ApiModule,
          useValue: new ApiModule(),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Server is running!');
  });
});

// import * as supertest from 'supertest';

// describe('API tests (e2e)', () => {
//   const host =
//     process.env.HOST || process.env.PORT
//       ? `localhost:${process.env.PORT}`
//       : 'localhost:4000';

//   const request = supertest(host);

//   const userTest = {
//     email: 'userTest@gmail.com',
//     password: '12345',
//     confirmPassword: '12345',
//     firstName: 'Александр',
//     lastName: 'Александров',
//     phone: 375777777777,
//     city: 'Минск',
//   };

//   let bearerToken = '';
//   let userID = 1;

//   beforeAll(async () => {
//     const resUser = await request.post('/registration').send(userTest);
//     userID = await resUser.body.user_id;

//     const resToken = await request.post('/login').send(userTest);
//     const token = await resToken.body.token;

//     bearerToken = `Bearer ${token}`;
//   });

//   describe('/ (GET) Check is server', () => {
//     it('should get status 200 and text "Server is running!"', async () => {
//       await request.get('/').expect(200).expect('Server is running!');
//     });
//   });

//   describe('/registration (POST) Check is registration endpoint', () => {
//     it('should get status 400 error Bad Request', async () => {
//       await request
//         .post('/registration')
//         .set('Accept', 'application/json')
//         .send({ ...userTest, password: '123' })
//         .expect(400);
//     });

//     it('should get status 201 created new user', async () => {
//       await request
//         .post('/registration')
//         .set('Accept', 'application/json')
//         .send({
//           ...userTest,
//           email: 'userCrateTest@gmail.com',
//           phone: 375257777777,
//         })
//         .expect(201);
//     });
//   });

//   describe('/login (POST) Check is login endpoint', () => {
//     it('should get status 403 error Forbidden', async () => {
//       await request
//         .post('/login')
//         .set('Accept', 'application/json')
//         .send({ ...userTest, password: '11111' })
//         .expect(403);
//     });

//     it('should get status 400 error Bad Request', async () => {
//       await request
//         .post('/login')
//         .set('Accept', 'application/json')
//         .send({ ...userTest, password: '123' })
//         .expect(400);
//     });

//     it('should get status 201 create new token', async () => {
//       await request
//         .post('/login')
//         .set('Accept', 'application/json')
//         .send(userTest)
//         .expect(201);
//     });
//   });

//   describe('/profile (GET) Check is profile "get all users" endpoint', () => {
//     it('should get status 401 error Unauthorized', async () => {
//       await request
//         .get('/profile')
//         .set('Accept', 'application/json')
//         .expect(401);
//     });

//     it('should get status 200 and array users or empty array', async () => {
//       await request
//         .get('/profile')
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .expect(200);
//     });
//   });

//   describe('/profile/{id} (GET) Check is profile "get one user" endpoint', () => {
//     it('should get status 401 error Unauthorized', async () => {
//       await request
//         .get(`/profile/${userID}`)
//         .set('Accept', 'application/json')
//         .expect(401);
//     });

//     it('should get status 404 error Not Found', async () => {
//       await request
//         .get(`/profile/${-100}`)
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .expect(404);
//     });

//     it('should get status 200 and one user', async () => {
//       await request
//         .get(`/profile/${userID}`)
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .expect(200);
//     });
//   });

//   describe('/profile/{id} (PUT) Check is profile "change user" endpoint', () => {
//     it('should get status 401 error Unauthorized', async () => {
//       await request
//         .put(`/profile/${userID}`)
//         .set('Accept', 'application/json')
//         .expect(401);
//     });

//     it('should get status 404 error Not Found', async () => {
//       await request
//         .put(`/profile/${-100}`)
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .expect(404);
//     });

//     it('should get status 400 error Bad Request', async () => {
//       await request
//         .put(`/profile/${userID}`)
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .send({ ...userTest, password: '123' })
//         .expect(400);
//     });

//     it('should get status 201 update user', async () => {
//       await request
//         .put(`/profile/${userID}`)
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .send({ ...userTest, firstName: 'John' })
//         .expect(201);
//     });
//   });

//   describe('/profile/{id} (DELETE) Check is profile "delete user" endpoint', () => {
//     it('should get status 401 error Unauthorized', async () => {
//       await request
//         .delete(`/profile/${userID}`)
//         .set('Accept', 'application/json')
//         .expect(401);
//     });

//     it('should get status 404 error Not Found', async () => {
//       await request
//         .delete(`/profile/${-100}`)
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .expect(404);
//     });

//     it('should get status 204 delete user', async () => {
//       await request
//         .delete(`/profile/${userID}`)
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .expect(204);
//     });
//   });

//   describe('Scenario tests (e2e)', () => {
//     it('should get status 201 created new users', async () => {
//       await request
//         .post('/registration')
//         .set('Accept', 'application/json')
//         .send({
//           ...userTest,
//           email: 'userCrateTwoTest@gmail.com',
//           phone: 375337777777,
//         })
//         .expect(201);

//       const resNesUser = await request
//         .post('/registration')
//         .set('Accept', 'application/json')
//         .send({
//           ...userTest,
//           email: 'userCrateThreeTest@gmail.com',
//           phone: 375447777777,
//         })
//         .expect(201);

//       const user = resNesUser.body;

//       userID = user.user_id;
//     });

//     it('should get status 200 and array users with 3 users', async () => {
//       const resUsers = await request
//         .get('/profile')
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .expect(200);

//       const users = resUsers.body;

//       expect(users.length).toBe(3);
//     });

//     it('should get status 201 update user', async () => {
//       await request
//         .put(`/profile/${userID}`)
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .send({ ...userTest, firstName: 'John' })
//         .expect(201);
//     });

//     it('should get status 200 and check name user', async () => {
//       const resUser = await request
//         .get(`/profile/${userID}`)
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .expect(200);

//       const user = resUser.body;

//       expect(user.profile.firstName).toBe('John');
//     });

//     it('should get status 204 delete user', async () => {
//       await request
//         .delete(`/profile/${userID}`)
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .expect(204);
//     });

//     it('should get status 200 and array users with 2 users', async () => {
//       const resUsers = await request
//         .get('/profile')
//         .set('Accept', 'application/json')
//         .set('Authorization', bearerToken)
//         .expect(200);

//       const users = resUsers.body;

//       expect(users.length).toBe(2);
//     });
//   });

//   afterAll(async () => {
//     await request.post('/registration').send(userTest);

//     const resToken = await request.post('/login').send(userTest);
//     const token = resToken.body.token;

//     const bearerToken = `Bearer ${token}`;

//     const resUsers = await request
//       .get('/profile')
//       .set('Accept', 'application/json')
//       .set('Authorization', bearerToken);

//     const users = resUsers.body;

//     users.forEach(async (user: any) => {
//       await request
//         .delete(`/profile/${user.user_id}`)
//         .set('Authorization', bearerToken);
//     });
//   });
// });
