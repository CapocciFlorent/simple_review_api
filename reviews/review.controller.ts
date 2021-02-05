import { Request, Response } from 'express';
import * as reviewCRUDL from './review.crudl';

class ReviewController {

  static getVerify = async (req: Request, res: Response) => {
    const perPage = (req.params.perPage, 10);
    const page = (req.params.page, 10);

    try {
      const reviews = await reviewCRUDL.list({ page, perPage, isVerify: true });

      res.status(200).json(reviews);
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  }

  static getAll = async (req: Request, res: Response) => {
    const perPage = (req.params.perPage, 10);
    const page = (req.params.page, 10);

    try {
      const reviews = await reviewCRUDL.list({ page, perPage, isVerify: false });

      res.status(200).json(reviews);
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  }

  static getOne = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);

      const review = await reviewCRUDL.read(id);

      res.status(200).json(review);
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  }

  static post = async (req: Request, res: Response) => {
    const body: any = req.body;

    try {
      const review = await reviewCRUDL.create(body);

      res.status(201).json(review);
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  }

  static patch = async (req: Request, res: Response) => {
    const body: any = req.body;

    try {
      const id: number = parseInt(req.params.id, 10);
      await reviewCRUDL.update(id, body);

      res.status(204).json();
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  }

  static destroy = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);

      await reviewCRUDL.destroy(id);

      res.status(204).json();
    } catch (err) {
      res.status(err.code).json(err.details);
    }
  }
}

export default ReviewController;
