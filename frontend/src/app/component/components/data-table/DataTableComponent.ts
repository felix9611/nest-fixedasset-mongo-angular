import { Component, OnInit, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { Column } from './column'

@Component({
  selector: 'app-table',
  templateUrl: './TableComponent.html',
  styleUrls: ['./TableComponent.css']
})
export class TableComponent<T> implements OnInit {
  @Input()
  tableColumns: Array<Column> = [];

  @Input()
  tableData: Array<T> = [];

  displayedColumns: Array<string> = [];
  dataSource: MatTableDataSource<T> = new MatTableDataSource();

  constructor() {}

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    this.dataSource = new MatTableDataSource(this.tableData);
  }
}