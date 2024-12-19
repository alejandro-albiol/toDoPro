import { NotFoundException } from '../NotFoundException';

export class TaskNotFoundException extends NotFoundException {
  constructor(taskId: string) {
    super('Task', taskId);
  }
}
