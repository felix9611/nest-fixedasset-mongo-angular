import { Injectable } from '@nestjs/common'
import { WriteOff } from './write-off.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { CreateWriteOffRecrod } from './write-off.dto'
import { AssetListService } from '../asset-list/asset-list.service'
import { WriteOffModule } from './write-off.module'
import { InvRecordService } from '../InvRecord/InvRecord.service'

@Injectable()
export class WriteOffService {
    constructor(
        @InjectModel(WriteOff.name) private writeOffModel: Model<WriteOff>,
        private actionRecordService: ActionRecordService,
        private assetListService: AssetListService,
        private invRecordService: InvRecordService
    ) {}

    async create(createData: CreateWriteOffRecrod) {
        let { assetId, lastPlaceId, reason, lastDay } = createData
        
        const checkAsset: any = await this.assetListService.getById(assetId)

        if (checkAsset) {

            if (!lastDay || lastDay === null) {
                lastDay = new Date()
            }

            const finalData = {
                assetId,
                lastPlaceId,
                lastDay,
                reason,
                createdAt: new Date(),
                status: 1
            }

            await this.assetListService.invalidate(checkAsset._id)

            await this.actionRecordService.saveRecord({
                actionName: 'Create Write Off Record',
                actionMethod: 'POST',
                actionFrom: 'Off Record',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            await this.invRecordService.create({
                assetCode: checkAsset.assetCode,
                placeFrom: lastPlaceId,
                placeTo: ''
            })

            const create = new this.writeOffModel(finalData)
            return create.save()


        } else {

            await this.actionRecordService.saveRecord({
                actionName: 'Create Write Off Record',
                actionMethod: 'POST',
                actionFrom: 'Write Off',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This asset already write off or invalidate!'
            }
        }
    }
}