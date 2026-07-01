import express, { Router } from 'express';

import pingRouter from './ping.router';

const v2Router: Router = express.Router();

v2Router.use('/ping', pingRouter);

export default v2Router;