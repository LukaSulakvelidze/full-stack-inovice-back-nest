import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InvoicesService } from 'src/invoices/invoices.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => InvoicesService))
    private readonly invoiceService: InvoicesService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  findByEmail(query) {
    return this.userModel.findOne(query);
  }

  findByEmailWPass(query) {
    return this.userModel.findOne(query).select('+password');
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const { fullName, password } = updateUserDto;
    const hashedPass = await bcrypt.hash(password, 10);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        fullName,
        password: hashedPass,
      },
      {
        new: true,
      },
    );
    return updatedUser;
  }

  async deleteUser(userId) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    await this.invoiceService.deleteInvoicesAfterUserDeactivation(userId);
    return await this.userModel.findByIdAndDelete(userId);
  }

  async updateUserAndAddInvoice(userId: string, invoiceId) {
    const user = await this.userModel.findById(userId);
    if (!user)
      throw new NotFoundException(
        'Cannot add Invoice because user is not found',
      );
    user.invoices.push(invoiceId);
    const updateUser = await this.userModel.findByIdAndUpdate(userId, user, {
      new: true,
    });
    return updateUser;
  }

  async updateUserAfterInvoiceDelete(userId: string, invoiceId) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User is not found');
    const invoiceIdIndex = user.invoices.indexOf(invoiceId);
    user.invoices.splice(invoiceIdIndex, 1);
    const updateUser = await this.userModel.findByIdAndUpdate(userId, user, {
      new: true,
    });
    return updateUser;
  }
}
