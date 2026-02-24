import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string; // Puede ser email o username

  @IsString()
  @IsNotEmpty()
  password: string;
}
