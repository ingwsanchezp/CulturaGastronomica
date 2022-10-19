import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { plainToInstance } from "class-transformer";
import { CulturagastronomicaDto } from "./culturagastronomica.dto";
import { CulturaGastronomicaEntity } from "./culturagastronomica.entity";
import { CulturagastronomicaService } from "./culturagastronomica.service";

@Resolver()
export class CulturagastronomicaResolver {
    constructor(private culturaService: CulturagastronomicaService){}

    @Query(() => [CulturaGastronomicaEntity])
    culturas(): Promise<CulturaGastronomicaEntity[]>{
        return this.culturaService.findAll();
    }

    @Query(() => CulturaGastronomicaEntity)
    cultura(@Args('id') id: string): Promise<CulturaGastronomicaEntity>{
        return this.culturaService.finOne(id);

    }

    @Mutation(() => CulturaGastronomicaEntity)
    createCulturaGastronomica(@Args('cultura') culturaDto: CulturagastronomicaDto): Promise<CulturaGastronomicaEntity>{
        const cultura = plainToInstance(CulturaGastronomicaEntity, culturaDto);
        return this.culturaService.create(cultura);
    }

    @Mutation(() => CulturaGastronomicaEntity)
    updateCulturaGastronomica(@Args('id') id: string, @Args('cultura') culturaDto: CulturagastronomicaDto): Promise<CulturaGastronomicaEntity>{
        const cultura = plainToInstance(CulturaGastronomicaEntity, culturaDto);
        return this.culturaService.update(id, cultura);
    }

    @Mutation(() => String)
    deleteCulturaGastronomica(@Args('id') id: string){
        this.culturaService.delete(id);
        return id;
    }
}
