import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { OnChanges, OnDestroy, OnInit, SimpleChanges, signal } from '@angular/core';
import { mapListResponse } from './filter-list-api-data';

export interface ListOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-filter-list-api',
  standalone: true,
  styleUrls: ['./filter-list.component.css'],
  template: `
    <div class="filter-list">
      <button
        type="button"
        class="filter-trigger"
        [attr.aria-label]="label"
        [attr.aria-expanded]="expanded"
        (click)="toggle()"
      >
        <span>{{ summary() }}</span
        ><span>⌄</span>
      </button>
      @if (multiple && value.length) {
        <div class="selected-options">
          @for (id of value; track id) {
            <button type="button" (click)="remove(id)" [attr.aria-label]="'移除 ' + name(id)">
              {{ name(id) }} ×
            </button>
          }
        </div>
      }
      @if (expanded) {
        <div class="filter-menu">
          <input
            type="search"
            [value]="query"
            (input)="onInput($event)"
            (keydown.enter)="submitSearch($event)"
            [attr.aria-label]="'搜尋' + label"
            placeholder="輸入編號或名稱搜尋..."
            (keydown.escape)="$event.stopPropagation(); expanded = false"
          />
          <div class="api-state" aria-live="polite">
            @if (loading()) {
              <p>載入中...</p>
            }
            @if (error()) {
              <p role="alert">{{ error() }}</p>
              <button type="button" (click)="loadPage(failedPage)">重新載入</button>
            }
          </div>
          <div class="filter-options" [attr.aria-label]="label + '選項'">
            @for (option of filtered(); track option.value) {
              <button
                type="button"
                [class.is-selected]="value.includes(option.value)"
                [attr.aria-pressed]="value.includes(option.value)"
                (click)="choose(option.value)"
              >
                <span
                  ><b>{{ option.label }}</b
                  ><small>{{ option.value }}</small></span
                ><span>{{ value.includes(option.value) ? '✓' : '＋' }}</span>
              </button>
            } @empty {
              @if (!loading() && !error()) {
                <p class="filter-empty">搵唔到符合條件嘅選項</p>
              }
            }
          </div>
          @if (hasMore() && !error()) {
            <button
              type="button"
              class="load-more"
              [disabled]="loading()"
              (click)="loadPage(page + 1)"
            >
              載入更多
            </button>
          }
          <div class="filter-menu-footer">
            <small>{{ filtered().length }} 個選項</small
            ><button type="button" (click)="valueChange.emit([]); expanded = false">
              清除選擇
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class FilterListApi implements OnChanges, OnInit, OnDestroy {
  @Input() apiUrl = '/sys/user/list';
  @Input() requestBody: Record<string, unknown> = { name: '', page: 1, limit: 10 };
  @Input() postApi?: (url: string, body: Record<string, unknown>) => Promise<unknown>;
  @Input() mapResponse: (response: unknown) => ListOption[] = mapListResponse;
  @Input() value: string[] = [];
  @Input() label = '';
  @Input() multiple = false;
  @Output() valueChange = new EventEmitter<string[]>();

  loading = signal(false);
  error = signal('');
  hasMore = signal(false);
  options = signal<ListOption[]>([]);
  expanded = false;
  query = '';
  page = 0;
  failedPage = 1;
  private initialized = false;
  private destroyed = false;
  private version = 0;
  private searchTimer?: ReturnType<typeof setTimeout>;
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private names = new Map<string, string>();
  private element = inject(ElementRef);

  ngOnInit() {
    this.initialized = true;
    this.readQuery();
    void this.reload();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.initialized &&
      ['apiUrl', 'requestBody', 'postApi', 'mapResponse'].some((key) => changes[key])
    ) {
      this.readQuery();
      this.names.clear();
      void this.reload();
    }
  }

  private readQuery() {
    this.query = typeof this.requestBody['name'] === 'string' ? this.requestBody['name'] : '';
  }

  toggle() {
    this.expanded = !this.expanded;
    if (this.expanded && this.page === 0 && !this.loading()) void this.reload();
  }

  onInput(event: Event) {
    this.search((event.target as HTMLInputElement).value);
  }

  search(query: string) {
    this.query = query;
    clearTimeout(this.searchTimer);
    ++this.version;
    this.options.set([]);
    this.page = 0;
    this.hasMore.set(false);
    this.error.set('');
    this.loading.set(true);
    this.searchTimer = setTimeout(() => void this.loadPage(1), 300);
  }

  submitSearch(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.query = (event.target as HTMLInputElement).value;
    void this.reload();
  }

  async reload() {
    clearTimeout(this.searchTimer);
    this.options.set([]);
    this.page = 0;
    this.hasMore.set(false);
    await this.loadPage(1);
  }

  async loadPage(page: number) {
    clearTimeout(this.searchTimer);
    const version = ++this.version;
    this.failedPage = page;
    this.error.set('');
    if (typeof this.postApi !== 'function' || !this.apiUrl.trim()) {
      this.loading.set(false);
      this.error.set('未設定 API：請綁定 [postApi]="loadUserLists" 及 apiUrl。');
      return;
    }
    const requestedLimit = Number(this.requestBody['limit']);
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? requestedLimit : 10;
    const body = { ...this.requestBody, name: this.query.trim(), page, limit };
    this.loading.set(true);
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      // Invoke the parent's async callback directly. No HttpClient registration required.
      const request = this.postApi(this.apiUrl, body);
      const result = await Promise.race([
        request,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('API 請求逾時，請重試。')), 15000);
          this.timers.add(timer);
        }),
      ]);
      if (version !== this.version || this.destroyed) return;
      if (result === undefined) throw new Error('父元件函數必須 return 選項陣列或 API 回應。');
      let rows: ListOption[];
      try {
        rows = this.mapResponse(result);
        if (
          !Array.isArray(rows) ||
          rows.some((row) => !row || typeof row.value !== 'string' || typeof row.label !== 'string')
        ) {
          throw new Error('Invalid options');
        }
      } catch {
        throw new Error('選項格式錯誤：請回傳 { value, label }[]，或設定 mapResponse。');
      }
      rows.forEach((row) => this.names.set(row.value, row.label));
      this.options.set(
        Array.from(
          new Map(
            [...(page === 1 ? [] : this.options()), ...rows].map((row) => [row.value, row]),
          ).values(),
        ),
      );
      this.page = page;
      this.hasMore.set(rows.length >= limit);
    } catch (error) {
      if (version === this.version && !this.destroyed) {
        this.error.set(error instanceof Error ? error.message : '選項載入失敗，請重試。');
      }
    } finally {
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(timer);
      }
      if (version === this.version && !this.destroyed) this.loading.set(false);
    }
  }

  filtered() {
    return this.options();
  }
  name(id: string) {
    this.options();
    return this.names.get(id) || id;
  }
  summary() {
    return this.value.length
      ? this.value.map((id) => this.name(id)).join('、')
      : '請選擇' + this.label;
  }
  choose(id: string) {
    this.valueChange.emit(
      this.multiple
        ? this.value.includes(id)
          ? this.value.filter((value) => value !== id)
          : [...this.value, id]
        : [id],
    );
    if (!this.multiple) this.expanded = false;
  }
  remove(id: string) {
    this.valueChange.emit(this.value.filter((value) => value !== id));
  }

  @HostListener('document:click', ['$event']) outside(event: MouseEvent) {
    if (!this.element.nativeElement.contains(event.target)) this.expanded = false;
  }

  ngOnDestroy() {
    this.destroyed = true;
    ++this.version;
    clearTimeout(this.searchTimer);
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }
}