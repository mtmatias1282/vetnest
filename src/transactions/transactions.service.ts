import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionContent } from './entities/transaction.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContent)
    private readonly transactionContentRepository: Repository<TransactionContent>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    //return await this.transactionRepository.save(createTransactionDto); esta es la forma simple pero no guarda los contenidos de la transacción

    const transaction = new Transaction();
    transaction.total = createTransactionDto.total;
    await this.transactionRepository.save(transaction);

    for (const transactionContent of createTransactionDto.transactionContent) {
      //bucle para guardar cada contenido de la transacción y agregarle la relación con la transacción y el producto
      const product = await this.productRepository.findOneBy({id: transactionContent.productId});
      
      if (!product) {
        let errors: string[] = [];
        errors.push(`El producto no existe`);
        throw new NotFoundException(errors);
      }
      await this.transactionContentRepository.save({...transactionContent, transaction, product});
    }

    return 'Venta almacenada con éxito';
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
