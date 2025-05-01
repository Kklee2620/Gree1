import { IsString, IsNumber, Min, IsPositive } from 'class-validator';

export class AddToCartSchema {
  @IsString()
  productId: string;
  
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemSchema {
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
} 