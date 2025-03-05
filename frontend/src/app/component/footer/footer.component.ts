import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {
    footerData = {
        name: 'Felix Mak',
        email: 'felix9611.ca@gmail.com',
        year: new Date().getFullYear()
    }
}