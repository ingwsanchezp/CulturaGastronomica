
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';


@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
      ){}

    async findAll(): Promise<CiudadEntity[]>{
        return await this.ciudadRepository.find({ relations: {restaurantes: true,}});
    }

    async findOne(id: string): Promise<CiudadEntity>{
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}});
        if (!ciudad)
            throw new BusinessLogicException("El Ciudad con el id proporcionado no ha sido encontrado", BusinessError.NOT_FOUND);

        return ciudad;
    }




}