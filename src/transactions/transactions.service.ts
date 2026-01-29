import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Transaction, TransactionContent } from './entities/transaction.entity';
import { Product } from 'src/products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from 'src/coupons/coupons.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContent)
    private readonly transactionContentRepository: Repository<TransactionContent>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly couponsService: CouponsService, //agregar el servicio de cupones para consumirlo desde aquí  
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    //return await this.transactionRepository.save(createTransactionDto); esta es la forma simple pero no guarda los contenidos de la transacción

    //esta es una forma más segura de hacerlo usando una transacción de base de datos, no confundir esta transaccion es diferente a la entidad Transaction esta es de bases de datos ACID
    //manager permite acceder a todas las entidades dentro del proyecto
    await this.transactionRepository.manager.transaction(
      async (transactionEntityManager) => {
        //Crear instancia de Transaction y asignar total
        const transaction = new Transaction();
        const total = createTransactionDto.transactionContent.reduce(
          (total, item) => total + (item.price * item.quantity),
          0,
        );
        transaction.total = total;

        if(createTransactionDto.coupon){
          const coupon = await this.couponsService.applyCoupon(createTransactionDto.coupon);
          const discount = (coupon.percentage / 100) * total;
          transaction.discount = discount;
          transaction.coupon = coupon.name;
          transaction.total -= discount;
        }

        //bucle para guardar cada contenido de la transacción y agregarle la relación con la transacción y el producto
        for (const content of createTransactionDto.transactionContent) {
          const product = await transactionEntityManager.findOneBy(Product, {
            id: content.productId,
          });

          const errors: string[] = [];

          if (!product) {
            errors.push(`El producto con id ${content.productId} no existe`);
            throw new NotFoundException(errors);
          }

          if (content.quantity > product.inventory) {
            errors.push(
              `El articulo ${product.name} no tiene suficiente inventario`,
            );
            throw new BadRequestException(errors);
          }
          product.inventory -= content.quantity; //restar del inventario la cantidad vendida

          //Crear instancia de TransactionContent
          const transactionContent = new TransactionContent();
          transactionContent.transaction = transaction; //asignar la transacción creada anteriormente, del mismo modo la instancia completa
          transactionContent.product = product; //se le pasa la instancia del producto completa, porque tenemos las cascadas y eager en la entidad
          transactionContent.quantity = content.quantity;
          transactionContent.price = content.price;

          // Guardar los cambios en el inventario del producto
          await transactionEntityManager.save(transaction); //cambiar objeto por transactionEntityManager quitar transactionRepository
          await transactionEntityManager.save(transactionContent); //guardar el contenido de la transacción
        }
      },
    );
    return 'Venta almacenada con éxito';
  }

  findAll(transactionDate?: string) {
    // se define las relaciones que se quieren cargar porque no esta eager en la entidad Transaction
    const options: FindManyOptions<Transaction> = {
      relations: { transactionContent: true },
    };

    if (transactionDate) {
      const date = parseISO(transactionDate);
      if (!isValid(date)) {
        throw new BadRequestException(['La fecha proporcionada no es válida']);
      }

      const start = startOfDay(date);
      const end = endOfDay(date);

      options.where = {
        timestamp: Between(start, end), //timestamp es el nombre de la columna en la entidad Transaction
      };
    }
    return this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: { transactionContent: true },
    });
    if (!transaction) {
      throw new NotFoundException([`La transacción no existe`]);
    }
    return transaction;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(id: number) {
    const transaction = await this.findOne(id);

    for (const content of transaction.transactionContent) {

      const product = await this.productRepository.findOneByOrFail({id: content.product.id})
      product.inventory += content.quantity; //devolver el inventario al producto
      await this.productRepository.save(product);

      const transactionContent = await this.transactionContentRepository.findOneByOrFail({ id: content.id });
      await this.transactionContentRepository.remove(transactionContent);
    }

    await this.transactionRepository.remove(transaction);
    return [`Transacción con id ${id} eliminada`];
  }
}
