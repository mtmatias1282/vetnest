import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({
      id: createProductDto.categoryId,
    });
    if (!category) {
      let errors: string[] = [];
      errors.push('La categoría no existe');
      throw new NotFoundException(errors);
    }
    return this.productRepository.save({
      ...createProductDto, //hace una copia de todos los atributos del DTO
      category,
    });
  }

  async findAll(categoryId: number | null, take: number, skip: number) {
    const options: FindManyOptions<Product> = {
      //declarar el arreglo para formatear la respuesta
      relations: { category: true },
      order: { id: 'DESC' }, //puede hacerse por la propiedad que sea
      take, //take: take, puede decir simplemente take, porque es el mismo nombre
      skip, //skip: skip, puede decir simplemente skip, porque es el mismo nombre
    };

    if (categoryId) {
      options.where = { category: { id: categoryId } };

      //Filtrar por categoria modo largo
      /*const [products, total] = await this.productRepository.findAndCount({
        //declarar el arreglo para formatear la respuesta
        where: { category: { id: categoryId } },
        relations: { category: true },
        order: { id: 'DESC' }, //puede hacerse por la propiedad que sea
      });
      return { products, total };*/
    }

    //de esta manera traemos tambien la categoria, pero se pude colocar más sencillo directo en el entity con eager: true
    //return this.productRepository.find({loadEagerRelations: false}); //de esta manera hacemos que no lo traiga, porque en el entity está el eager: true

    const [products, total] =
      await this.productRepository.findAndCount(options);
    return { products, total };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      // si el objeto cruzado tiene muchas relaciones, mejor no trarlo completo
      relations: { category: true }, // category es el nombre de la propiedad en la entidad Product
    });
    if (!product) {
      let errors: string[] = [];
      errors.push(`El producto con id ${id} no existe`);
      throw new NotFoundException(errors);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id); //reutilizamos el método findOne de este servicio para validar si existe el producto, por ello va sin el repository
    Object.assign(product, updateProductDto); //Copia automáticamente solo las propiedades presentes en el updateProductDto al objeto product. Si el DTO solo trae el "precio", solo se sobrescribe el precio, manteniendo el resto de los datos intactos

    //validar si la categoría existe en caso de que se esté actualizando la categoría
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });
      if (!category) {
        let errors: string[] = [];
        errors.push('La categoría no existe');
        throw new NotFoundException(errors);
      }
      product.category = category; //asignar la nueva categoría al producto
    }
    await this.productRepository.save(product);
    return 'Producto actualizado correctamente';
  }

  async remove(id: number) {
    const product = await this.findOne(id); //reutilizamos el método findOne de este servicio para validar si existe el producto, por ello va sin el repository
    await this.productRepository.remove(product);
    return 'Producto eliminado correctamente';
  }
}
