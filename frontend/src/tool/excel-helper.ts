const XLSX = require('xlsx')
const XLSXS = require('xlsx-style')
import { saveAs } from 'file-saver'
import { NzUploadFile } from 'ng-zorro-antd/upload'

export function readExcelFile(file: NzUploadFile) {
    return new Promise((resolve: any, reject :any) => {
        const types = file.name.split('.')[1]
        const fileType = [
            'xlsx',
            'xls',
            'csv'
        ].some((item) => item == types )

        if (!fileType) {
            return reject({ message: 'Format not is Excel!!'})
        }

        const reader = new FileReader()
        const result: any = []
        reader.onload = function (e) {
            const data = e.target?.result
            const wb = XLSX.read(data, {
                type: 'binary'
            })
            wb.SheetNames.forEach((sheetName: string) =>{
                result.push({
                  sheetName,
                  sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
                })
                resolve(result.length > 1 ? result[0]: result[0].sheet)
            })
        }
        reader.onerror = function(error : any) {
            return reject(error)
          }
        reader.readAsArrayBuffer(file.response.Blob)
    })
}

export function formatJson (header: any, filterVal: any, jsonData: any) {
    const updatedArray = jsonData.map((obj: any) => {
      const newObj: any = {}
  
      header.forEach((oldKey: string, index: number) => {
        
        const newKey = filterVal[index]
        console.log(obj[oldKey])
        if (obj[oldKey] !== undefined) {
          newObj[newKey] = obj[oldKey]
        }
      })
      return newObj
    })
    
    return updatedArray
  
    /* return jsonData.map((v: any)=> {
      const obj: any = {}
      header.forEach((h, i) => { 
        const anyD: any = [filterVal[i]]
        
        const newData: any = v[h]
        console.log(newData, 'data')
        obj[anyD] = newData
        
      })
      return obj
    }) */
}
  
export function formatJsonToSheet(filterVal: any, jsonData: any) {
    return jsonData.map(v => filterVal.map( j => {
      return v[j]
    }))
}


export function downloadTempExcelFile(
    excelHeader: any, 
    fileName: string, 
    excelStyle?: any,
    headerColSeetting? : any
  ) {
    const ws = XLSX.utils.aoa_to_sheet([excelHeader])
    if (excelStyle) {
      if (excelStyle) {
        for (const [key] of Object.entries(ws)) {
          if (key !== '!cols' && key !== '!ref') {
            ws[key].s = excelStyle
          }
        }
      }
      if(headerColSeetting) {
        ws['!cols'] = headerColSeetting['!cols']
      }
    }
    XLSX.utils.sheet_add_aoa(ws, [], { origin: 'A2' })
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const wopts = { bookType: 'xlsx', bookSST: false , type: 'binary' }
    const fileEx = XLSXS.write(wb, wopts)
    saveAs(new Blob([s2ab(fileEx)],{type:""}), fileName)
  }
  export function saveJsonToExcel(
    headers: any, 
    data: any, 
    excelHeader: any, 
    fileName: string, 
    excelStyle?: any,
    headerColSeetting? : any
  ) {
    let dataSet = formatJsonToSheet(headers, data)
    const ws = XLSX.utils.aoa_to_sheet([excelHeader])
    
    if (excelStyle) {
      if (excelStyle) {
        for (const [key] of Object.entries(ws)) {
          if (key !== '!cols' && key !== '!ref') {
            ws[key].s = excelStyle
          }
        }
      }
      if(headerColSeetting) {
        ws['!cols'] = headerColSeetting['!cols']
      }
    }
    console.log(ws)
    XLSX.utils.sheet_add_aoa(ws, dataSet, { origin: 'A2' })
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const wopts = { bookType: 'xlsx', bookSST: false , type: 'binary' }
    const fileEx = XLSXS.write(wb, wopts)
    // const fileEx = XLSX.writeFile(wb, fileName)
    saveAs(new Blob([s2ab(fileEx)],{type:""}), fileName)
}
  
function s2ab(s: any) {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
    return buf
}