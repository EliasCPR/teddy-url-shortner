import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';

describe('AppController', () => {
  let urlController: UrlController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
    }).compile();

    urlController = app.get<UrlController>(UrlController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(urlController.findUrls()).toBe('Hello World!');
    });
  });
});
