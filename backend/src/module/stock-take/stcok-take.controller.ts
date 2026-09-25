import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { StockTakeService } from './stock-take.service'
import { AuthGuard } from '../auth/AuthGuard'
import { CreateStockTakeFormBody, FullStockTakeBody, ListRecordReqBody, ListStockTakeBody, ListStockTakeDto, StockTakeBody, StockTakeForm, StockTakeItemBody, StockTakeItemDto, StockTakeItemDtoSubmit, SubmitStockTakeItemBody, UpdateStockTakeForm, UpdateStockTakeFormBody } from './stock-take.dto'
import { ReturnMsg } from 'src/tool/open-api-body'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'


@Controller('asset/stock-take')
export class StockTakeController {
    constructor(
        private stockTakeService: StockTakeService
    ) {}

    @ApiOperation({ summary: 'Get one Stock Take Form by Id' })
    @ApiResponse({ description: 'If save successful', status: 201, type: FullStockTakeBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.stockTakeService.getOneStockTake(id)
    }

    @ApiOperation({ summary: 'Create Stock Take Form' })
    @ApiBody({ type: CreateStockTakeFormBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: StockTakeBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create-form')
    @UseGuards(AuthGuard)
    async create(@Body() createBody: StockTakeForm, @Req() req: any) {
        return await this.stockTakeService.create(createBody, req.user.username)
    }

    @ApiOperation({ summary: 'Update Stock Take Form' })
    @ApiBody({ type: UpdateStockTakeFormBody })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('update-form')
    @UseGuards(AuthGuard)
    async update(@Body() createBody: UpdateStockTakeForm) {
        return await this.stockTakeService.update(createBody)
    }

    @ApiOperation({ summary: 'Void One by Id' })
    @ApiResponse({  description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('void/:id')
    @UseGuards(AuthGuard)
    async voidById(@Param('id') id: string) {
        return await this.stockTakeService.finishOrVoid(id, 0)
    }

    @ApiOperation({ summary: 'Finish One by Id' })
    @ApiResponse({  description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('finish/:id')
    @UseGuards(AuthGuard)
    async finishById(@Param('id') id: string, @Req() req: any) {
        return await this.stockTakeService.finishOrVoid(id, 2, req.user.username)
    }

    @ApiOperation({ summary: 'List Stock Take Form' })
    @ApiBody({ type: ListRecordReqBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ListStockTakeBody })
    @Post('list')
    @UseGuards(AuthGuard)
    async listStockTakeForm(@Body() query: ListStockTakeDto) {
        return await this.stockTakeService.listStockTakeForm(query)
    }

    @ApiOperation({ summary: 'Create Stock Take Form' })
    @ApiBody({ type: SubmitStockTakeItemBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: StockTakeItemBody })
    @Post('item-submit')
    @UseGuards(AuthGuard)
    async stockTakeItemSubmit(@Body() data: StockTakeItemDtoSubmit) {
        return await this.stockTakeService.stockTakeItemSubmit(data)
    }
}