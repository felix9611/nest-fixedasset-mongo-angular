import { environment } from '../environments/environment.development'

const contentType = 'application/json;charset=UTF-8'

const accessToken = localStorage.getItem('token') || ''


const requestHeaders: HeadersInit = new Headers()
requestHeaders.set('Content-Type', contentType)
if (accessToken) {
    requestHeaders.set('authorization', accessToken)
}


export const postApi = async (url: string, data: any) => {
    const finalUrl = `${environment.apiUrl}${url}`
    const rawResponse = await fetch(finalUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(data)
    })
    const content: any = await rawResponse.json()
    return content
}

export const getApi = async (url: string) => {
    const finalUrl = `${environment.apiUrl}${url}`
    const rawResponse = await fetch(finalUrl, {
        method: 'GET',
        headers: requestHeaders,
    })
    const content: any = await rawResponse.json()
    return content
}

export const deleteApi = async (url: string, data: any) => {
    const finalUrl = `${environment.apiUrl}${url}`
    const rawResponse = await fetch(finalUrl, {
        method: 'DELETE',
        headers: requestHeaders,
    })
    const content: any = await rawResponse.json()
    return content
}

export const putApi = async (url: string, data: any) => {
    const finalUrl = `${environment.apiUrl}${url}`
    const rawResponse = await fetch(finalUrl, {
        method: 'PUT',
        headers: requestHeaders,
        body: JSON.stringify(data)
    })
    const content: any = await rawResponse.json()
    return content
}