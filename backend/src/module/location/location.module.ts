import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Location, LocationSchema } from './location.schame'
import { LocationService } from './location.service'
import { LocationController } from './location.controller'

@Module({
    imports: [MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]), Location],
    providers: [LocationService],
    exports: [LocationService, Location],
    controllers: [LocationController]
})
export class LocationMoudule {}