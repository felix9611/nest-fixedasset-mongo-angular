import { Module } from '@nestjs/common'
import { TaxInformation, TaxInformationSchema } from './tax-information.schame'
import { MongooseModule } from '@nestjs/mongoose'
import { TaxInformationService } from './tax-information.service'
import { TaxInformationController } from './tax-information.controller'

@Module({
    imports: [MongooseModule.forFeature([{ name: TaxInformation.name, schema: TaxInformationSchema }])],
    controllers: [TaxInformationController],
    providers: [TaxInformationService],
    exports: [],
})
export class TaxInformationMoudule {}