import {ListOption} from '../../components/filter-list/filter-list.component'
import {Job} from './job'

// Demo lookup lists. Replace with master-data API results when connecting the backend.
export const relationOptions: Record<keyof Job['jobRelationData'],ListOption[]> = {
  assetCode: [{value:'AST-001',label:'手提電腦 · Dell Latitude'},{value:'AST-002',label:'會議室投影機'},{value:'AST-003',label:'網絡交換器'},{value:'AST-004',label:'辦公室打印機'}],
  typeCode: [{value:'IT',label:'資訊科技設備'},{value:'OFFICE',label:'辦公室設備'},{value:'AV',label:'影音設備'}],
  deptCode: [{value:'IT',label:'資訊科技部'},{value:'OPS',label:'營運部'},{value:'ADMIN',label:'行政部'},{value:'FIN',label:'財務部'}],
  placeCode: [{value:'HQ-1F',label:'總部 · 一樓'},{value:'HQ-2F',label:'總部 · 二樓'},{value:'MEETING-A',label:'會議室 A'},{value:'STORE',label:'倉庫'}],
  vendorCode: [{value:'V-001',label:'科技設備供應商'},{value:'V-002',label:'辦公室用品供應商'},{value:'V-003',label:'設備維修服務商'}],
  stockTakeName: [{value:'2026-Q4',label:'2026 第四季資產盤點'},{value:'2026-ANNUAL',label:'2026 年度資產盤點'},{value:'2026-IT',label:'2026 資訊科技設備盤點'}]
};
