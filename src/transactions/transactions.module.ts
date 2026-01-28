import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction, TransactionContent } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransactionContent, Product])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
