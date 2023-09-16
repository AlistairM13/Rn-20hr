import { useEffect, useState } from "react"

export default function useCountdown() {
    const [secondsLeft, setSecondsLeft] = useState(0)

    useEffect(() => {
        if (secondsLeft <= 0) return
        const timeOut = setTimeout(() => {
            setSecondsLeft(secondsLeft - 1)
        }, 1000)
        return () => clearTimeout(timeOut)
    }, [secondsLeft])

    function start(seconds) {
        setSecondsLeft(seconds)
    }

    return { secondsLeft, start }
}