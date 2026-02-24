import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async generateJwt(user: UserDocument): Promise<{ access_token: string }> {
    const payload = { sub: user._id.toString(), email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  /** Registrar nuevo usuario con email/username y password */
  async register(registerDto: RegisterDto): Promise<{ access_token: string; user: any }> {
    // Verificar si el email ya existe
    const existingUser = await this.userModel.findOne({ 
      $or: [
        { email: registerDto.email },
        { username: registerDto.username }
      ]
    }).exec();

    if (existingUser) {
      throw new ConflictException('El email o username ya está en uso');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear el usuario
    const user = await this.userModel.create({
      email: registerDto.email,
      username: registerDto.username,
      password: hashedPassword,
      name: registerDto.name,
    });

    // Generar JWT
    const tokens = await this.generateJwt(user);

    // Retornar token y usuario (sin password)
    const { password, ...userWithoutPassword } = user.toObject();
    return {
      access_token: tokens.access_token,
      user: userWithoutPassword,
    };
  }

  /** Login con email/username y password */
  async login(loginDto: LoginDto): Promise<{ access_token: string; user: any }> {
    // Buscar usuario por email o username
    const user = await this.userModel.findOne({
      $or: [
        { email: loginDto.email },
        { username: loginDto.email }
      ]
    }).exec();

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar JWT
    const tokens = await this.generateJwt(user);

    // Retornar token y usuario (sin password)
    const { password, ...userWithoutPassword } = user.toObject();
    return {
      access_token: tokens.access_token,
      user: userWithoutPassword,
    };
  }
}
