import { Role } from "./role.enum";

export class Usuario {
    id: number;
    username: string;
    password: string;
    roles: Role[];

    constructor(id: number, username: string, password: string, roles: Role[]) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.roles = roles;

    }
}
