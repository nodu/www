import { useState, useRef, useEffect } from 'react'
interface Props {
  isRecording: boolean
}
export default function Timer({ isRecording }: Props) {
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | number | null>(null)

  useEffect(() => {
    if (isRecording) {
      startTimer()
    } else {
      stopTimer()
      setSecondsElapsed(0)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording])

  const startTimer = () => {
    if (!intervalRef.current) {
      setSecondsElapsed((prevSeconds) => prevSeconds + 1)

      intervalRef.current = setInterval(() => {
        setSecondsElapsed((prevSeconds) => prevSeconds + 1)
      }, 1000)
    }
  }
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (totalSeconds % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  return <>{isRecording ? formatTime(secondsElapsed) : null}</>
}
