import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Log,
  LogDocument,
} from '../../../connections/mongodb/schema/log.schema';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private log: Model<LogDocument>) {}

  private async createLog(message: string, data: unknown, level: string) {
    const log = new this.log({
      message,
      data: JSON.stringify(data),
      level,
    });

    return log.save();
  }

  async info(message: string, data: unknown) {
    return this.createLog(message, data, 'info');
  }

  async error(message: string, data: unknown) {
    return this.createLog(message, data, 'error');
  }

  async success(message: string, data: unknown) {
    return this.createLog(message, data, 'success');
  }
}
