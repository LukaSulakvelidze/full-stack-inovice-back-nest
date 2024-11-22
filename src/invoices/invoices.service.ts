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
import { paginationDto } from 'src/users/dto/pagination.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async create(CreateInvoiceDto: CreateInvoiceDto, userId: string) {
    const invoiceItems = CreateInvoiceDto.invoiceItems.map((item) => ({
      ...item,
      itemTotalPrice: item.itemPrice * item.itemQuantity,
    }));
    const newInvoice = await this.invoiceModel.create({
      ...CreateInvoiceDto,
      userId,
      invoiceItems,
      invoiceNumber:
        '#' + (Math.random() + 1).toString(36).substring(6).toUpperCase(),
    });
    await this.userService.updateUserAndAddInvoice(userId, newInvoice._id);
    return newInvoice;
  }

  findAll(
    statusParams: { filter_status: string },
    paginationParams: paginationDto,
  ) {
    const { page, take } = paginationParams;
    const { filter_status } = statusParams;
    const query: any = {};
    if (filter_status && filter_status.length > 0) {
      query.status = {
        $in: filter_status
          .split(',')
          .map((status) => status.charAt(0).toUpperCase() + status.slice(1)),
      };
    }
    return this.invoiceModel
      .find(query)
      .skip((page - 1) * take)
      .limit(take);
  }

  findOne(id: string) {
    return this.invoiceModel.findById(id).select('-userId');
  }

  updateInvoice(id: string, UpdateInvoiceDto: UpdateInvoiceDto) {
    const invoiceItems = UpdateInvoiceDto.invoiceItems.map((item) => ({
      ...item,
      itemTotalPrice: item.itemPrice * item.itemQuantity,
    }));
    return this.invoiceModel.findByIdAndUpdate(
      id,
      { ...UpdateInvoiceDto, invoiceItems },
      {
        new: true,
      },
    );
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
