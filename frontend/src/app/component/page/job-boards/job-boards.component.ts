import {Component, computed, signal} from '@angular/core'
import {bootstrapApplication} from '@angular/platform-browser'
import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop'
import {Job, newJob, demoJobs} from './job'
import {FilterListApi, ListOption} from '../../components/filter-list/filter-list.component'
import { postApiWithAuth } from '../../../../tool/httpRequest-auth'


@Component({
    imports: [CommonModule, FormsModule, DragDropModule, FilterListApi],
    standalone: true,
    templateUrl: './job-boards.component.html',
    styleUrls: ['./job-boards.component.css']
})
export class JobBoardsComponent  {
    jobs: Job[] = [];
  search = signal('');
  filter = signal('all');
  view = signal('board');
  columns = [
    { id: 1, name: 'To Do List', en: 'To do', color: '#8b91a1', key: 'toDoList' },
    { id: 2, name: 'In Progress', en: 'In progress', color: '#6c5ce7', key: 'inProgressList' },
    { id: 3, name: 'In Review', en: 'In review', color: '#e5a345', key: 'inReviewList' },
    { id: 4, name: 'Completed', en: 'Done', color: '#39a982', key: 'completedList' },
  ]
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
  ngOnInit() {
    void this.loadJobLists();
  }

  dataSearchForm: any = {
  }

  async loadJobLists(): Promise<void> {
    const data = await postApiWithAuth('/tasks/list', this.dataSearchForm)
    this.jobs = [
      ...(data.toDoList ?? []),
      ...(data.inProgressList ?? []),
      ...(data.inReviewList ?? []),
      ...(data.completedList ?? []),
    ]
    // Replace these demo lines with your real API call:
    // const res = await postApiWithAuth('/job/list', this.searchForm);
    // this.jobs = res.lists;
    // this.jobs = demoJobs();
  }

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

  // Department data
  deptTotal: number = 0
  depts: any = []
  deptOptions: ListOption[] = [];
  deptSearchForm: any = {
    deptCode: '',
    deptName: '',
    page: 1,
    limit: 10
  }
  loadDeptLists = async (
    url: string,
    body: Record<string, unknown>,
  ): Promise<ListOption[]> => {
    const payload = {
      ...this.deptSearchForm,
      ...body,
    }

    try {
      const res = await postApiWithAuth(url, payload);

      this.depts = res.lists ?? [];
      this.deptTotal = res.total ?? 0;

      this.deptOptions = this.depts.map((a: any) => ({
        value: a.deptCode,
        label: `${a.deptCode} - ${a.deptName}`,
      }));

      return this.deptOptions;
    } catch (error) {
      console.error('API request failed', error);
      throw error;
    }
  }

  // Vendor data
  vendorTotal: number = 0
  vendors: any = []
  vendorOptions: ListOption[] = [];
  vendorSearchForm: any = {
    vendorCode: '',
    vendorName: '',
    page: 1,
    limit: 10
  }
  loadVendorLists = async (
    url: string,
    body: Record<string, unknown>,
  ): Promise<ListOption[]> => {
    const payload = {
      ...this.vendorSearchForm,
      ...body,
    }

    try {
      const res = await postApiWithAuth(url, payload);

      this.vendors = res.lists ?? [];
      this.vendorTotal = res.total ?? 0;

      this.vendorOptions = this.vendors.map((a: any) => ({
        value: a.vendorCode,
        label: `${a.vendorCode} - ${a.vendorName}`,
      }));

      return this.vendorOptions;
    } catch (error) {
      console.error('API request failed', error);
      throw error;
    }
  }

  // Stock take data
  stockTakeTotal: number = 0
  stockTakes: any = []
  stockTakeOptions: ListOption[] = [];
  stockTakeSearchForm: any = {
    stockTakeCode: '',
    stockTakeName: '',
    page: 1,
    limit: 10
  }
  loadStockTakeLists = async (
    url: string,
    body: Record<string, unknown>,
  ): Promise<ListOption[]> => {
    const payload = {
      ...this.stockTakeSearchForm,
      ...body,
    }

    try {
      const res = await postApiWithAuth(url, payload);

      this.stockTakes = res.lists ?? [];
      this.stockTakeTotal = res.total ?? 0;

      this.stockTakeOptions = this.stockTakes.map((a: any) => ({
        value: a.actionName,
        label: `${a.actionName}`,
      }));

      return this.stockTakeOptions;
    } catch (error) {
      console.error('API request failed', error);
      throw error;
    }
  }

  // Location data
  placeTotal: number = 0
  places: any = []
  placeOptions: ListOption[] = [];
  placeSearchForm: any = {
    placeCode: '',
    placeName: '',
    page: 1,
    limit: 10
  }
  loadPlaceLists = async (
    url: string,
    body: Record<string, unknown>,
  ): Promise<ListOption[]> => {
    const payload = {
      ...this.placeSearchForm,
      ...body,
    }

    try {
      const res = await postApiWithAuth(url, payload);

      this.places = res.lists ?? [];
      this.placeTotal = res.total ?? 0;

      this.placeOptions = this.places.map((a: any) => ({
        value: a.placeCode,
        label: `${a.placeCode} - ${a.placeName}`,
      }));

      return this.placeOptions;
    } catch (error) {
      console.error('API request failed', error);
      throw error;
    }
  }

  visible(): Job[] {
    return this.jobs.filter(
      (j: any) =>
        (this.filter() === 'all') &&
        (
          j.title +
          ' ' +
          j.number +
          ' ' +
          j.category +
          ' ' +
          j.tags.join(' ') +
          ' ' +
          j.labels.join(' ')
        )
          .toLowerCase()
          .includes(this.search().toLowerCase()),
    );
  }
  done(): number {
    return this.jobs.filter((j) => j.status === 4).length;
  }
  active(): number {
    return this.jobs.filter((j) => j.status === 2).length;
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
   //  job.nuumber = `JOB-${String(this.jobs.length + 1).padStart(3, '0')}`;
    this.open(job);
  }

  async save() {
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

    const finalData = j

    if (finalData._id !== '') {
      const res = await postApiWithAuth('/tasks/update', finalData)
      if (res.error) {
        this.notify('Update task failed')
      } else {
        this.selected = null;
        this.notify('Task updated successfully')
        this.loadJobLists()
      }
    } else {
      const res = await postApiWithAuth('/tasks/create', finalData)
      if (res.error) {
        this.notify('Create task failed')
      } else {
        this.selected = null;
        this.notify('Task saved successfully')
        this.loadJobLists()
      }
    }
  }

  remove() {
    if (this.selected && confirm('確定刪除呢張工作卡？')) {
      this.jobs = this.jobs.filter((j) => j._id !== this.selected!._id);
      this.selected = null;
      this.notify('工作已刪除（本次工作階段）');
    }
  }

 savingMove = false;

  async drop(event: CdkDragDrop<Job[]>, status: number) {
    if (this.savingMove) return;

    const moved = event.item.data as Job;
    const previousJobs = structuredClone(this.jobs);
    const list = [...event.container.data];

    if (event.previousContainer === event.container) {
      moveItemInArray(list, event.previousIndex, event.currentIndex);
    } else {
      list.splice(event.currentIndex, 0, { ...moved, status });
    }

    const ids = new Set(list.map((job) => job._id));
    const other = this.jobs.filter(
      (job) => !ids.has(job._id) && job._id !== moved._id,
    )

    if (moved.status === status) return

    this.savingMove = true

    try {
      await postApiWithAuth('/tasks/change-status', {
        _id: moved._id,
        status,
      })
      this.loadJobLists()
      this.notify('Updated successfully')
    } catch (error) {
      this.jobs = previousJobs
      this.notify('Update failed, the tasks have been fallback')
      console.error(error)
    } finally {
      this.savingMove = false
    }
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
      new Blob([JSON.stringify(this.jobs, null, 2)], { type: 'application/json' }),
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