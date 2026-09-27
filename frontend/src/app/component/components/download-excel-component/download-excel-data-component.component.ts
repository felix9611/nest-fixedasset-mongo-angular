import { Component, Input } from "@angular/core"
import { getApiWithAuth, postApiWithAuth } from "../../../../tool/httpRequest-auth"
import { saveJsonToExcel } from "../../../../tool/excel-helper"

@Component({
    selector: 'app-download-excel-data',
    standalone: true,
    template: '<div (click)="downloadExcelData()">{{ buttonLabel }}</div>'
})
export class DownloadExcelDataComponent {
    @Input() dataFieldList: string[] = []
    @Input() buttonLabel: string = 'Download Excel Template'
    @Input() excelFileName: string = 'template.xlsx'
    @Input() excelFieldList: any[] = []
    @Input() downloadDataApiPath: string = ''
    @Input() dataMode: 'get' | 'post' = 'get'
    @Input() filterSet: any = {}

    async downloadExcelData() {
        let resultData: any = {}

        if (this.filterSet.page && this.filterSet.limit) {
            delete this.filterSet.page
            delete this.filterSet.limit
        }

        console.log(this.filterSet)

        if (this.dataMode === 'get') {
            resultData = await getApiWithAuth(this.downloadDataApiPath)
        } else if (this.dataMode === 'post') {
            resultData = await postApiWithAuth(this.downloadDataApiPath, this.filterSet)
        } else {
            console.error('dataMode is not valid')
        }

        saveJsonToExcel(this.dataFieldList, resultData, this.excelFieldList, this.excelFileName)

    }
}