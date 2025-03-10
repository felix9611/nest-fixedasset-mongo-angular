import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { CreateBudgetDto, ListBudgetRequestDto, UpdateBudgetDto } from './budget.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { BudgetService } from './budget.service'

@Controller('base/budget')
export class BudgetController {
    constructor(private budgetService: BudgetService){}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateBudgetDto) {
        return await this.budgetService.create(createData)
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateBudgetDto) {
        return await this.budgetService.update(updateDto)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.budgetService.getOneById(id)
    }

    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.budgetService.invalidate(id)
    }

    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.budgetService.findAll()
    }
    
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListBudgetRequestDto) {
        return this.budgetService.listPageRole(req)
    }

    @Get('getBudgetSummary')
    async getBudgetSummary() {
        return await this.budgetService.getBudgetSummary()
    }
    
}