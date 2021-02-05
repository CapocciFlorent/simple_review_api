import { Router } from 'express';
import reviewController from '../reviews/review.controller';

const routes = Router();

routes.get('/', reviewController.getVerify);

routes.get('/:id', reviewController.getOne);

routes.post('/', reviewController.post);

export default routes;
