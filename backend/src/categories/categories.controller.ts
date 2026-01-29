import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    console.log('Creating category with data:', createCategoryDto);
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  //findOne(@Param('id', new ParseIntPipe({exceptionFactory: () => new BadRequestException('Id no válido ')})) id: string) { //si queremos hacerlo personalizado
  findOne(@Param('id', new IdValidationPipe()) id: string) {
    //si queremos hacerlo con el pipe por defecto
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', new IdValidationPipe()) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', new IdValidationPipe()) id: string) {
    return this.categoriesService.remove(+id);
  }
}
