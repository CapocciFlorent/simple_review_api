import { Router } from 'express';
import UserController from '../users/user.controller';
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const routes = Router();

routes.get('/', [checkJwt, checkRole(["ADMIN"])], UserController.getAll);

routes.get('/:id', [checkJwt, checkRole(["ADMIN"])], UserController.getOne);

routes.post('/', [checkJwt, checkRole(["ADMIN"])], UserController.post);

routes.patch('/:id', [checkJwt, checkRole(["ADMIN"])], UserController.patch);

routes.delete('/:id', [checkJwt, checkRole(["ADMIN"])], UserController.destroy)

export default routes;
