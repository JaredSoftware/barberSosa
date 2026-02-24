import { IsString, IsNumber, Min } from 'class-validator';

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  updatedAt: Date;
}

export class AddToCartDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(0)
  quantity: number;
}
