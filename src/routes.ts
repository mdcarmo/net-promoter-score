import { Router } from 'express';
import { UserController } from "./controllers/UserController";
import { SurveysController } from "./controllers/SurveysController";
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';
import { SendMailController } from './controllers/SendMailController';

const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();

router.post("/users", userController.create);
router.post("/surveys", surveysController.create);
router.get("/surveys", surveysController.show);
router.post('/sendMail', SendMailController.execute);
router.get('/answers/:value', AnswerController.execute);
router.get('/nps/:surveyId', NpsController.execute);

export { router };