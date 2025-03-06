import { Component, OnInit } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router'
import { MenuComponent } from './component/menu/menu.component'
import { CommonModule } from '@angular/common'
import { FooterComponent } from './component/footer/footer.component'
import { NglModule } from 'ng-lightning'

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MenuComponent, RouterLink, RouterLinkActive, RouterModule, FooterComponent, NglModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor() {}

  title = 'felix-store-app';

  ngOnInit(): void {
    // this.promotionStoreService.loadPromotionData()
  }
}
