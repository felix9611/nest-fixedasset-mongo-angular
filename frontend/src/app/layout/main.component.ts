import { Component, ViewEncapsulation } from '@angular/core'
import { ContentComponent } from './content/content.component'
import { MenuComponent } from './menu/menu.component'
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router'
import { HeaderComponent } from './header/header.component'

@Component({
    imports: [ContentComponent, MenuComponent, HeaderComponent, RouterOutlet, RouterLinkActive, RouterModule],
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
    encapsulation: ViewEncapsulation.None
})
export class MainComponent {
    isCollapsed = false;

    toggleSidebar() {
        this.isCollapsed = !this.isCollapsed;
    }
}