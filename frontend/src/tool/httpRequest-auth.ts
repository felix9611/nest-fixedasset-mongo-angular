import { environment } from "../environments/environment.development"


const contentType = 'application/json;charset=UTF-8'

export const postApiWithAuth = async (url: string, data: any) => {
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', contentType)
    if (localStorage.getItem('accessToken')) {
        const accessToken = localStorage.getItem('accessToken')
        requestHeaders.append('Authorization', accessToken || '')
    }

    const finalUrl = `${environment.apiUrl}${url}`
    const rawResponse = await fetch(finalUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(data)
    })
    const content: any = await rawResponse.json()
    return content
}

export const getApiWithAuth = async (url: string) => {
    const finalUrl = `${environment.apiUrl}${url}`

    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', contentType)
    if (localStorage.getItem('accessToken')) {
        const accessToken = localStorage.getItem('accessToken')
        requestHeaders.append('Authorization', accessToken || '')
    }

    const rawResponse = await fetch(finalUrl, {
        method: 'GET',
        headers: requestHeaders
    })
    const content: any = await rawResponse.json()
    return content
}

export const deleteApiWithAuth = async (url: string) => {
    const finalUrl = `${environment.apiUrl}${url}`

    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', contentType)
    if (localStorage.getItem('accessToken')) {
        const accessToken = localStorage.getItem('accessToken')
        requestHeaders.append('Authorization', accessToken || '')
    }

    const rawResponse = await fetch(finalUrl, {
        method: 'DELETE',
        headers: requestHeaders
    })
    const content: any = await rawResponse.json()
    return content
}

export const putApiWithAuth = async (url: string, data: any) => {
    const requestHeaders = new Headers()
    requestHeaders.append('Content-Type', contentType)
    if (localStorage.getItem('accessToken')) {
        const accessToken = localStorage.getItem('accessToken')
        requestHeaders.append('Content-Type', accessToken || '')
    }

    const finalUrl = `${environment.apiUrl}${url}`
    const rawResponse = await fetch(finalUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': contentType
        },
        body: JSON.stringify(data)
    })
    const content: any = await rawResponse.json()
    return content
}