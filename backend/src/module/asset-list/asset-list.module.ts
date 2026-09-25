import { Module } from '@nestjs/common'
import { AssetList, AssetListSchema } from './asset-list.schame'
import { MongooseModule } from '@nestjs/mongoose'
import { AssetListService } from './asset-list.service'
import { AssetListController } from './asset-list.cotroller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { LocationSchema, Location } from '../location/location.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { InvRecord, InvRecordSchema } from '../InvRecord/InvRecord.schema'
import { InvRecordService } from '../InvRecord/InvRecord.service'
import { AssetListFile, AssetListFileSchema } from './asset-list-file.schame'
import { AssetListQueryService } from './asset-list-query.service'
import { TaxInformation, TaxInformationSchema } from '../tax-information/tax-information.schame'
import { Department, DepartmentSchema } from '../department/department.schame'
import { AssetType, AssetTypeSchema } from '../asset-type/assetType.schame'
import { AssetTypeService } from '../asset-type/assetType.service'
import { TaxInformationService } from '../tax-information/tax-information.service'
import { DepartmentService } from '../department/department.service'
import { LocationService } from '../location/location.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AssetList.name, schema: AssetListSchema }, 
            { name: AssetListFile.name, schema: AssetListFileSchema },
            { name: ActionRecord.name, schema: ActionRecordSchema }, 
            { name: Location.name, schema: LocationSchema },
            { name: InvRecord.name, schema: InvRecordSchema },
            { name: TaxInformation.name, schema: TaxInformationSchema },
            { name: AssetType.name, schema: AssetTypeSchema },
            { name: Department.name, schema: DepartmentSchema }
        ]), AssetList
    ],
    providers: [
        AssetListService, 
        ActionRecordService, 
        InvRecordService, 
        AssetListQueryService, 
        AssetTypeService, 
        TaxInformationService, 
        DepartmentService, 
        LocationService
    ],
    controllers: [AssetListController],
    exports: [AssetListService, AssetList]
})
export class AssetListMoudule {}