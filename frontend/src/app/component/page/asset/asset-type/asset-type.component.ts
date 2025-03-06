import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router'
import { NglModule } from 'ng-lightning'
import { FormsModule } from '@angular/forms'
import { postApiWithAuth } from '../../../../../tool/httpRequest-auth'


@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NglModule, FormsModule],
    templateUrl: './asset-type.component.html',
    styleUrl: './asset-type.component.scss',
})
export class AssetTypeComponent {
    constructor() {}

    searchForm: any = {
        page: 1,
        limit: 20
    }

    dataLists: any = []
    totals: number = 0

    ngOnInit() {
        this.loadAssetTypeLists()
    }

    async loadAssetTypeLists() {
        const res = await postApiWithAuth('/asset/type/list', this.searchForm)
        this.dataLists = res.lists
        this.totals = res.totals
    }
}