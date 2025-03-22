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

    async invalidate(_id: string) {
        const checkData = await this.excelFieldMatchModel.findOne({ _id })

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Void Excel Field Match',
                actionMethod: 'GET',
                actionFrom: 'Excel Field Match',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This RECORD has been invalidated! Please contact admin!'
            }
        } else {
                await this.excelFieldMatchModel.updateOne({ _id}, {
                    status: 0,
                    updateAt: new Date()
                })
        
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Excel Field Match',
                    actionMethod: 'GET',
                    actionFrom: 'Excel Field Match',
                    actionData: {
                        _id,
                        status: 0,
                        updateAt: new Date()
                    },
                    actionSuccess: 'Success',
                    createdAt: new Date()
                })

                return {
                  msg: 'Invalidate successfully!'
                }

        }
    }
}