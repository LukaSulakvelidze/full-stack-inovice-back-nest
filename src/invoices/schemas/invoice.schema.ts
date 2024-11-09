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
  clientEmail: string;

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
class InvoiceItems {
  @Prop({ required: true })
  itemName: string;

  @Prop({ required: true })
  itemQuantity: number;

  @Prop({ required: true })
  itemPrice: number;

  @Prop({ required: true })
  itemTotalPrice: number;
}

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice {
  @Prop({ required: true })
  invoiceNumber: string;

  @Prop({ type: BillFrom, required: true })
  billFrom: BillFrom;

  @Prop({ type: BillTo, required: true })
  billTo: BillTo;

  @Prop({ required: true })
  invoiceDate: string;

  @Prop({ required: true })
  paymentTerms: string;

  @Prop({ required: true })
  projectDescription: string;

  @Prop({ required: true })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.Array, required: true })
  invoiceItems: InvoiceItems[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
