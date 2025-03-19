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
import { NzSelectModule } from 'ng-zorro-antd/select'

@Component({
    standalone: true,
    imports: [
        CommonModule, 
        NzFormModule, 
        NzButtonModule, 
        FormsModule, 
        NzModalModule, 
        NzTableModule, 
        NzInputModule, 
        NzPaginationModule, 
        CanvasChartComponent,
        NzSelectModule
    ],
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
        this.loadTypeList()
        this.loadDeptList()
        this.loadLocationList()
    }

    typeLists: any[] = []
    async loadTypeList() {
        this.typeLists = await getApiWithAuth('/asset/type/getAll')
    }

    deptLists: any[] = []
    async loadDeptList() {
        this.deptLists = await getApiWithAuth('/sys/department/getAll')
    }

    placeLists: any[] = []
    async loadLocationList() {
        this.placeLists = await getApiWithAuth('/base/location/getAll')
    }

    async runSearch() {
        await this.getByDeptAndDateOfCosts()
        await this.getByDeptAndDateOfCount()
        await this.getByTypeAndDateOfCosts()
        await this.getByTypeAndDateOfCount()
        await this.getByTotalCost()
        await this.getByTotalCount()
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

    deptAndDateInCountLoading: boolean = false
    deptAndDateInCount: any = {}
    async getByDeptAndDateOfCount() {
        this.deptAndDateInCountLoading = false
        const dataQuery: DashboardReqDto = {
            dateType: true,
            dateTypeValue: 'YearMonth',
            dataType: true,
            dataTypeValue: 'dept',
            valueField: 'counts'
        }

        const res = await this.runQueryData(dataQuery)
        this.deptAndDateInCount = {
            data: transformData(res, 'stackedColumn', true, 'deptName', 'count', 'yearMonth'),
            axisY: {
                title: "Counts"
            },
            toolTip: {
                shared: true
            }
        }
        this.deptAndDateInCountLoading = true
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