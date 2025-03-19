import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { getApiWithAuth, postApiWithAuth } from '../../../../tool/httpRequest-auth'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzFormModule } from 'ng-zorro-antd/form'
import moment from 'moment'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NzPaginationModule } from 'ng-zorro-antd/pagination'
import { DashboardReqDto, DashboardReqFilterDto } from './interface'
import { CanvasChartComponent } from '../../components/chart/chart.component'
import { transformData } from './function' 
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts'

@Component({
    standalone: true,
    imports: [CanvasJSAngularChartsModule, CommonModule, NzFormModule, NzButtonModule, FormsModule, NzModalModule, NzTableModule, NzInputModule, NzPaginationModule, CanvasChartComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
    ngOnInit(): void {
        this.getByDeptAndDateOfCosts()
        this.getByDeptAndDateOfCount()
        this.getByTypeAndDateOfCosts()
        this.getByTypeAndDateOfCount()
        this.getByTotalCost()
        this.getByTotalCount()
        // throw new Error('Method not implemented.')
    }


    globalFilter: DashboardReqFilterDto = {}

    deptAndDateInCostLoading: boolean = false
    deptAndDateInCost: any = {}
    async getByDeptAndDateOfCosts() {
        this.deptAndDateInCostLoading = false
        const dataQuery: DashboardReqDto = {
            dateType: true,
            dateTypeValue: 'YearMonth',
            dataType: true,
            dataTypeValue: 'dept',
            valueField: 'costs'
        }

        const res = await this.runQueryData(dataQuery)
        this.deptAndDateInCost = {
            data: transformData(res, 'stackedColumn', true, 'deptName', 'costs', 'yearMonth'),
            axisY: {
                title: "Amount (HKD)"
            },
            toolTip: {
                shared: true
            }
        }
        this.deptAndDateInCostLoading = true
    }

    deptAndDateInCount: any[] = []
    async getByDeptAndDateOfCount() {
        const dataQuery: DashboardReqDto = {
            dateType: true,
            dateTypeValue: 'YearMonth',
            dataType: true,
            dataTypeValue: 'dept',
            valueField: 'counts'
        }

        const res = await this.runQueryData(dataQuery)
    }

    typeAndDateInCost: any[] = []
    async getByTypeAndDateOfCosts() {
        const dataQuery: DashboardReqDto = {
            dateType: true,
            dateTypeValue: 'YearMonth',
            dataType: true,
            dataTypeValue: 'type',
            valueField: 'costs'
        }

        this.typeAndDateInCost = await this.runQueryData(dataQuery)
    }

    typeAndDateInCount: any[] = []
    async getByTypeAndDateOfCount() {
        const dataQuery: DashboardReqDto = {
            dateType: true,
            dateTypeValue: 'YearMonth',
            dataType: true,
            dataTypeValue: 'type',
            valueField: 'counts'
        }

        this.typeAndDateInCount = await this.runQueryData(dataQuery)
    }

    
    typeCount: any[] = []
    async getByTotalCount() {
        const dataQuery: DashboardReqDto = {
            dateType: true,
            dateTypeValue: 'YearMonth',
            dataType: true,
            dataTypeValue: 'type',
            valueField: 'counts'
        }

        this.typeCount = await this.runQueryDate(dataQuery)
    }

    typeCost: any[] = []
    async getByTotalCost() {
        const dataQuery: DashboardReqDto = {
            dateType: true,
            dateTypeValue: 'YearMonth',
            dataType: true,
            dataTypeValue: 'type',
            valueField: 'costs'
        }

        this.typeCost = await this.runQueryDate(dataQuery)
    }

    async runQueryData(dataQuery: DashboardReqDto) {
        const finalQuery = {
            ...dataQuery,
            filter: this.globalFilter
        }

        return await postApiWithAuth('/asset/asset-list/chart-query-data', finalQuery)
    }

    async runQueryDate(dataQuery: DashboardReqDto) {
        const finalQuery = {
            ...dataQuery,
            filter: this.globalFilter
        }

        return await postApiWithAuth('/asset/asset-list/chart-query-date', finalQuery)
    }
}