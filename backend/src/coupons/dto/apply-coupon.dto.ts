import { IsNotEmpty } from "class-validator";

export class ApplyCouponDto {

    @IsNotEmpty({ message: 'El código del cupón no puede estar vacío' })
    coupon_name: string;
}