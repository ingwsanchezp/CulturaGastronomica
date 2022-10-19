/* eslint-disable prettier/prettier */
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { plainToInstance } from "class-transformer";
import { RegionDto } from "./region.dto";
import { RegionEntity } from "./region.entity";
import { RegionService } from "./region.service";


@Resolver()
export class RegionResolver {
    constructor(private regionService: RegionService){}

    @Query(() => [RegionEntity])
    regiones(): Promise<RegionEntity[]>{
        return this.regionService.findAll();
    }

    @Query(() => RegionEntity)
    region(@Args('id') id: string): Promise<RegionEntity>{
        return this.regionService.findOne(id);

    }

    @Mutation(() => RegionEntity)
    createRegion(@Args('region') regionDto: RegionDto): Promise<RegionEntity>{
        const region = plainToInstance(RegionEntity, regionDto);
        return this.regionService.create(region);
    }

    @Mutation(() => RegionEntity)
    updateRegion(@Args('id') id: string, @Args('region') regionDto: RegionDto): Promise<RegionEntity>{
        const region = plainToInstance(RegionEntity, regionDto);
        return this.regionService.update(id, region);
    }

    @Mutation(() => String)
    deleteRegion(@Args('id') id: string){
        this.regionService.delete(id);
        return id;
    }

}
