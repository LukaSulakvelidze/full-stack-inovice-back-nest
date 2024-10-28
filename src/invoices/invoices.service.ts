import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async create(CreateInvoiceDto: CreateInvoiceDto, userId: string) {
    const newInvoice = await this.invoiceModel.create({
      ...CreateInvoiceDto,
      userId,
      status: 'Pending',
    });
    await this.userService.updateUserAndAddInvoice(userId, newInvoice._id);
    return newInvoice;
  }

  findAll(queryParams) {
    const { page, take } = queryParams;
    return this.invoiceModel
      .find()
      .skip((page - 1) * take)
      .limit(take);
  }

  findOne(id: string) {
    return this.invoiceModel.findById(id);
  }

  updateInvoice(id: number, UpdateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} expense`;
  }

  async deleteInvoice(invoiceId: string, userId: string) {
    const invoice = await this.invoiceModel.findById(invoiceId);
    if (!invoice) throw new NotFoundException('Invoice not found');
    const deletedInvoice = await this.invoiceModel.findByIdAndDelete(invoiceId);
    await this.userService.updateUserAfterInvoiceDelete(userId, invoiceId);
    return deletedInvoice;
  }

  async deleteInvoicesAfterUserDeactivation(userId: string) {
    return await this.invoiceModel.deleteMany({ userId: userId });
  }
}
