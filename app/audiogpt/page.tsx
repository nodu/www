'use client'

import { genPageMetadata } from 'app/seo'

// export const metadata = genPageMetadata({ title: 'Audiogpt' })

import React, { useState, useEffect, useRef } from 'react'
import {
  addRecording,
  getAllRecordings,
  deleteRecording,
  renameRecording,
} from '../indexedDBHelper'
import AudioVisualizer from '../../components/AudioVisualizer'
import Transcribe from '../../components/Transcribe'
import Summarize from '../../components/Summarize'

interface Recording {
  blob: Blob
  name: string
}

export default function Page() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recording, setRecording] = useState(false)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const loadRecordings = async () => {
      const recordings = await getAllRecordings()
      setRecordings(recordings)
    }

    loadRecordings()
  }, [])

  const handleDeleteRecording = async (name) => {
    await deleteRecording(name)
    setRecordings(recordings.filter((recording) => recording.name !== name))
  }

  const handleSaveRecording = async () => {
    if (audioChunksRef.current.length > 0) {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
      const dateTimeStamp = new Date().toISOString().replace(/:/g, '-')
      const name = `recording-${dateTimeStamp}.wav`

      await addRecording({ name, blob })
      setRecordings((prevRecordings) => [...prevRecordings, { name, blob }])
      audioChunksRef.current = []
    } else {
      console.error('No audio data was recorded.')
      // Handle the case where no data was recorded
    }
  }

  const handleStartRecording = async () => {
    try {
      if (recording) {
        if (mediaRecorder) {
          mediaRecorder.stop()
          setAudioStream(null)
        }
        setRecording(false)
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

        const recorder = new MediaRecorder(stream)

        setAudioStream(stream) //set stream for AudioVisualizer
        setMediaRecorder(recorder)
        audioChunksRef.current = []

        recorder.ondataavailable = (event) => {
          if (typeof event.data === 'undefined') return
          if (event.data.size === 0) return

          audioChunksRef.current.push(event.data)
        }

        recorder.onstop = handleSaveRecording

        // recorder.start(1000)
        recorder.start()
        setRecording(true)
      }
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Failed to start recording. Make sure your microphone is working and accessible.')
    }
  }

  return (
    <div>
      {audioStream && <AudioVisualizer audioStream={audioStream} />}

      <button onClick={handleStartRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <div>
        {recordings.map((recording, index) => (
          <div key={index}>
            <audio controls src={URL.createObjectURL(recording.blob)}>
              <track kind="captions" />
            </audio>
            <a href={URL.createObjectURL(recording.blob)} download={recording.name}>
              Download {recording.name}
            </a>
            <div>
              <button onClick={() => handleDeleteRecording(recording.name)}>Delete</button>
              <Transcribe recording={recording} setRecording={setRecording} recordingName={recording.name} blob={recording.blob} />
              {/* TODO: just pass the data, don't do lookups inside these childen components */}
              <Summarize recordingName={recording.name} transcipt={recording.transcipt} />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
