import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoicesService } from './invoices.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { paginationDto } from 'src/users/dto/pagination.dto';

@Controller('invoice')
export class InvoicesController {
  constructor(private readonly InvoiceService: InvoicesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() CreateInvoiceDto: CreateInvoiceDto, @Req() request) {
    return this.InvoiceService.create(CreateInvoiceDto, request.userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() queryParams: paginationDto) {
    return this.InvoiceService.findAll(queryParams);
  }

  @Get()
  @UseGuards(AuthGuard)
  findOne(@Req() requsets) {
    return this.InvoiceService.findOne(requsets.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateInvoiceDto: UpdateInvoiceDto) {
    return this.InvoiceService.updateInvoice(+id, UpdateInvoiceDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') invoiceId: string, @Req() request) {
    return this.InvoiceService.deleteInvoice(invoiceId, request.userId);
  }
}
