import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { BudgetBody, CreateBudgetBody, CreateBudgetDto, ImportBudgetBody, ListBudgetQuery, ListBudgetRequestDto, ListBudgetueryRes, UpdateBudgetBody, UpdateBudgetDto, UploadBudgetDto } from './budget.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { BudgetService } from './budget.service'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'

@Controller('base/budget')
export class BudgetController {
    constructor(private budgetService: BudgetService){}

    @ApiOperation({ summary: 'Create Budgete' })
    @ApiBody({ description: 'Create Budgete', type: CreateBudgetBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: BudgetBody  })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateBudgetDto) {
        return await this.budgetService.create(createData)
    }

    @ApiOperation({ summary: 'Update Budgete' })
    @ApiBody({ type: UpdateBudgetBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateBudgetDto) {
        return await this.budgetService.update(updateDto)
    }

    @ApiOperation({ summary: 'Get one data by id'})
    @ApiResponse({ description: 'If successful', status: 201, type: BudgetBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.budgetService.getOneById(id)
    }

    @ApiOperation({ summary: 'Void data by Id'})
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.budgetService.invalidate(id)
    }

    @ApiOperation({ summary: 'Get all data'})
    @ApiResponse({ description: 'If successful', status: 201, type: [BudgetBody] })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.budgetService.findAll()
    }
    
    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ListBudgetQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: ListBudgetueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListBudgetRequestDto) {
        return this.budgetService.listPage(req)
    }

    @ApiOperation({ summary: 'Create Budgete' })
    @ApiBody({ description: 'Create Budgete', type: [ImportBudgetBody] })
    @ApiResponse({ description: 'If save successful', status: 201, type: BudgetBody  })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('batch-import')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: UploadBudgetDto[]) {
        return await this.budgetService.importData(createDatas)
    }
    
    // testing mongo db query
    @Get('getBudgetSummary')
    async getBudgetSummary() {
        return await this.budgetService.getBudgetSummary()
    }
  
}