import { Body, Controller, Post } from '@nestjs/common'
import { InvRecordService } from './InvRecord.service'
import { ListInvRecordResponse, ListRecordReqBody, ListRecordReqDto } from './InvRecord.dto'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('sys/inv-record')
export class InvRecordController {
    constructor(private invReocrdService: InvRecordService) {}

    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ListRecordReqBody })
    @ApiResponse({ description: 'If successful', status: 201, type: ListInvRecordResponse })
    @Post('list')
    async list(@Body() query: ListRecordReqDto) {
        return await this.invReocrdService.listRecord(query)
    }
}