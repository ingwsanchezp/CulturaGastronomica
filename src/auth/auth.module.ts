import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import constantes from '../shared/security/jwtConstants';
import { UsuarioService } from '../usuario/usuario.service';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      secret: constantes.JWT_SECRET,
      signOptions: { expiresIn: constantes.JWT_EXPIRES_IN },
    })
  ],
  providers: [AuthService, UsuarioService, JwtService, LocalStrategy, JwtStrategy ],
  exports: [AuthService]
})

export class AuthModule{}

