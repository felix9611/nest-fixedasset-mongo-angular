import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SysMenu, SysMenuSchema } from './sys-menu.schame'
import { SysMenuService } from './sys-menu.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: SysMenu.name, schema: SysMenuSchema }
        ])
    ],
    providers: [SysMenuService]
})
export class SysMenuMoudule {}