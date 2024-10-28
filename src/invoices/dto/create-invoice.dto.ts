import { IsNotEmpty, IsString, ValidateNested, IsEmail } from 'class-validator';
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
  @IsString()
  streetAddress: string;

  @IsNotEmpty()
  @IsEmail()
  clientEmail: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  postCode: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  invoiceDate: string;

  @IsNotEmpty()
  @IsString()
  paymentTerms: string;

  @IsNotEmpty()
  @IsString()
  projectDescription: string;
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
}
