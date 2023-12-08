import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type LogDocument = Log & Document;

@Schema()
export class Log {
  @Prop({ default: () => uuidv4(), unique: true })
  uuid: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  data: string;

  @Prop({ default: Date.now })
  createdAt: string;

  @Prop({ enum: ['info', 'error', 'success'] })
  level: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
