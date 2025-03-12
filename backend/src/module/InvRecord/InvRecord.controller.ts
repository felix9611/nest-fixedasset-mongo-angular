import { Body, Controller, Post } from '@nestjs/common'
import { InvRecordService } from './InvRecord.service'
import { ListRecordReqDto } from './InvRecord.dto'

@Controller('sys/inv-record')
export class InvRecordController {
    constructor(private invReocrdService: InvRecordService) {}

    @Post('list')
    async list(@Body() query: ListRecordReqDto) {
        return await this.invReocrdService.listRecord(query)
    }
}