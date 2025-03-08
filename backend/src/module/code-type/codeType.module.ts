import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CodeType, CodeTypeSchema } from './codeType.schame'
import { CodeTypeService } from './codeType.service'
import { CodeTypeController } from './codeType.controller'

@Module({
    imports: [MongooseModule.forFeature([{ name: CodeType.name, schema: CodeTypeSchema }]), CodeType],
    providers: [CodeTypeService],
    exports: [CodeTypeService, CodeType],
    controllers: [CodeTypeController]
})
export class CodeTypeMoudule {}