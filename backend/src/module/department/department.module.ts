import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Department, DepartmentSchema } from './department.schame'
import { DepartmentService } from './department.service'
import { DepartmentController } from './department.controller'

@Module({
    imports: [MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema }]), Department],
    providers: [DepartmentService],
    exports: [DepartmentService, Department],
    controllers: [DepartmentController]
})
export class DepartmentMoudule {}