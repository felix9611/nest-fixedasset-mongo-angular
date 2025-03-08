import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Vendor, VendorSchema } from './vendor.schame'
import { VendorService } from './vendor.service'
import { VendorController } from './vendor.controller'

@Module({
    imports: [MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]), Vendor],
    providers: [VendorService],
    exports: [VendorService, Vendor],
    controllers: [VendorController]
})
export class VendorMoudule {}