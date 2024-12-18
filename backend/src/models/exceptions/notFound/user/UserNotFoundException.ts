import { NotFoundException } from "../NotFoundException.js";

export class UserNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super('User', userId,);
  }
} 