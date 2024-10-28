import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ _id: false })
class BillFrom {
  @Prop({ required: true })
  streetAddress: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  postCode: string;

  @Prop({ required: true })
  country: string;
}

@Schema({ _id: false })
class BillTo {
  @Prop({ required: true })
  clientName: string;

  @Prop({ required: true })
  streetAddress: string;

  @Prop({ required: true })
  clientEmail: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  postCode: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  invoiceDate: string;

  @Prop({ required: true })
  paymentTerms: string;

  @Prop({ required: true })
  projectDescription: string;
}

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice {
  @Prop({ type: BillFrom, required: true })
  billFrom: BillFrom;

  @Prop({ type: BillTo, required: true })
  billTo: BillTo;

  @Prop({ required: true })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: mongoose.Schema.Types.ObjectId;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
