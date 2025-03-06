import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router'
import { NglModule } from 'ng-lightning'
import { FormsModule } from '@angular/forms'
import { HttpService } from '../../../../../tool/HttpService'


@Component({
    // selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NglModule, FormsModule],
    templateUrl: './asset-type.component.html',
    styleUrl: './asset-type.component.scss',
})
export class AssetTypeComponent {
    constructor(
        private httpService: HttpService
    ) {}
}