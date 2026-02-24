import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min, IsNotEmpty } from 'class-validator';

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsString()
  @IsOptional()
  image?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @IsBoolean()
  @IsOptional()
  premium?: boolean;
}
