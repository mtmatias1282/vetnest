import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction, TransactionContent } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { CouponsModule } from 'src/coupons/coupons.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransactionContent, Product, ]), CouponsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
