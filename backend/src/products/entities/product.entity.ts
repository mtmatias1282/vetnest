import { Category } from '../../categories/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 60 })
  name: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
    default: 'default.svg',
  })
  image: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'int' }) //en ts los números enteros y decimales son del mismo tipo: number
  inventory: number;

  @Column({ type: 'int' }) //en ts los números enteros y decimales son del mismo tipo: number
  categoryId: number;

  @ManyToOne(() => Category /*, { eager: true }*/) //eager: true para que siempre que se consulte un producto, traiga su categoría asociada
  category: Category;
}
