import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { endOfDay, isAfter } from 'date-fns';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  create(createCouponDto: CreateCouponDto) {
    return this.couponRepository.save(createCouponDto);
  }

  findAll() {
    return this.couponRepository.find();
  }

  async findOne(id: number) {
    const coupon = await this.couponRepository.findOneBy({ id });
    if (!coupon) {
      throw new NotFoundException([`El cupón con id ${id} no existe`]);
    }
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(id);
    Object.assign(coupon, updateCouponDto); //copiar en coupon los valores de updateCouponDto
    return this.couponRepository.save(coupon);
  }

  async remove(id: number) {
    const coupon = await this.findOne(id);
    await this.couponRepository.remove(coupon);
    return { message: `El cupon ha sido eliminado correctamente` };
  }

  async applyCoupon(coupon_name: string) {
    const coupon = await this.couponRepository.findOneBy({ name: coupon_name }); //name es la columna en la base de datos
    if (!coupon) {
      throw new NotFoundException([`El cupón ${coupon_name} no existe`]);
    }
    const currentDate = new Date();
    const expirationDate = endOfDay(coupon.expirationDate); //establecer la fecha de expiración al final del día 

    if(isAfter(currentDate, expirationDate)) { //si la fecha actual es posterior a la fecha de expiración
      throw new UnprocessableEntityException([`El cupón ${coupon_name} ha expirado`]);
    }

    return{
      message: `Cupón ${coupon_name} aplicado correctamente`, 
      ...coupon //devuelve todos los datos del cupón eliminando el objeto
    }

    console.log(coupon);
  }
}
