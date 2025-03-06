import { Component } from '@angular/core'
import { ContentComponent } from './content/content.component'


@Component({
    imports: [ContentComponent],
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent {}