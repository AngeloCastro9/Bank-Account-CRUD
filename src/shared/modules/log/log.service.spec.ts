import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { getModelToken } from '@nestjs/mongoose';
import { Log } from '../../../connections/mongodb/schema/log.schema';

interface MockLogModel {
  save: jest.Mock;
}

describe('LogService', () => {
  let service: LogService;
  let mockLogModel: MockLogModel;

  beforeEach(async () => {
    mockLogModel = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
        {
          provide: getModelToken(Log.name),
          useValue: jest.fn().mockImplementation(() => mockLogModel),
        },
      ],
    }).compile();

    service = module.get<LogService>(LogService);
  });

  describe('info', () => {
    it('should create an info log', async () => {
      const message = 'Info message';
      const data = { key: 'value' };
      await service.info(message, data);
      expect(mockLogModel.save).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should create an error log', async () => {
      const message = 'Error message';
      const data = { error: 'some error' };
      await service.error(message, data);
      expect(mockLogModel.save).toHaveBeenCalled();
    });
  });

  describe('success', () => {
    it('should create a success log', async () => {
      const message = 'Success message';
      const data = { result: 'success' };
      await service.success(message, data);
      expect(mockLogModel.save).toHaveBeenCalled();
    });
  });
});
