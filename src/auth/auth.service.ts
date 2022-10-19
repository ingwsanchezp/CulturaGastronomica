import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import constantes from '../shared/security/jwtConstants';
import { Usuario } from '../usuario/usuario.entity';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService,
    ){}

    async validarUsuario(username: string, pass: string): Promise<any>{
     const usuario: Usuario = await this.usuarioService.findOne(username);
     console.log(usuario)
     if (usuario && usuario.password === pass) {
        const {password, ...result} = usuario;
        return result;
     }
     return null;   
    }

    async login(req: any) {
        const payload = { username: req.user.username, sub: req.user.id, roles: req.user.roles };
        console.log(payload);
        return {
            token: this.jwtService.sign(payload, { privateKey: constantes.JWT_SECRET }),
        };
    }
}

