import { createConnection, Connection } from "typeorm";
import * as faker from 'faker';
import * as reviewCRUDL from '../review.crudl';

describe('Offer Database interaction', () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'capocciflorent',
      password: '',
      database: 'veg_test',
      synchronize: true,
      dropSchema: true,
      logging: false,
      entities: ['reviews/review.model.ts'],
    });
    return;
  });

  const fakeReviews = Array(20).fill('').map(() => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    textReview: faker.lorem.text(),
    location: faker.address.city(),
    rating: faker.random.number({ min: 0, max: 5 }),
  }));

  let listReviews: any[];

  it('Offers is properly created', async () => {
    const results = fakeReviews.map((fakeReview) => {
      return expect(reviewCRUDL.create(fakeReview)).resolves.toMatchObject({
        id: expect.any(Number),
        typeOfWork: expect.any(String),
        isVerify: expect.any(Boolean),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        ...fakeReview,
      });
    });

    await Promise.all(results);
  });

  it('Retrieve list of reviews', async () => {
    const response = await reviewCRUDL.list();

    listReviews = response.references;
    response.references.forEach(review => {
      expect(review).toMatchObject({
        id: expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String),
        textReview: expect.any(String),
        location: expect.any(String),
        rating: expect.any(Number),
        typeOfWork: expect.any(String),
        isVerify: expect.any(Boolean),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(response.metadata).toMatchObject({
        page: 0,
        perPage: 9,
        pageCount: expect.any(Number),
        totalItems: expect.any(Number),
        links: expect.any(Object),
      });
    });
  });

  it('Reviews is properly updated', async () => {
    const results = listReviews.map(({ id }) => {
      return expect(reviewCRUDL.update(id, { isVerify: true, typeOfWork: 'menuiserie' })).resolves.toBeUndefined();
    });

    await Promise.all(results);
  });

  it('Retrieve list of opened reviews', async () => {
    const params = {
      page: 0,
      perPage: 9,
      isVerify: true,
    };

    const response = await reviewCRUDL.list(params);

    listReviews = response.references;
    response.references.forEach(review => {
      expect(review).toMatchObject({
        id: expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String),
        textReview: expect.any(String),
        location: expect.any(String),
        rating: expect.any(Number),
        typeOfWork: expect.any(String),
        isVerify: params.isVerify,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(response.metadata).toMatchObject({
        page: params.page,
        perPage: params.perPage,
        pageCount: expect.any(Number),
        totalItems: expect.any(Number),
        links: expect.any(Object),
      });
    });
  });

  it('Retrieve list of opened reviews', async () => {
    const targetReview = listReviews[0];

    await expect(reviewCRUDL.read(targetReview.id)).resolves.toMatchObject({
      ...targetReview,
      isVerify: true,
      typeOfWork: 'menuiserie',
    });
  });

  it('Reviews is properly deleted', async () => {
    await expect(reviewCRUDL.destroy(17)).resolves.toBeUndefined();
  });

  afterAll(async () => {
    await connection.close();
    return;
  });
});
