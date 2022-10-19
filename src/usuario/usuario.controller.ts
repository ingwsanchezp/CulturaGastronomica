import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';

@Controller('usuarios')
export class UsuarioController {
    constructor(private readonly authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        console.log(req.user)
        return this.authService.login(req );
    }
}

