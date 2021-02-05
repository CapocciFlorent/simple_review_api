import { Request, Response } from 'express';
import * as userCRUDL from './user.crudl';

class UserController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const users = await userCRUDL.list();

      res.status(200).json(users);
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  }

  static getOne = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);

      const user = await userCRUDL.read(id);

      res.status(200).json(user);
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  }

  static post = async (req: Request, res: Response) => {
    const body: any = req.body;

    try {
      const user = await userCRUDL.create(body);

      res.status(201).json(user);
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  }

  static patch = async (req: Request, res: Response) => {
    const body: any = req.body;

    try {
      const id: number = parseInt(req.params.id, 10);
      await userCRUDL.update(id, body);

      res.status(204).json();
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  }

  static destroy = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);

      await userCRUDL.destroy(id);

      res.status(204).json();
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  }
}

export default UserController;
