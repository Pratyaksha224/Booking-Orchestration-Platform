import express from 'express';

import { createPropertyHandler, getPropertiesHandler, getPropertyByIdHandler } from '../../controllers/property.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const propertyRouter = express.Router();

propertyRouter.post('/', requireAuth, createPropertyHandler);
propertyRouter.get('/', getPropertiesHandler);
propertyRouter.get('/:id', getPropertyByIdHandler);

export default propertyRouter;
