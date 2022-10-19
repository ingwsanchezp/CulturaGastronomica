import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { plainToInstance } from "class-transformer";
import { RegionDto } from "src/region/region.dto";
import { CulturaGastronomicaEntity } from "../culturagastronomica/culturagastronomica.entity";
import { RegionEntity } from "../region/region.entity";
import { CulturaRegionService } from "./cultura-region.service";

@Resolver()
export class CulturaRegionResolver {
    constructor(private culturaRegionService: CulturaRegionService){}

    @Query(() => RegionEntity)
    findRegionPorCulturaId(@Args('id') id: string): Promise<RegionEntity>{
        return this.culturaRegionService.findRegionPorCulturaId(id);
    }

    @Query(() => CulturaGastronomicaEntity)
    findCulturaPorRegionId(@Args('id') id: string): Promise<CulturaGastronomicaEntity>{
        return this.culturaRegionService.findCulturaPorRegionId(id);
    }

    @Mutation(() => CulturaGastronomicaEntity)
    associateRegionaCulturaId(@Args('region') regionDto: RegionDto, @Args('id') id: string): Promise<CulturaGastronomicaEntity>{
        const region = plainToInstance(RegionEntity, regionDto);
        return this.culturaRegionService.associateRegionaCulturaId(id, region);
    }
    @Mutation(() => String)
    deleteRegionIdCulturaId(@Args('culturaId') culturaId: string, @Args('regionId') regionId: string){
        this.culturaRegionService.deleteRegionIdCulturaId(culturaId, regionId);
        return regionId;
    }

}
