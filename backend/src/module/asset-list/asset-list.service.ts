import { Injectable } from '@nestjs/common'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { AssetList } from './asset-list.schame'


@Injectable()
export class AssetListService {
    constructor(
        @InjectModel(AssetList.name) private assetListModel: Model<AssetList>,
        private actionRecordService: ActionRecordService
    ) {}

    async getById(_id: string) {
        const res = await this.assetListModel.findOne({ _id })
        if (res?.status === 0) {
            return {
                msg: 'This asset maybe voided! Please contact admin!'
            }
        } else {
            return res
        }
    }

    async getByAssetCode(assetCode: string) {
        const res = await this.assetListModel.findOne({ assetCode })
        if (res?.status === 0) {
            return {
                msg: 'This asset maybe voided! Please contact admin!'
            }
        } else {
            return res
        }
    }


    
}