import {Component, ElementRef, EventEmitter, HostListener, Input, Output, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';

export interface ListOption {value: string; label: string;}

@Component({
  selector: 'app-filter-list', 
  standalone: true, 
  imports: [FormsModule],
  styleUrls: ['filter-list.component.css'],
  template: `
    <div class="filter-list">
      <button type="button" class="filter-trigger" [attr.aria-label]="label" [attr.aria-expanded]="expanded" (click)="expanded=!expanded; query=''">
        <span>{{ summary() }}</span><span>⌄</span>
      </button>
      @if (multiple && value.length) {
        <div class="selected-options">@for (id of value; track id) {
          <button type="button" (click)="remove(id)" [attr.aria-label]="'移除 '+name(id)">{{name(id)}} ×</button>
        }</div>
      }
      @if (expanded) {
        <div class="filter-menu">
          <input type="search" 
            [(ngModel)]="query" 
            [attr.aria-label]="'搜尋'+label" placeholder="輸入編號或名稱搜尋..." (keydown.escape)="$event.stopPropagation(); expanded=false"
        >
          <div class="filter-options" [attr.aria-label]="label+'選項'">
            @for (option of filtered(); track option.value) {
              <button type="button" [class.is-selected]="value.includes(option.value)" [attr.aria-pressed]="value.includes(option.value)" (click)="choose(option.value)">
                <span><b>{{option.label}}</b><small>{{option.value}}</small></span><span>{{value.includes(option.value)?'✓':'＋'}}</span>
              </button>
            } @empty { <p class="filter-empty">搵唔到符合條件嘅選項</p> }
          </div>
          <div class="filter-menu-footer"><small>{{filtered().length}} 個選項</small><button type="button" (click)="valueChange.emit([]); expanded=false">清除選擇</button></div>
        </div>
      }
    </div>
  `
})
export class FilterList {
  @Input() options: ListOption[]=[];
  @Input() value: string[]=[];
  @Input() label='';
  @Input() multiple=false;
  @Output() valueChange=new EventEmitter<string[]>();
  expanded=false; query='';
  private element=inject(ElementRef);
  name(id:string){return this.options.find(o=>o.value===id)?.label||id;}
  summary(){return this.value.length?this.value.map(id=>this.name(id)).join('、'):`請選擇${this.label}`;}
  filtered(){const q=this.query.trim().toLocaleLowerCase();return this.options.filter(o=>`${o.value} ${o.label}`.toLocaleLowerCase().includes(q));}
  choose(id:string){if(this.multiple)this.valueChange.emit(this.value.includes(id)?this.value.filter(v=>v!==id):[...this.value,id]);else{this.valueChange.emit([id]);this.expanded=false;}}
  remove(id:string){this.valueChange.emit(this.value.filter(v=>v!==id));}
  @HostListener('document:click',['$event']) outside(event:MouseEvent){if(!this.element.nativeElement.contains(event.target))this.expanded=false;}
}
