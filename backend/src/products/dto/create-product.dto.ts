import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @IsString({ message: 'El nombre del producto no es válido' })
  name: string;

  @IsNotEmpty({ message: 'El precio del producto es obligatorio' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio del producto no es un número válido' },
  )
  price: number;

  @IsNotEmpty({ message: 'El inventario del producto no puede ir vacio' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'El inventario del producto no es un número válido' },
  )
  inventory: number;

  @IsNotEmpty({ message: 'La categoría del producto es obligatoria' })
  @IsInt({ message: 'La categoría del producto no es válida' })
  categoryId: number;
}
