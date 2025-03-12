import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SysMenu, SysMenuSchema } from './sys-menu.schame'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SysMenu.name, schema: SysMenuSchema }
        ])
    ]
})
export class SysMenuMoudule {}