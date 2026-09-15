import { useState, useRef, useEffect } from "react"

function useController() {
    const [data, setData] = useState(null)
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
            const datas = await request(info, controller.signal)
            setData(datas)
        } catch (err) {
            if(err.name !== 'AbortError')
                setErrorMessage(`Loading error: ${err}`)
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
    return {data, loading, errorMessage, loadFetch}
}

export default useController