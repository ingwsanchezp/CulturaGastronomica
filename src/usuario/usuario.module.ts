import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsuarioService, AuthService, JwtService],
  controllers: [UsuarioController],
  exports: [UsuarioService]
})
export class UsuarioModule {}

