import { InjectModel } from '@nestjs/mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { Injectable } from '@nestjs/common'
import { ExcelFieldMatch } from './excelFieldMatch.schema'
import { Model } from 'mongoose'


@Injectable()
export class ExcelFieldMatchService {
    constructor(
        @InjectModel(ExcelFieldMatch.name) private excelFieldMatchModel: Model<ExcelFieldMatch>,
        private actionRecordService: ActionRecordService
    ) {}

    async getOneById(_id: string) {
        const data = await this.excelFieldMatchModel.findOne({ _id, status: 1 })

        if (data) {
            return data
        } else {
            return {
                msg: 'This setting may be invalidated! Please contact admin!'
            }
        }
    }

    async getOneByCode(functionCode: string) {
        const data = await this.excelFieldMatchModel.findOne({ functionCode })

        if (data?.status === 1) {
            return data
        } else {
            return {
                msg: 'This setting may be invalidated! Please contact admin!'
            }
        }
    }
}