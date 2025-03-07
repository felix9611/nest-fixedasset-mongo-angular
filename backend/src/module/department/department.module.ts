import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Department, DepartmentSchema } from './department.schame'
import { DepartmentService } from './department.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema }])],
    providers: [DepartmentService]
})
export class DepartmentMoudule {}