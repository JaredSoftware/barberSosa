import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { BarberModule } from '../barber/barber.module';

@Module({
  imports: [
    UsersModule,
    BarberModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('jwt.expiresIn') ?? '7d';
        return {
          secret: config.get<string>('jwt.secret') ?? 'default-secret',
          signOptions: { expiresIn: expiresIn as `${number}d` },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
