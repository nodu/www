'use client'

import {
  addRecording,
  addSetting,
  deleteRecording,
  getAllRecordings,
  getAllSettings,
  updateRecording,
} from 'app/indexedDBHelper'
import { useEffect, useRef, useState } from 'react'

import LoadingBar from 'components/LoadingBar'
import { LoadingType, RecordingType, SettingsType } from 'types'

import AudioVisualizer from 'components/AudioVisualizer'
import RecordingCard from 'components/RecordingCard'
import Settings from 'components/Settings'
import Timer from 'components/Timer'

export default function Page() {
  const [settings, setSettings] = useState<SettingsType>()
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)

  const [loading, setLoading] = useState<LoadingType>({ isLoading: false, forceDone: false })

  const [recordings, setRecordings] = useState<RecordingType[]>([] as RecordingType[])
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const loadSettings = async () => {
      const settingsFromDB = await getAllSettings()
      if (settingsFromDB) {
        const settingsObj: SettingsType = {}
        settingsFromDB.forEach((setting) => {
          settingsObj[setting.name] = setting.value
        })

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
      <LoadingBar loading={loading} />
      {settings ? (
        <Settings
          setLoading={setLoading}
          settings={settings}
          setSettings={setSettings}
          addSetting={addSetting}
        />
      ) : null}

      <div className="mb-5 flex justify-center ">
        <div className=" h-48 w-60 rounded-lg border-2 border-gray-700 shadow shadow-gray-700 dark:shadow-white">
          <div className="mt-2 flex justify-center">
            <button
              className="rounded-full border-2 border-gray-300"
              onClick={handleStartRecording}
            >
              {/* microphone */}
              {!isRecording ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-12 w-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-12 w-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="mt-2 flex justify-center">
            <Timer isRecording={isRecording} />
          </div>
          <div className="mt-12 flex justify-center">
            {audioStream && <AudioVisualizer audioStream={audioStream} />}
          </div>
        </div>
      </div>
      {/* <div className="columns-3 gap-8"> */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recordings
          .sort((a, b) => {
            const regex = /\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}.\d{3}Z/
            const matchA = a.name.match(regex)
            const dateTimeA = matchA ? matchA[0] : ''
            const matchB = b.name.match(regex)
            const dateTimeB = matchB ? matchB[0] : ''
            return dateTimeB.localeCompare(dateTimeA)
          })
          .map((rec, index) => (
            <div key={index} className="">
              <RecordingCard
                settings={settings}
                handleDeleteRecording={handleDeleteRecording}
                recording={rec}
                setRecordings={setRecordings}
                updateRecording={updateRecording}
                audioStream={audioStream}
                setLoading={setLoading}
              />
            </div>
          ))}
      </div>
    </>
  )
}
