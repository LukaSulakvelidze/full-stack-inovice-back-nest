import {
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class BillFrom {
  @IsNotEmpty()
  @IsString()
  streetAddress: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  postCode: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}

class BillTo {
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @IsEmail()
  clientEmail: string;

  @IsNotEmpty()
  @IsString()
  streetAddress: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  postCode: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}

class InvoiceItems {
  @IsNotEmpty()
  @IsString()
  itemName: string;

  @IsNotEmpty()
  @IsNumber()
  itemQuantity: number;

  @IsNotEmpty()
  @IsNumber()
  itemPrice: number;
}

export class CreateInvoiceDto {
  @ValidateNested()
  @Type(() => BillFrom)
  @IsNotEmpty()
  billFrom: BillFrom;

  @ValidateNested()
  @Type(() => BillTo)
  @IsNotEmpty()
  billTo: BillTo;

  @IsNotEmpty()
  @IsString()
  invoiceDate: string;

  @IsNotEmpty()
  @IsString()
  paymentTerms: string;

  @IsNotEmpty()
  @IsString()
  projectDescription: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @ValidateNested()
  @Type(() => InvoiceItems)
  @IsNotEmpty()
  invoiceItems: InvoiceItems[];
}
