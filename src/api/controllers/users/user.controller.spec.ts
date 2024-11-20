import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';

describe('AppController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userController.findUser()).toBe('Hello World!');
    });
  });
});
