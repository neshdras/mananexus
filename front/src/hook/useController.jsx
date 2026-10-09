import { useState, useRef, useEffect } from "react"

function useController() {
    
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const controllerRef = useRef(null)
    const loadFetch = async (request, info) => {
        setErrorMessage(null)
        if(controllerRef.current)
            controllerRef.current.abort()

        controllerRef.current = new AbortController()
        const controller = controllerRef.current
        try {
            setLoading(true)

            return await request(info, controller.signal)
        } catch (err) {
            console.error("USE CONTROLLER - erreur:", err)
            if(err.name !== 'AbortError')
                setErrorMessage(`Loading error: ${err}`)
            throw err
        } finally{
            if(!controller.signal.aborted && controller === controllerRef.current)
                setLoading(false)
        }
    }
    
    useEffect(()=>{
        return ()=>{
            if(controllerRef.current)
                controllerRef.current.abort()
        }
    }, [])
    return {loading, errorMessage, loadFetch}
}

export default useController