import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Budget, BudgetSchema } from './budget.schame'
import { BudgetService } from './budget.service'
import { BudgetController } from './budget.controller'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { Location, LocationSchema } from '../location/location.schame'

@Module({
    imports: [MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }, { name: ActionRecord.name, schema: ActionRecordSchema }, { name: Location.name, schema: LocationSchema }]), Budget],
    providers: [BudgetService, ActionRecordService],
    exports: [BudgetService, Budget],
    controllers: [BudgetController]
})
export class BudgetMoudule {}