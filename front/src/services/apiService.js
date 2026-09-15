// const browserUrl = window.location.href
// const isLocalHost = browserUrl.includes('localgost')

// const BASE_URL = isLocalHost
//     ? 'http://localhost:3000/api/v1/'
//     :  ''

const BASE_URL = 'http://localhost:3000/api/v1'

export const apiService = {
    auth: {
        async login(info, signal){
            const {identifiant, password} = info
                const req = await fetch(`${BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({identifiant, password}),
                    signal
            })
    
            if(!req.ok)
                throw new Error(`Error HTTP: ${req.status}`)
            
            return await req.json()
        },
        async register(info, signal){
            const {firstname, lastname, email, password, pseudo} = info
                const req = await fetch(`${BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({firstname, lastname, email, password, pseudo}),
                    signal
            })
    
            if(!req.ok)
                throw new Error(`Error HTTP: ${req.status}`)
            
            return await req.json()
        },
        async sendTokenBd(info, signal){
            const {email} = info
                const req = await fetch(`${BASE_URL}/auth/send`, {
                    method: 'POST',
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email}),
                    signal
            })
    
            if(!req.ok)
                throw new Error(`Error HTTP: ${req.status}`)
            
            return await req.json()
        },
        async resetPass(info, signal){
            const {password, token} = info
                const req = await fetch(`${BASE_URL}/auth/reset/${token}`, {
                    method: 'POST',
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({password}),
                    signal
            })
    
            if(!req.ok)
                throw new Error(`Error HTTP: ${req.status}`)
            
            return await req.json()
        },

    }
}