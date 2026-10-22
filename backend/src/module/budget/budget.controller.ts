import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common'
import { BudgetBody, CreateBudgetBody, CreateBudgetDto, ImportBudgetBody, ListBudgetQuery, ListBudgetRequestDto, ListBudgetueryRes, UpdateBudgetBody, UpdateBudgetDto, UploadBudgetDto } from './budget.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { BudgetService } from './budget.service'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'
import { JwtPayload } from '../auth/auth.dto'

@Controller('base/budget')
export class BudgetController {
    constructor(private budgetService: BudgetService){}

    @ApiOperation({ summary: 'Create Budgete' })
    @ApiBody({ description: 'Create Budgete', type: CreateBudgetBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: BudgetBody  })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateBudgetDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.budgetService.create(createData)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Update Budgete' })
    @ApiBody({ type: UpdateBudgetBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateBudgetDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.budgetService.update(updateDto)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Get one data by id'})
    @ApiResponse({ description: 'If successful', status: 201, type: BudgetBody })
    @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.budgetService.getOneById(id)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Void data by Id'})
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.budgetService.invalidate(id)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Get all data'})
    @ApiResponse({ description: 'If successful', status: 201, type: [BudgetBody] })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll(@Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return this.budgetService.findAll()
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
    
    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ListBudgetQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: ListBudgetueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListBudgetRequestDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return this.budgetService.listPage(req)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'List with filter'})
    @ApiBody({ type: ListBudgetQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: [BudgetBody] })
    @Post('filter/list')
    @UseGuards(AuthGuard)
    async listWithFilter(@Body() req: ListBudgetRequestDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return this.budgetService.listWithFilter(req)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
        

    @ApiOperation({ summary: 'Create Budgete' })
    @ApiBody({ description: 'Create Budgete', type: [ImportBudgetBody] })
    @ApiResponse({ description: 'If save successful', status: 201, type: BudgetBody  })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: UploadBudgetDto[], @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.budgetService.importData(createDatas)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
    
    // testing mongo db query
    @Get('getBudgetSummary')
    @UseGuards(AuthGuard)
    async getBudgetSummary() {
        return await this.budgetService.getBudgetSummary()
    }
  
}