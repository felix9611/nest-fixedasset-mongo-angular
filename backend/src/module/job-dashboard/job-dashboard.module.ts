import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { JobDashboard, JobDashboardSchema } from './job-dashboard.schema'
import { JobDashboardService } from './job-dashboard.server'

@Module({
    imports: [MongooseModule.forFeature([{ name: JobDashboard.name, schema: JobDashboardSchema }, { name: ActionRecord.name, schema: ActionRecordSchema }])],
    providers: [ActionRecordService, JobDashboardService],
    exports: [JobDashboardService],
    controllers: []
})
export class JobDashboardModule {}