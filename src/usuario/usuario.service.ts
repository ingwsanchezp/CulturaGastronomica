import { Injectable } from '@nestjs/common';
import { Role } from './role.enum';
import { Usuario } from './usuario';

@Injectable()
export class UsuarioService {
    private usuarios: Usuario[] = [
        new Usuario ( 1 , "admin", "a5CM6@1*rs65",  [Role.Admin] ) ,
        new Usuario (  2 ,  "usuarioLectorTodos",    "&@#M9279BwGp",   [Role.Lector] ) ,
        new Usuario (  3 ,  "usuarioEditorTodos",    "Xo376B0a#Jdg",   [Role.Editor] ) ,
        new Usuario (  4 ,  "usuarioBorrarTodos",    "%gvNu#1LY2M8",   [Role.Borrar] ) ,
        new Usuario (  5 ,  "usuarioLectorRestaurante",    "V91G1P#sV*Z^",   [Role.LectorRestaurante] ) ,
        new Usuario (  6 ,  "usuarioEditorRestaurante",    "w39E%Bxgp2Ri",   [Role.EditorRestaurante] ) ,
        new Usuario (  7 ,  "usuarioBorrarRestaurante",    "r0$jS8^m6wJ!",   [Role.BorrarRestaurante] ) ,
        new Usuario (  8 ,  "usuarioLectorReceta",    "741x8!UFLWa*",   [Role.LectorReceta] ) ,
        new Usuario (  9 ,  "usuarioEditorReceta",    "F13ub8@S$0%f",   [Role.EditorReceta] ) ,
        new Usuario (  10 ,  "usuarioBorrarReceta",    "@uRK^4b9PL0X",   [Role.BorrarReceta] ) ,
        new Usuario (  11 ,  "usuarioLectorProducto",    "ixP&rn268!^3",   [Role.LectorProducto] ) ,
        new Usuario (  12 ,  "usuarioEditorProducto",    "fT8Y7cw3@ty$",   [Role.EditorProducto] ) ,
        new Usuario (  13 ,  "usuarioBorrarProducto",    "mnRkY3$u52p6",   [Role.BorrarProducto] ) ,
        new Usuario (  14 ,  "usuarioLectorPais",    "RaFI^r03fK93",   [Role.LectorPais] ) ,
        new Usuario (  15 ,  "usuarioEditorPais",    "x6F*%j04Q3Nl",   [Role.EditorPais] ) ,
        new Usuario (  16 ,  "usuarioBorrarPais",    "10nghJ2!I58B",   [Role.BorrarPais] ) ,
        new Usuario (  17 ,  "usuarioLectorCultura",    "!7gr6XPdU4gD",   [Role.LectorCultura] ) ,
        new Usuario (  18 ,  "usuarioEditorCultura",    "l7fwe3oO0&p8",   [Role.EditorCultura] ) ,
        new Usuario (  19 ,  "usuarioBorrarCultura",    "3Fe!0Pl50qH$",   [Role.BorrarCultura] ) ,
        new Usuario (  20 ,  "usuarioLectorCiudad",    "9hn2o@D58Nn#",   [Role.LectorCiudad] ) ,
        new Usuario (  21 ,  "usuarioEditorCiudad",    "pD05R9F$hDk4",   [Role.EditorCiudad] ) ,
        new Usuario (  22 ,  "usuarioBorrarCiudad",    "X$GvZ4vQ#5q1",   [Role.BorrarCiudad] ) ,
        new Usuario (  23 ,  "usuarioLectorCategoriaProducto",    "zL53pCd81$Kb",   [Role.LectorCategoria] ) ,
        new Usuario (  24 ,  "usuarioEditorCategoriaProducto",    "dE@w2Y$0a0M7",   [Role.EditorCategoria] ) ,
        new Usuario (  25 ,  "usuarioBorrarCategoriaProducto",    "zR8PLy75Yv%%",   [Role.BorrarCategoria] ) ,
        new Usuario (  26 ,  "usuarioCulturaGastronomica",    "zR8PLy75Yv%*",   [Role.LectorCultura] ) ,
        new Usuario (  27 ,  "usuarioCulturaGastronomica",    "zR8PLy75Yv%*",   [Role.EditorCultura] ) ,
        new Usuario (  28 ,  "usuarioCulturaGastronomica",    "zR8PLy75Yv%*",   [Role.BorrarCultura] ) ,
        new Usuario (  29 ,  "usuarioRegion",    "zR8PLy75Yv%*",   [Role.LectorRegion] ) ,
        new Usuario (  30 ,  "usuarioRegion",    "zR8PLy75Yv%+",   [Role.EditorRegion] ) ,
        new Usuario (  31 ,  "usuarioRegion",    "zR8PLy75Yv%-",   [Role.BorrarRegion] ) 
    ];
    async findOne( username: string): Promise<Usuario | undefined> {
        return this.usuarios.find( (usuario) => usuario.username === username);
    }
}

