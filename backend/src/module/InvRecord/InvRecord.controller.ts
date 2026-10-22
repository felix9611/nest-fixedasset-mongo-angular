import { Body, Controller, HttpException, HttpStatus, Post, Req } from '@nestjs/common'
import { InvRecordService } from './InvRecord.service'
import { ListInvRecordResponse, ListRecordReqBody, ListRecordReqDto } from './InvRecord.dto'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { JwtPayload } from '../auth/auth.dto'

@Controller('sys/inv-record')
export class InvRecordController {
    constructor(private invReocrdService: InvRecordService) {}

    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ListRecordReqBody })
    @ApiResponse({ description: 'If successful', status: 201, type: ListInvRecordResponse })
    @Post('list')
    async list(@Body() query: ListRecordReqDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
           return await this.invReocrdService.listRecord(query)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'List without page'})
    @ApiBody({ type: ListRecordReqBody })
    @ApiResponse({ description: 'If successful', status: 201, type: [ListInvRecordResponse] })
    @Post('filter/list')
    async listWithoutPage(@Body() query: ListRecordReqDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
           return await this.invReocrdService.listRecordsWithoutPage(query)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
}