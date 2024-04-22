// const apiUrl="http://127.0.0.1:4001/api/dashboard/"
const apiUrl = process.env.REACT_APP_API_URL
const baseApiUrl = process.env.REACT_APP_BASE_API_URL

// post data to api
export const postToApi = async (route, data, dashboard = true) => {
    const options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Basic aXBjaDIwMjI6aXBjaDIwMjI="
        },
        "body": JSON.stringify({ send: data })
    }
    const url = dashboard ? apiUrl + route : baseApiUrl + route
    let result = await fetch(url, options)
        .then(response => response.json()).then(data => data)
        .catch(err => null)
    return result

}

// get data to api
export const getToApi = async (route, dashboard = true) => {
    const options = {
        "method": "GET",
        "headers": {
            "Authorization": "Basic aXBjaDIwMjI6aXBjaDIwMjI="
        }
    }
    const url = dashboard ? apiUrl + route : baseApiUrl + route
    return await fetch(url, options)
        .then(response => response.json()).then(data => {
            if (data.error) return "error"
            // console.log("the data ", data)
            return data
        })
        .catch(err => {
            // console.log("cant get "+route+" from api")
            return
        })
}

//  return the country corresponding to a number
export const getCountry = (phone) => {
    if (phone.startsWith('+237')) return 'CMR'
    if (phone.startsWith('+221')) return 'SNG'
    if (phone.startsWith('+225')) return 'CIR'
}

// round to a specific number after decimal point
export const round = (decimal, number) => Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal)

// le taux de change de l'euro en franc cfa
export const euro = 655

// default period in wich to fetch operation

export const detectOperation = (id) => {
    switch (id[2]) {
        case 'S':
            return "Rachat Crypto"
        case 'C':
            return "Transfert"
        case 'B':
            return "Vente Crypto"
        default:
            return ""
    }
}

export const cutString = (string, nb) => {
    return string.substring(0, nb) + "..." + string.substring(string.length - nb)
}

export const randomNumber = () => {
    return Math.round(Math.random() * 100);
}
export const periods = {
    day: (+new Date) - 84000 * 1000,
    week: (+new Date) - 84000 * 7 * 1000,
    month: (+new Date) - 84000 * 30 * 1000,
    all: 10000000
}
export const defaultPeriod = periods.month