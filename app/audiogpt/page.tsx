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
  apikey: string
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
  const [showModal, setShowModal] = useState<Boolean>(false)
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
        let settingsObj: Settings = { apikey: null }
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

        // recorder.start(1000)
        recorder.start()
        setIsRecording(true)
      }
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Failed to start recording. Make sure your microphone is working and accessible.')
    }
  }

  const handleSave = async (FormData) => {
    setShowModal(false)
    const key = FormData.get('apikey')
    setSettings({ ...settings, apikey: key })
    addSetting({ name: 'apikey', value: key })
  }
  return (
    <>
      <button
        className="mb-1 mr-1 rounded bg-blue-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-blue-600"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Settings
      </button>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative mx-auto my-6 w-auto max-w-3xl">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid p-5">
                  <h3 className="text-3xl font-semibold text-black">Global Settings</h3>
                  <button
                    className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="block h-6 w-6 text-2xl">X</span>
                  </button>
                </div>
                {/*body*/}
                <form className="w-full max-w-lg px-4 py-3" action={handleSave}>
                  <div className="-mx-3 mb-6 flex flex-wrap">
                    <div className="w-full px-3">
                      <label
                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                        htmlFor="grid-apikey"
                      >
                        API KEY:
                      </label>
                      <input
                        className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                        id="grid-apikey"
                        type="text"
                        placeholder={settings.apikey || 'sk-...'}
                        defaultValue={settings.apikey ?? ''}
                        name="apikey"
                      />
                      <p className="text-xs italic text-gray-600">API KEY for openai</p>
                    </div>
                  </div>
                  <div className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6">
                    <button
                      className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}

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
    </>
  )
}
