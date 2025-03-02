import { Router } from 'express';
import { IdValidator } from '../../middlewares/validators/id-validator.js';
import { ITaskController } from '../controller/i-task.controller.js';
import { TaskValidator } from '../../middlewares/validators/task-validator.js';

/**
 * Configures and returns a new Router instance with task routes
 * Handles only task resource management operations for regular users
 * @param controller Implementation of ITaskController to handle route logic
 * @returns Configured Express Router instance
 */
export const configureTaskRoutes = (controller: ITaskController): Router => {
  const router = Router();

  router.post('/', TaskValidator.validateCreate(), (req, res) =>
    controller.create(req, res),
  );

  router.get('/:id', IdValidator.validate('id'), (req, res) =>
    controller.findById(req, res),
  );

  router.get('/user/:userId', IdValidator.validate('userId'), (req, res) =>
    controller.findAllByUserId(req, res),
  );

  router.get(
    '/user/:userId/completed',

    IdValidator.validate('userId'),
    (req, res) => controller.findAllCompletedByUserId(req, res),
  );

  router.put(
    '/:id',
    IdValidator.validate('id'),
    TaskValidator.validateUpdate(),
    (req, res) => controller.update(req, res),
  );

  router.put(
    '/:id/completed',

    IdValidator.validate('id'),
    (req, res) => controller.toggleCompleted(req, res),
  );

  router.delete('/:id', IdValidator.validate('id'), (req, res) =>
    controller.delete(req, res),
  );

  return router;
};
