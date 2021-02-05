import { Request, Response } from 'express';

import * as userDAL from '../users/user.dal';

class AuthController {
  static login = async (req: Request, res: Response) => {
    const { body } = req;
    try {
      const token = await userDAL.login(body);
      //Send the jwt in the response
      res.status(200).json(token);
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;
    const { body } = req;

    //Get parameters from the body
    try {
      await userDAL.changePassword(id, body);
      res.status(204).json('password changed successfully');
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  };
}

export default AuthController;
