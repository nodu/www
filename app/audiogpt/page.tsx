'use client'

// import { genPageMetadata } from 'app/seo'
// export const metadata = genPageMetadata({ title: 'Audiogpt' })

import React, { useState, useEffect, useRef } from 'react'
import {
  addSetting,
  getAllSettings,
  getRecording,
  addRecording,
  getAllRecordings,
  deleteRecording,
  updateRecording,
  renameRecording,
} from '../indexedDBHelper'

interface Settings {
  apikey: string;
}

interface Recording {
  name: string
  blob: Blob | null
  transcript: string | null
  summary: string | null
  whisperPrompt: string | null
  metaData: JSON | null
}

import AudioVisualizer from '../../components/AudioVisualizer'
import Transcribe from '../../components/Transcribe'
import Summarize from '../../components/Summarize'

export default function Page() {
  const [settings, setSettings] = useState<Settings>()
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState<Boolean>(false)
  const [recording, setRecording] = useState<Recording>()
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const loadSettings = async () => {
      const settingsFromDB = await getAllSettings()
      if (settingsFromDB) {
        //TODO: fix coersion from arr to obj
        let settingsObj: Settings = { apikey: null };
        settingsFromDB.forEach(setting => {
          settingsObj[setting.name] = setting.value
        });
        // TODO: move to new component
        console.log("move to new component, mount in page.tsx", settingsObj)

        setSettings(settingsObj)
      }
    }

    const loadRecordings = async () => {
      const recordings = await getAllRecordings()
      setRecordings(recordings)
    }

    loadSettings()
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
      if (isRecording) {
        if (mediaRecorder) {
          mediaRecorder.stop()
          setAudioStream(null)
        }
        setIsRecording(false)
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
        setIsRecording(true)
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
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <div>
        {recordings.map((rec, index) => (
          <div key={index}>
            <audio controls src={URL.createObjectURL(rec.blob)}>
              <track kind="captions" />
            </audio>
            <a href={URL.createObjectURL(rec.blob)} download={rec.name}>
              Download {rec.name}
            </a>
            <div>
              <button onClick={() => handleDeleteRecording(rec.name)}>Delete</button>
              <Transcribe
                apikey={settings.apikey}
                name={rec.name}
                setRecordings={setRecordings}
                updateRecording={updateRecording}
                blob={rec.blob}
                whisperPrompt={rec.whisperPrompt}
                transcript={rec.transcript}
              />

              {/* TODO: just pass the data, don't do lookups inside these childen components */}
              <Summarize
                apikey={settings.apikey}
                name={rec.name}
                setRecordings={setRecordings}
                updateRecording={updateRecording}
                transcript={rec.transcript}
                summary={rec.summary}
              />
              {rec.transcript && <p>{rec.transcript}</p>}
              {rec.summary && <p>{rec.summary}</p>}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
