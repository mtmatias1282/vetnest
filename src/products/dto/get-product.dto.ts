import { IsNumberString, IsOptional } from 'class-validator';

export class getProductQueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'El ID de la categoría no es válido' })
  category_id: number; //con ? se indica que es opcional

  @IsOptional()
  @IsNumberString({}, { message: 'La cantidad no es válida' })
  take: number; //no hace falta el ? porque con IsOptional ya se indica que es opcional

  @IsOptional()
  @IsNumberString({}, { message: 'La cantidad no es válida' })
  skip: number; //no hace falta el ? porque con IsOptional ya se indica que es opcional
}
