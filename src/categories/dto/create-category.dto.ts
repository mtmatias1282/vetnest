import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;
}
