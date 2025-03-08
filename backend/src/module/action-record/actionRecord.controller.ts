import { Body, Controller, Post } from '@nestjs/common'
import { ActionRecordService } from './actionRecord.service'
import { ActionRecordListDto } from './actionRecord.dto'

@Controller('action-records')
export class ActionRecordController {
    constructor(private actionRecordService: ActionRecordService) {}

    @Post('list')
    async list(@Body() query: ActionRecordListDto) {
        return await this.actionRecordService.listAndPage(query)
    }
}