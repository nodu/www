'use client'

import { genPageMetadata } from 'app/seo'

// export const metadata = genPageMetadata({ title: 'Audiogpt' })

import React, { useState } from 'react'

export default function Page() {
  // Initialize mediaRecorder with the correct type
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([])
  const [recording, setRecording] = useState(false)

  const handleStartRecording = async () => {
    try {
      if (recording) {
        // Check if mediaRecorder is not null
        if (mediaRecorder) {
          mediaRecorder.stop()
        }
        setRecording(false)
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        setMediaRecorder(recorder)

        recorder.ondataavailable = (event) => {
          setAudioChunks((currentChunks) => [...currentChunks, event.data])
        }

        recorder.onstop = handleSaveRecording

        recorder.start()
        setRecording(true)
      }
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Failed to start recording. Make sure your microphone is working and accessible.')
    }
  }

  const handleSaveRecording = () => {
    const blob = new Blob(audioChunks, { type: 'audio/wav' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url

    const dateTimeStamp = new Date().toISOString().replace(/:/g, '-')
    a.download = `recording-${dateTimeStamp}.wav`
    a.click()

    URL.revokeObjectURL(url)
    setAudioChunks([])
  }

  return (
    <div>
      <button onClick={handleStartRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  )
}
