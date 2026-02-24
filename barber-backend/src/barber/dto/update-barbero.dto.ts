import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateBarberoDto {
  @IsString()
  @IsOptional()
  nombreArtista?: string;

  @IsString()
  @IsOptional()
  rol?: string;

  @IsString()
  @IsOptional()
  imagen?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
