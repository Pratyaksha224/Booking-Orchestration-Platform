import express from 'express';

import { createPropertyHandler, getPropertiesHandler, getPropertyByIdHandler } from '../../controllers/property.controller';
import { validateRequestBody } from '../../validators';
import { createPropertySchema } from '../../validators/property.validator';
import { internalAuthMiddleware } from '../../middlewares/internalAuth.middleware';
import { requireRole } from '../../middlewares/role.middleware';

const propertyRouter = express.Router();

propertyRouter.post('/', internalAuthMiddleware, requireRole(['HOST', 'ADMIN']), validateRequestBody(createPropertySchema), createPropertyHandler);
propertyRouter.get('/', getPropertiesHandler);
propertyRouter.get('/:id', getPropertyByIdHandler);

export default propertyRouter;
