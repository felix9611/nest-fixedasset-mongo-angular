import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SysMenu, SysMenuSchema } from './sys-menu.schame'
import { SysMenuService } from './sys-menu.service'
import { ActionRecord, ActionRecordSchema } from '../action-record/actionRecord.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { SysMenuController } from './sys-menu.controller'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SysMenu.name, schema: SysMenuSchema },
            { name: ActionRecord.name, schema: ActionRecordSchema }
        ])
    ],
    providers: [SysMenuService, ActionRecordService],
    controllers: [SysMenuController]
})
export class SysMenuMoudule {}