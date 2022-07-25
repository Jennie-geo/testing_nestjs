import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum'; //Pactum is a request marking api, it needs a server to make request
import { UserAuth } from 'src/auth/interface';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
import { EditUserDto } from 'src/user/dto';

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
  });
  describe('Edit', () => {
    it('should  a user be updated', () => {
      const dto: EditUserDto = {
        firstName: 'Nkemdi',
        email: 'queensydilichi2@gmail.com',
      };
      return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(200)
        .inspect();
    });
  });
  describe('Bookmark', () => {
    describe('Get Empty Bookmarks', () => {
      it('she should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([])
          .inspect();
      });
    });
  });

  describe('Create Bookmark', () => {
    const dto: CreateBookmarkDto = {
      title: 'First Book written',
      description: 'the universal truth of agodo the goddess',
      link: 'https://linkedin.com',
    };
    it('should create a bookmark', () => {
      return pactum
        .spec()
        .post('/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(201)
        .withBody(dto)
        .stores('bookmarkId', 'id');
    });
  });
  describe('Get Bookmark by id', () => {
    it('she should get bookmarks by id', () => {
      return pactum
        .spec()
        .get('/bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectBody([])
        .inspect();
    });
  });
  describe('Edit', () => {
    const dto: EditBookmarkDto = {
      title: 'the important of financial stability in women',
      description: 'Becoming a woman demands hard work.',
    };
    it('should edit bookmark', () => {
      return pactum
        .spec()
        .patch('/bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(200)
        .inspect();
    });
  });
  describe('Delete Bookmark', () => {
    it('should delete bookmark', () => {
      return pactum
        .spec()
        .delete('/bookmarks/{id}')
        .withPathParams('id', '$S{bookmarkId}')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(204)
        .expectBody([])
        .inspect();
    });
  });
  it('should get empty', () => {
    return pactum
      .spec()
      .delete('/bookmarks/{id}')
      .withPathParams('id', '$S{bookmarkId}')
      .withHeaders({
        Authorization: 'Bearer $S{userAt}',
      })
      .expectStatus(200)
      .expectJsonLength(0)
      .inspect();
  });
});
