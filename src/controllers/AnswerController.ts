import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { ErrorMessages } from '../errors/Messages';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';

class AnswerController {
  static async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { surveyUserId } = request.query;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveyUserRepository.findOne({
      id: String(surveyUserId),
    });

    if (!surveyUser) throw new AppError(ErrorMessages.SURVEY_USER_NOT_FOUND, 404);

    surveyUser.value = Number(value);

    await surveyUserRepository.save(surveyUser);

    return response.status(200).json(surveyUser);
  }
}

export { AnswerController };
