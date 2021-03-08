import { createConnection, getConnection, getCustomRepository } from 'typeorm';
import request from 'supertest';
import { app } from '../app';
import { SurveyRepository } from '../repositories/SurveyRepository';

describe('NPS', () => {
  let surveyId = '';

  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();

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

  it('should be able to get nps result for a survey', async () => {
    const response = await request(app).get(`/nps/${surveyId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('detractors');
    expect(response.body).toHaveProperty('promoters');
    expect(response.body).toHaveProperty('passives');
    expect(response.body).toHaveProperty('totalAnswers');
    expect(response.body).toHaveProperty('nps');
  });
});
