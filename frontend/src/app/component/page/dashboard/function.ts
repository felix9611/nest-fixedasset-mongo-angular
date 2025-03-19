export function transformData(rawData: any[], chartType: string, showInLegend: boolean, keyName: string, valueName: string, dateKeyName: string): any[] {
    const dataMap: Record<string, { name: string; type: string; showInLegend: boolean ;dataPoints: { label: string; y: number }[] }> = {}

    rawData.forEach((data: any) => {
      if (!data[dateKeyName] || data[valueName] === 0) return
      
      if (!dataMap[data[keyName]]) {
        dataMap[data[keyName]] = { name: data[keyName], type: chartType , showInLegend: showInLegend, dataPoints: [] }
      }
      
      dataMap[data[keyName]].dataPoints.push({ label: data[dateKeyName], y: data[valueName] })
    });
  
    return Object.values(dataMap)
  }