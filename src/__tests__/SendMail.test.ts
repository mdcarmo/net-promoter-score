import { createConnection, getConnection, getCustomRepository } from 'typeorm';
import request from 'supertest';
import { app } from '../app';
import { ErrorMessages } from '../errors/Messages';
import SendMailService from '../services/SendMailService';
import { UserRepository } from '../repositories/UserRepository';
import { SurveyRepository } from '../repositories/SurveyRepository';

describe('SendMail', () => {
  let surveyId = '';

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

    surveyId = survey.id;
  });

  afterAll(async () => {
    const connection = getConnection();

    await connection.dropDatabase();
    await connection.close();
  });

  it('should not be able to send email when user does not exists', async () => {
    const response = await request(app).post('/sendMail')
      .send({
        email: 'doesnot@exists.com',
        survey_id: 'id-example',
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(ErrorMessages.USER_NOT_FOUND);
  });

  it('should not be able to send email when survey does not exists', async () => {
    const response = await request(app).post('/sendMail')
      .send({
        email: 'user@example.com',
        survey_id: 'id-example',
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual(ErrorMessages.SURVEY_NOT_FOUND);
  });

  it('should be able to send email', async () => {
    const serviceExecuteSpy = jest
      .spyOn(SendMailService, 'execute')
      .mockReturnValue(Promise.resolve());

    const response = await request(app).post('/sendMail')
      .send({
        email: 'user@example.com',
        survey_id: surveyId,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('created_at');
    expect(serviceExecuteSpy).toHaveBeenCalledTimes(1);
  });
});
