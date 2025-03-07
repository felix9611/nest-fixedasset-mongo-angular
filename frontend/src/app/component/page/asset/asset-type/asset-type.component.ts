import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router'
import { NglModule } from 'ng-lightning'
import { FormsModule } from '@angular/forms'
import { postApiWithAuth } from '../../../../../tool/httpRequest-auth'
import { MatTableModule } from '@angular/material/table'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { XTableColumn, XTableComponent } from '@ng-nest/ui/table'
import { NzTableModule } from 'ng-zorro-antd/table'
@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NglModule, FormsModule, MatTableModule, MatPaginatorModule, XTableComponent, NzTableModule],
    templateUrl: './asset-type.component.html',
    styleUrl: './asset-type.component.css',
})
export class AssetTypeComponent {
    constructor() {}

    displayedColumns: string[] = ['typeCode', 'typeName']
    searchForm: any = {
        page: 1,
        limit: 20
    }

    dataLists: any[] = []
    totals: number = 0

    ngOnInit() {
        this.loadAssetTypeLists()
    }

    async loadAssetTypeLists() {
        const res = await postApiWithAuth('/asset/type/list', this.searchForm)
        this.dataLists = res.lists
        this.totals = res.totals
    }

    async editDialg(row: any) {

    }
}