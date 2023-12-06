'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  addRecording,
  addSetting,
  deleteRecording,
  getAllRecordings,
  getAllSettings,
  getRecording,
  renameRecording,
  updateRecording,
} from 'app/indexedDBHelper'

import { RecordingType, SettingsType } from 'types'
import LoadingBar from 'components/LoadingBar'

import AudioVisualizer from 'components/AudioVisualizer'
import RecordingCard from 'components/RecordingCard'
import Settings from 'components/Settings'

export default function Page() {
  const [settings, setSettings] = useState<SettingsType>()
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [recordings, setRecordings] = useState<RecordingType[]>([] as RecordingType[])
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const loadSettings = async () => {
      const settingsFromDB = await getAllSettings()
      if (settingsFromDB) {
        //TODO: fix coersion from arr to obj
        // let settingsObj: Settings = { apikey: null }
        const settingsObj: SettingsType = {}
        settingsFromDB.forEach((setting) => {
          settingsObj[setting.name] = setting.value
        })
        // TODO: move to new component
        console.log('move to new component, mount in page.tsx', settingsObj)

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
        recorder.start()
        setIsRecording(true)
      }
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Failed to start recording. Make sure your microphone is working and accessible.')
    }
  }

  return (
    <>
      <LoadingBar isLoading={isLoading} />
      {settings ? (
        <Settings
          setIsLoading={setIsLoading}
          settings={settings}
          setSettings={setSettings}
          addSetting={addSetting}
        />
      ) : null}
      <button className="rounded-full border-2 border-gray-300" onClick={handleStartRecording}>
        {/* microphone */}
        {/* {isRecording ? 'Stop Recording' : 'Start Recording'} */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
          />
        </svg>
      </button>
      {audioStream && <AudioVisualizer audioStream={audioStream} />}
      {/* <div className="columns-3 gap-8"> */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recordings.map((rec, index) => (
          <div key={index} className="">
            <RecordingCard
              settings={settings}
              handleDeleteRecording={handleDeleteRecording}
              recording={rec}
              setRecordings={setRecordings}
              updateRecording={updateRecording}
              audioStream={audioStream}
              setIsLoading={setIsLoading}
            />
          </div>
        ))}
      </div>
    </>
  )
}
