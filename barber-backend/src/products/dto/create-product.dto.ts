import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
