import {Component, computed, signal} from '@angular/core'
import {bootstrapApplication} from '@angular/platform-browser'
import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop'
import {Job, newJob, demoJobs} from './job'
import {FilterListApi, ListOption} from '../../components/filter-list/filter-list.component'
import {relationOptions} from './lookup-data'
import { postApiWithAuth } from '../../../../tool/httpRequest-auth'


@Component({
    imports: [CommonModule, FormsModule, DragDropModule, FilterListApi],
    standalone: true,
    templateUrl: './job-boards.component.html',
    styleUrls: ['./job-boards.component.css']
})
export class JobBoardsComponent  {
  jobs = signal<Job[]>(this.read())
  search = signal('')
  filter = signal('all')
  view = signal('board')
  columns = [
    { id: 1, name: '待處理', en: 'To do', color: '#8b91a1' },
    { id: 2, name: '進行中', en: 'In progress', color: '#6c5ce7' },
    { id: 3, name: '待審核', en: 'In review', color: '#e5a345' },
    { id: 4, name: '已完成', en: 'Done', color: '#39a982' },
  ]
  
  async ngOnInit() {}

  // members data
  memberTotal: number = 0
  members: any = []
  memberOptions: ListOption[] = [];
  systemUserSearchForm: any = {
    username: '',
    page: 1,
    limit: 10
  }
  loadUserLists = async (
    url: string,
    body: Record<string, unknown>,
  ): Promise<ListOption[]> => {
    const payload = {
      ...this.systemUserSearchForm,
      ...body,
    }

    try {
      const res = await postApiWithAuth(url, payload);

      this.members = res.lists ?? [];
      this.memberTotal = res.total ?? 0;

      this.memberOptions = this.members.map((m: any) => ({
        value: String(m._id),
        label: m.username,
      }));

      return this.memberOptions;
    } catch (error) {
      console.error('API request failed', error);
      throw error;
    }
  }

  // ASSET data
  assetTotal: number = 0
  assets: any = []
  assetOptions: ListOption[] = [];
  assetSearchForm: any = {
    assetCode: '',
    assetName: '',
    page: 1,
    limit: 10
  }
  loadAssetLists = async (
    url: string,
    body: Record<string, unknown>,
  ): Promise<ListOption[]> => {
    const payload = {
      ...this.assetSearchForm,
      ...body,
    }

    try {
      const res = await postApiWithAuth(url, payload);

      this.assets = res.lists ?? [];
      this.assetTotal = res.total ?? 0;

      this.assetOptions = this.assets.map((a: any) => ({
        value: a.assetCode,
        label: `${a.assetCode} - ${a.assetName}`,
      }));

      return this.assetOptions;
    } catch (error) {
      console.error('API request failed', error);
      throw error;
    }
  }

  // ASSET Type data
  assetTypeTotal: number = 0
  assetTypes: any = []
  assetTypeOptions: ListOption[] = [];
  assetTypeSearchForm: any = {
    typeCode: '',
    typeName: '',
    page: 1,
    limit: 10
  }
  loadAssetTypeLists = async (
    url: string,
    body: Record<string, unknown>,
  ): Promise<ListOption[]> => {
    const payload = {
      ...this.assetTypeSearchForm,
      ...body,
    }

    try {
      const res = await postApiWithAuth(url, payload);

      this.assetTypes = res.lists ?? [];
      this.assetTypeTotal = res.total ?? 0;

      this.assetTypeOptions = this.assetTypes.map((a: any) => ({
        value: a.typeCode,
        label: `${a.typeCode} - ${a.typeName}`,
      }));

      return this.assetTypeOptions;
    } catch (error) {
      console.error('API request failed', error);
      throw error;
    }
  }

  lookupOptions(key: keyof Job['jobRelationData']): ListOption[] {
    const options = [...relationOptions[key]];
    const values = [
      ...this.jobs().map((j) => j.jobRelationData[key]),
      this.selected?.jobRelationData[key],
    ];
    for (const value of values)
      if (value && !options.some((o) => o.value === value)) options.push({ value, label: value });
    return options;
  }
  assigneeOptions(): ListOption[] {
    const options = [...this.memberOptions];
    for (const id of this.selected?.userIds || [])
      if (!options.some((o) => o.value === id)) options.push({ value: id, label: id });
    return options;
  }
  relationFields: { key: keyof Job['jobRelationData']; label: string }[] = [
    { key: 'assetCode', label: '資產編號' },
    { key: 'typeCode', label: '類型編號' },
    { key: 'deptCode', label: '部門編號' },
    { key: 'placeCode', label: '地點編號' },
    { key: 'vendorCode', label: '供應商編號' },
    { key: 'stockTakeName', label: '盤點名稱' },
  ];
  selected: Job | null = null;
  tab = 'details';
  tagText = '';
  labelText = '';
  comment = '';
  checklist = '';
  error = '';
  toast = signal('');
  visible = computed(() =>
    this.jobs().filter(
      (j) =>
        (this.filter() === 'all' || j.userIds.includes('01')) &&
        `${j.title} ${j.number} ${j.category} ${j.tags.join(' ')} ${j.labels.join(' ')}`
          .toLowerCase()
          .includes(this.search().toLowerCase()),
    ),
  );
  done = computed(() => this.jobs().filter((j) => j.status === 4).length);
  active = computed(() => this.jobs().filter((j) => j.status === 2).length);
  read(): Job[] {
    try {
      const raw = localStorage.getItem('flowboard-v1');
      if (raw) {
        const data = JSON.parse(raw);
        if (
          Array.isArray(data) &&
          data.every(
            (j) =>
              j &&
              typeof j._id === 'string' &&
              Array.isArray(j.tags) &&
              Array.isArray(j.userIds) &&
              Array.isArray(j.checkLists) &&
              j.jobRelationData,
          )
        )
          return data;
      }
    } catch {}
    return demoJobs();
  }
  persist(next: Job[]) {
    try {
      localStorage.setItem('flowboard-v1', JSON.stringify(next));
      this.jobs.set(next);
      return true;
    } catch {
      this.error = '無法儲存，瀏覽器儲存空間可能已滿。請移除部分附件。';
      this.notify(this.error);
      return false;
    }
  }
  cards(status: number) {
    return this.visible().filter((j) => j.status === status);
  }
  countDone(job: Job) {
    return job.checkLists.filter((c) => c.checked).length;
  }
  initials(id: string) {
    return this.members.find((m: any) => m._id === id)?.initial || id.slice(0, 1);
  }

  open(job: Job) {
    this.selected = structuredClone(job);
    this.tagText = job.tags.join(', ');
    this.labelText = job.labels.join(', ');
    this.tab = 'details';
    this.error = '';
    this.comment = '';
    this.checklist = '';
  }

  create(status = 1) {
    const job = newJob(status);
    job.number = `JOB-${String(this.jobs().length + 1).padStart(3, '0')}`;
    this.open(job);
  }

  save() {
    if (!this.selected) return;
    const j = this.selected;
    if (!j.title.trim()) {
      this.error = '請輸入工作標題。';
      return;
    }
    if (j.jobStartDate && j.jobEndDate && j.jobEndDate < j.jobStartDate) {
      this.error = '結束日期不可早於開始日期。';
      return;
    }

    j.tags = this.tagText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    j.labels = this.labelText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const exists = this.jobs().some((x) => x._id === j._id);
    if (
      this.persist(
        exists
          ? this.jobs().map((x) => (x._id === j._id ? structuredClone(j) : x))
          : [...this.jobs(), structuredClone(j)],
      )
    ) {
      this.selected = null;
      this.notify('工作已儲存');
    }
  }

  remove() {
    if (this.selected && confirm('確定刪除呢張工作卡？')) {
      if (this.persist(this.jobs().filter((j) => j._id !== this.selected!._id))) {
        this.selected = null;
        this.notify('工作已刪除');
      }
    }
  }

  drop(event: CdkDragDrop<Job[]>, status: number) {
    const moved = event.item.data as Job;
    const list = [...event.container.data];
    if (event.previousContainer === event.container)
      moveItemInArray(list, event.previousIndex, event.currentIndex);
    else list.splice(event.currentIndex, 0, { ...moved, status });
    const ids = new Set(list.map((j) => j._id));
    const other = this.jobs().filter((j) => !ids.has(j._id) && j._id !== moved._id);
    this.persist([...other, ...list]);
  }
  toggleMember(id: string) {
    if (!this.selected) return;
    const a = this.selected.userIds;
    this.selected.userIds = a.includes(id) ? a.filter((x) => x !== id) : [...a, id];
  }
  addCheck() {
    if (this.checklist.trim() && this.selected) {
      this.selected.checkLists.push({ name: this.checklist.trim(), checked: false, status: 0 });
      this.checklist = '';
    }
  }
  addComment() {
    if (this.comment.trim() && this.selected) {
      this.selected.comments.push({ userId: '01', comment: this.comment.trim(), status: 0 });
      this.comment = '';
    }
  }
  async attach(event: Event) {
    const input = event.target as HTMLInputElement;
    const target = this.selected;
    if (!target) return;
    for (const file of Array.from(input.files || [])) {
      if (file.size > 2 * 1024 * 1024) {
        this.error = '每個附件上限為 2 MB。';
        continue;
      }
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result));
          r.onerror = reject;
          r.readAsDataURL(file);
        });
        target.attachments.push({
          fileName: file.name,
          fileType: file.type,
          base64,
          updatedAt: new Date().toISOString(),
        });
      } catch {
        this.error = '附件讀取失敗，請重試。';
      }
    }
    input.value = '';
  }
  download(a: Job['attachments'][number]) {
    const bytes = atob(a.base64.split(',')[1]);
    const url = URL.createObjectURL(
      new Blob([Uint8Array.from(bytes, (c) => c.charCodeAt(0))], {
        type: 'application/octet-stream',
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = a.fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  export() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(this.jobs(), null, 2)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowboard-jobs.json';
    a.click();
    URL.revokeObjectURL(url);
    this.notify('已匯出 JSON');
  }
  notify(s: string) {
    this.toast.set(s);
    setTimeout(() => this.toast.set(''), 3500);
  }
}