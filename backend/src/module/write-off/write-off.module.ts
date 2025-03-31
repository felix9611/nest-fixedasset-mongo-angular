import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WriteOff, WriteOffSchema } from './write-off.schema'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { AssetList, AssetListSchema } from '../asset-list/asset-list.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { WriteOffService } from './write-off.service'
import { AssetListService } from '../asset-list/asset-list.service'
import { InvRecordService } from '../InvRecord/InvRecord.service'
import { InvRecord, InvRecordSchema } from '../InvRecord/InvRecord.schema'
import { LocationSchema, Location } from '../location/location.schame'
import { LocationService } from '../location/location.service'
import { WriteOffController } from './write-off.controller'
import { AssetListFile, AssetListFileSchema } from '../asset-list/asset-list-file.schame'
import { TaxInformation, TaxInformationSchema } from '../tax-information/tax-information.schame'
import { AssetType, AssetTypeSchema } from '../asset-type/assetType.schame'
import { Department, DepartmentSchema } from '../department/department.schame'
import { DepartmentService } from '../department/department.service'
import { TaxInformationService } from '../tax-information/tax-information.service'
import { AssetTypeService } from '../asset-type/assetType.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: WriteOff.name, schema: WriteOffSchema },
            { name: AssetList.name, schema: AssetListSchema }, 
            { name: AssetListFile.name, schema: AssetListFileSchema }, 
            { name: ActionRecord.name, schema: ActionRecordSchema }, 
            { name: Location.name, schema: LocationSchema },
            { name: InvRecord.name, schema: InvRecordSchema },
            { name: TaxInformation.name, schema: TaxInformationSchema },
            { name: AssetType.name, schema: AssetTypeSchema },
            { name: Department.name, schema: DepartmentSchema }
        ]),
        InvRecord
    ],
    providers: [
        ActionRecordService,
        WriteOffService,
        AssetListService,
        InvRecordService, 
        AssetTypeService, 
        TaxInformationService, 
        DepartmentService, 
        LocationService
    ],
    controllers: [
        WriteOffController
    ]
})
export class WriteOffModule {}