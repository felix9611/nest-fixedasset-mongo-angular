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
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'

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
        NzSelectModule,
        NzDatePickerModule,
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
        this.getByPlaceAndDateOfCount()
        this.getByPlaceAndDateOfCosts()
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
        await this.getByPlaceAndDateOfCount()
        await this.getByPlaceAndDateOfCosts()
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
            data: transformData(res, 'stackedColumn', true, 'deptName', 'costs', ['year', 'monthString']),
            animationEnabled: true,
            axisY: {
                title: "Amount (HKD)"
            },
            axisX: {
                title: "Year - Month",
                valueFormatString: "YYYY - MMM",
                xValueType: "dateTime"
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
            data: transformData(res, 'stackedColumn', true, 'deptName', 'count', ['year', 'monthString']),
            axisY: {
                title: "Counts"
            },
            axisX: {
                title: "Year - Month",
                valueFormatString: "YYYY - MMM",
                xValueType: "dateTime"
            },
            toolTip: {
                shared: true
            }
        }
        this.deptAndDateInCountLoading = true
    }

    typeAndDateInCostLoading: boolean = false
    typeAndDateInCost: any = {}
    async getByTypeAndDateOfCosts() {
        this.typeAndDateInCostLoading = true
        const dataQuery: DashboardReqDto = {
            dateType: true,
            dateTypeValue: 'YearMonth',
            dataType: true,
            dataTypeValue: 'type',
            valueField: 'costs'
        }

        const res = await this.runQueryData(dataQuery)
        this.typeAndDateInCost = {
            data: transformData(res, 'stackedColumn', true, 'typeName', 'costs', ['year', 'monthString']),
            axisY: {
                title: "Amount (HKD)"
            },
            axisX: {
                title: "Year - Month",
                valueFormatString: "YYYY - MMM",
                xValueType: "dateTime"
            },
            toolTip: {
                shared: true
            }
        }
        this.typeAndDateInCostLoading = true
    }

    typeAndDateInCountLoading: boolean = false
    typeAndDateInCount: any = {}
    async getByTypeAndDateOfCount() {
        this.typeAndDateInCountLoading = false
        const dataQuery: DashboardReqDto = {
            dateType: true,
            dateTypeValue: 'YearMonth',
            dataType: true,
            dataTypeValue: 'type',
            valueField: 'counts'
        }

        const res = await this.runQueryData(dataQuery)
        this.typeAndDateInCount = {
            data: transformData(res, 'stackedColumn', true, 'typeName', 'count', ['year', 'monthString']),
            axisY: {
                title: "Amount (HKD)"
            },
            toolTip: {
                shared: true
            }
        }
        this.typeAndDateInCountLoading = true
    }

    placeAndDateInCountLoading: boolean = false
    placeAndDateInCount: any = {}
    async getByPlaceAndDateOfCount() {
        this.placeAndDateInCountLoading = false
        const dataQuery: DashboardReqDto = {
            dateType: true,
            dateTypeValue: 'YearMonth',
            dataType: true,
            dataTypeValue: 'location',
            valueField: 'counts'
        }

        const res = await this.runQueryData(dataQuery)
        this.placeAndDateInCount = {
            data: transformData(res, 'stackedColumn', true, 'placeName', 'count', ['year', 'monthString']),
            axisY: {
                title: "Counts"
            },
            toolTip: {
                shared: true
            }
        }
        console.log(this.placeAndDateInCount, 'this.placeAndDateInCount')
        this.placeAndDateInCountLoading = true
    }

    placeAndDateInCostsLoading: boolean = false
    placeAndDateInCosts: any = {}
    async getByPlaceAndDateOfCosts() {
        this.placeAndDateInCostsLoading = false
        const dataQuery: DashboardReqDto = {
            dateType: true,
            dateTypeValue: 'YearMonth',
            dataType: true,
            dataTypeValue: 'location',
            valueField: 'costs'
        }

        const res = await this.runQueryData(dataQuery)
        this.placeAndDateInCosts = {
            data: transformData(res, 'stackedColumn', true, 'placeName', 'costs', ['year', 'monthString']),
            axisY: {
                title: "Amount (HKD)"
            },
            toolTip: {
                shared: true
            }
        }
        this.placeAndDateInCostsLoading = true
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