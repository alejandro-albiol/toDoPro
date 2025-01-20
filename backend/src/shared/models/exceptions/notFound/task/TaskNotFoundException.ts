import { NotFoundException } from '../NotFoundException.js';

export class TaskNotFoundException extends NotFoundException {
  constructor(taskId: string) {
    super('Task', taskId);
  }
}
