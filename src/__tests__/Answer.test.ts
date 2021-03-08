import { createConnection, getConnection, getCustomRepository } from 'typeorm';
import request from 'supertest';
import { app } from '../app';
import { ErrorMessages } from '../errors/Messages';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
import { UserRepository } from '../repositories/UserRepository';
import { SurveyRepository } from '../repositories/SurveyRepository';

describe('Answer', () => {
  const VALUE = 9;

  let surveyUserId = '';

  beforeAll(async () => {
    const connection = await createConnection();

    await connection.runMigrations();

    const userRepository = getCustomRepository(UserRepository);
    const user = userRepository.create({
      email: 'user@example.com',
      name: 'User Example',
    });

    await userRepository.save(user);

    const surveyRepository = getCustomRepository(SurveyRepository);
    const survey = surveyRepository.create({
      title: 'Title Example',
      description: 'Description Example',
    });

    await surveyRepository.save(survey);

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);
    const surveyUser = surveyUserRepository.create({
      user_id: user.id,
      survey_id: survey.id,
    });
    surveyUserId = surveyUser.id;

    await surveyUserRepository.save(surveyUser);
  });

  afterAll(async () => {
    const connection = getConnection();

    await connection.dropDatabase();
    await connection.close();
  });

  it('should not be able to create answer when survey user does not exists', async () => {
    const nonExistingId = 'nonExistingId';

    const response = await request(app).get(`/answers/${VALUE}?user=${nonExistingId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(ErrorMessages.SURVEY_USER_NOT_FOUND);
  });

  it('should be able to save user answer', async () => {
    const response = await request(app).get(`/answers/${VALUE}?surveyUserId=${surveyUserId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('value');
    expect(response.body.value).toEqual(VALUE);
  });
});
