import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RepairRecord, RepairRecordSchema } from './repair-record.schema'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { AssetList, AssetListSchema } from '../asset-list/asset-list.schame'
import { AssetListService } from '../asset-list/asset-list.service'
import { InvRecord, InvRecordSchema } from '../InvRecord/InvRecord.schema'
import { InvRecordService } from '../InvRecord/InvRecord.service'
import { RepairRecordController } from './repair-record.controller'
import { RepairRecordService } from './repair-record.service'
import { AssetListFile, AssetListFileSchema } from '../asset-list/asset-list-file.schame'
import { TaxInformation, TaxInformationSchema } from '../tax-information/tax-information.schame'
import { Location, LocationSchema } from '../location/location.schame'
import { AssetType, AssetTypeSchema } from '../asset-type/assetType.schame'
import { Department, DepartmentSchema } from '../department/department.schame'
import { LocationService } from '../location/location.service'
import { DepartmentService } from '../department/department.service'
import { TaxInformationService } from '../tax-information/tax-information.service'
import { AssetTypeService } from '../asset-type/assetType.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: RepairRecord.name, schema: RepairRecordSchema }, 
            { name: ActionRecord.name, schema: ActionRecordSchema },
            { name: AssetList.name, schema: AssetListSchema },
            { name: AssetListFile.name, schema: AssetListFileSchema },
            { name: InvRecord.name, schema: InvRecordSchema },
            { name: TaxInformation.name, schema: TaxInformationSchema },
            { name: Location.name, schema: LocationSchema },
            { name: AssetType.name, schema: AssetTypeSchema },
            { name: Department.name, schema: DepartmentSchema }
        ]), 
        RepairRecord
    ],
    providers: [
        ActionRecordService, 
        RepairRecordService, 
        AssetListService, 
        InvRecordService, 
        AssetTypeService, 
        TaxInformationService, 
        DepartmentService, 
        LocationService
    ],
    exports: [RepairRecord],
    controllers: [RepairRecordController]
})
export class RepairRecordMoudule {}