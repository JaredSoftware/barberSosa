import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePreferenceDto {
  @IsOptional()
  @IsEmail()
  payerEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  payerName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  payerSurname?: string;

  @IsOptional()
  @IsString()
  externalReference?: string;
}
