import { Router } from 'express';
import adminUsers from './adminUsers';
import adminReviews from './adminReviews';
import auth from './auth';
import reviews from './reviews'

const routes = Router();

routes.use('/admin/users', adminUsers);
routes.use('/admin/reviews', adminReviews);
routes.use('/auth', auth);
routes.use('/reviews', reviews);

export default routes;
