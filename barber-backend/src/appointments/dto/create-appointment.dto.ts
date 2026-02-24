import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsMongoId,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsOptional()
  @IsMongoId()
  barberId?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsEmail()
  clientEmail?: string;

  @IsOptional()
  @IsString()
  clientPhone?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;
}
