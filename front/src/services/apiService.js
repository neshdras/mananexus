

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

const getResponseErrorMessage = async (response) => {
    const data = await response.json().catch(() => ({}))
    const validationMessages = Array.isArray(data.invalidParams)
        ? data.invalidParams.map(param => param.message)
        .filter(Boolean)
        : []

    return data.detail
        || (validationMessages.length ? validationMessages.join(' ') : null)
        || `Erreur HTTP : ${response.status}`
}

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
        async logout() {
            const req = await fetch(`${BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })

            if (!req.ok) {
                throw new Error(`Error HTTP: ${req.status}`)
            }
        },
        async session() {
            const req = await apiRequest('/auth/me')
            if (req.status === 401) return null
            if (!req.ok) throw new Error(`Error HTTP: ${req.status}`)
            const data = await req.json()
            return data.user
        },
        async login(info, signal){
            const {identifiant, password} = info
                const req = await fetch(`${BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers : {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({identifiant, password}),
                    credentials: 'include',
                    signal,
            })
    
            if(!req.ok)
                throw new Error(await getResponseErrorMessage(req))
            
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
                    credentials: 'include',
                    signal
            })
            if(!req.ok)
                throw new Error(await getResponseErrorMessage(req))
            
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
                    credentials: 'include',
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
                    credentials: 'include',
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
            const data = await req.json().catch(() => ({}))
            if(!req.ok) {
                const detail = data.invalidParams?.[0]?.message ?? data.detail
                throw new Error(detail || `Error HTTP: ${req.status}`)
            }

            return data
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
    deck: {
        async create(info, signal) {
            const { gameId, name, format, url } = info
            const req = await apiRequest(`/deck/adddeck/${gameId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, format, url }),
                signal,
            })

            const data = await req.json().catch(() => ({}))
            if (!req.ok) {
                const detail = data.invalidParams?.[0]?.message ?? data.detail
                throw new Error(detail || `Error HTTP: ${req.status}`)
            }
            if (!data.deck)
                throw new Error('Réponse invalide du serveur')
            return data.deck
        },
        async profile(userId, signal) {
            const req = await apiRequest(`/deck/profile/${userId}`, { signal })
            if (!req.ok)
                throw new Error(`Error HTTP: ${req.status}`)

            const data = await req.json()
            if (!Array.isArray(data.decks))
                throw new Error('Réponse invalide du serveur')
            return data
        }
    },
    game: {
        async seeAll(_info, signal) {
            const req = await apiRequest('/game/seeAll', { signal })
            if (!req.ok)
                throw new Error(`Error HTTP: ${req.status}`)

            const data = await req.json()
            if (!Array.isArray(data.games))
                throw new Error('Réponse invalide du serveur')
            return data
        }
    },
    tournament: {
        async seeAll(_info, signal){
            const req = await apiRequest('/tournament/seeAll',{
                signal
            })
            if(!req.ok)
                throw new Error(`Error HTTP: ${req.status}`);
                

            const data = await req.json()
            if (!Array.isArray(data.tournaments))
                throw new Error('Réponse invalide du serveur')
            return data
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
            const data = await req.json().catch(() => ({}))
            if(!req.ok) {
                const detail = data.invalidParams?.[0]?.message ?? data.detail
                throw new Error(detail || `Error HTTP: ${req.status}`)
            }

            return data
        },
        async update(info, signal){
            const { name, format, date, price, paf, location, id} = info
            const req = await apiRequest(`/tournament/update/${id}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({name, format, date, price, paf, location}),
                signal
            })
            const data = await req.json().catch(() => ({}))
            if(!req.ok) {
                const detail = data.invalidParams?.[0]?.message ?? data.detail
                throw new Error(detail || `Error HTTP: ${req.status}`)
            }

            return data
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
