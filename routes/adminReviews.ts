import { Router } from 'express';
import reviewController from '../reviews/review.controller';
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const routes = Router();

routes.get('/', [checkJwt, checkRole(["ADMIN"])], reviewController.getAll);

routes.patch('/:id', [checkJwt, checkRole(["ADMIN"])], reviewController.patch);

routes.delete('/:id', [checkJwt, checkRole(["ADMIN"])], reviewController.destroy)

export default routes;
