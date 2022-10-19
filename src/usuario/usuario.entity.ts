import { Role } from './role.enum';

export interface Usuario {
    id: number;
    username: string;
    password: string;
    roles: Role[];
}