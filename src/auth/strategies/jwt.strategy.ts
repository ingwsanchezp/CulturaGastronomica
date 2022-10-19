import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import constantes from 'src/shared/security/jwtConstants';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constantes.JWT_SECRET,
        });
    }
   
    async validate(payload: any) {
        return { id: payload.sub, username: payload.username, roles: payload.roles };
    }
}