import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  total: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' }) //setear la fecha actual por defecto
  timestamp: Date;

  @OneToMany(() => TransactionContent, (TransactionContent) => TransactionContent.transaction, { eager: true })
  transactionContent: TransactionContent[]; //un array de TransactionContent
}

@Entity()
export class TransactionContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  quantity: number;

  @Column('decimal') //Los productos en la entidad ya llevan precio, pero queremos el precio que el cliente pago, no el almacenado en productos. Porque en caso de que cambiemos el precio de un producto se afectarían tambien las transacciones y eso no es correcto.
  price: number;

  // MUCHOS items pueden apuntar al MISMO producto
  @ManyToOne(() => Product, { eager: true })
  product: Product;

  // MUCHOS items pertenecen a UNA transacción
  @ManyToOne(() => Transaction, (transaction) => transaction.transactionContent)
  transaction: Transaction;
}

