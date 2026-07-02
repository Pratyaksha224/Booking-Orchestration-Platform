import express, { Router } from 'express';

import pingRouter from './ping.router';
import propertyRouter from './property.router';

const v1Router: Router = express.Router();

v1Router.use('/ping', pingRouter);
v1Router.use('/properties', propertyRouter);

export default v1Router;