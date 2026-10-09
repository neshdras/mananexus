// const browserUrl = window.location.href
// const isLocalHost = browserUrl.includes('localgost') 

// const BASE_URL = isLocalHost
//     ? 'http://localhost:3000/api/v1/'
//     :  ''

const BASE_URL = 'http://localhost:3000/api/v1'
const apiRequest = async (url, options = {}, retry = false)=>{
    const req = await fetch(`${BASE_URL}${url}`, {
        ...options,
        credentials: 'include'
    })
    if (req.status !== 401 || retry) {
        return req
    }
    const refreshReq = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: "include"
    })
    if(!refreshReq.ok)
        return req

    return apiRequest(url, options, true)
}
export const apiService = {
    auth: {
        async login(info, signal){
            const {identifiant, password} = info
                const req = await apiRequest(`/auth/login`, {
                    method: 'POST',
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({identifiant, password}),
                    signal,
            })
    
            if(!req.ok)
                throw new Error(`Error HTTP: ${req.status}`)
            
            return await req.json()
        },
        async register(info, signal){
            const {firstname, lastname, email, password, pseudo} = info
                const req = await apiRequest(`/auth/register`, {
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
                const req = await apiRequest(`/auth/send`, {
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
                const req = await apiRequest(`/auth/reset/${token}`, {
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
        }
    },
    user: {
        async profile(info, signal){
            const req = await apiRequest(`/user/profile/${info}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal
            })
            if(!req.ok)
                throw new Error(`Error HTTP: ${req.status}`);
            
            return await req.json()
                
        },
        async update(info, signal){
            const {firstname, lastname, email, password, pseudo} = info
            const req = await apiRequest('/user/update',{
                method: 'PATCH',
                headers : {
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify({firstname, lastname, email, password, pseudo}),
                signal
            })
            if(!req.ok)
                throw new Error(`Error HTTP : ${req.status}`);
            
            return await req.json()
        },
        async ranking(signal){
            const req = await apiRequest('/user/ranking', {
                signal
            })
            if(!req.ok)
                throw new Error(`Error HTTP: ${req.status}`);
                
            return req.json()
        }
    },
    tournament: {
        async seeAll(signal){
            const req = await apiRequest('/tournament/seeAll',{
                signal
            })
            if(!req.ok)
                throw new Error(`Error HTTP: ${req.status}`);
                

            return req.json()
        },
        async create(info, signal){
            const { name, format, date, price, paf, location} = info
            const req = await apiRequest('/tournament/create',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({name, format, date, price, paf, location}),
                signal
            })
            if(!req.info)
                throw new Error(`Error HTTP: ${req.status}`);
            
            return req.json()
        },
        async update(info, signal){
            const { name, format, date, price, paf, location, id} = info
            const req = await apiRequest(`/tournament/create/${id}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({name, format, date, price, paf, location}),
                signal
            })
            if(!req.info)
                throw new Error(`Error HTTP: ${req.status}`);
            
            return req.json()
        },
        async addPlayer(info, signal){
            const req = await apiRequest(`/tournament/join/${info}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal
            })
            if(!req.ok)
                throw new Error(`Error HTTP : ${req.status}`);
                
            return req.json()
        },
        async delPlayer(info, signal){
            const req = await apiRequest(`/tournament/join/${info}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal
            })
            if(!req.ok)
                throw new Error(`Error HTTP : ${req.status}`);
                
            return req.json()
        },
        async seePlayer(info, signal){
            const req = await apiRequest(`/tournament/${info}/players`, {
                signal,
                method: 'GET'
            })
            if(!req.ok)
                throw new Error(`Error HTTP : ${req.status}`);
                
            return req.json()
        }
    }
}