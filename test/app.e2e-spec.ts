import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum'; //Pactum is a request marking api, it needs a server to make request
import { UserAuth } from 'src/auth/interface';
import { PrismaService } from '.././src/prisma/prisma.service';
import { AppModule } from '../src/app.module';

describe('Start testing the app', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    app.listen(5555);

    prisma = app.get(PrismaService);
    await prisma.clearDb();
    pactum.request.setBaseUrl('http://localhost:5555');
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    const userDetails: UserAuth = {
      email: 'queensydilichi@gmail.com',
      password: '1234',
    };
    describe('Signup', () => {
      it('should throw an error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: userDetails.password,
          })
          .expectStatus(400);
      });
      it('should throw an error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: userDetails.email,
          })
          .expectStatus(400);
      });
      it('should throw an error if no req body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should a user signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(userDetails)
          .expectStatus(201);
        //.inspect();
        //inspect is use to check what is in the request body;
      });
    });
    describe('Login', () => {
      let accessToken: string;
      it('should throw an error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: userDetails.email,
          })
          .expectStatus(400);
      });
      it('should throw an error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: userDetails.password,
          })
          .expectStatus(400);
      });
      it('should throw an error if both req body is empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should a user login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(userDetails)
          .expectStatus(201)
          .inspect()
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get user', () => {
      it('should a user exist', () => {
        return pactum
          .spec()
          .get('/users/loginuser')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .inspect()
          .stores('userAt', 'access_token');
      });
    });
    describe('Edit', () => {
      it.todo('should  a user be updated');
    });
  });
  describe('Bookmark', () => {
    describe('Create Bookmark', () => {
      it.todo('should a user create a bookmark');
    });
    describe('Get Bookmarks', () => {
      it.todo('get bookmarks');
    });
    describe('Get Bookmark by id', () => {});
    describe('Edit', () => {});
    describe('Delete Bookmark', () => {});
  });
});
