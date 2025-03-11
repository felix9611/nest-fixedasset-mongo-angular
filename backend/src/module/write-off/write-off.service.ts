import { Injectable } from '@nestjs/common'
import { WriteOff } from './write-off.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'

@Injectable()
export class WriteOffService {
    constructor(
        @InjectModel(WriteOff.name) private writeOffModel: Model<WriteOff>,
        private actionRecordService: ActionRecordService
    ) {}
    
    async create() {

    }
}