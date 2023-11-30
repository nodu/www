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
  const [showModal, setShowModal] = useState<Boolean>(false);
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

  const handleSave = async (FormData) => {
    setShowModal(false)
    const key = FormData.get("apikey")
    setSettings({ ...settings, apikey: key })
    addSetting({ name: "apikey", value: key })
  }
  return (
    <>
      <button
        className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Settings
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold text-black">
                    Global Settings
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="h-6 w-6 text-2xl block">
                      X
                    </span>
                  </button>
                </div>
                {/*body*/}
                <form className="py-3 px-4 w-full max-w-lg" action={handleSave}>
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-apikey">
                        API KEY:
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-apikey"
                        type="text"
                        placeholder={settings.apikey || "sk-..."}
                        defaultValue={settings.apikey ?? ''}
                        name="apikey"
                      />
                      <p className="text-gray-600 text-xs italic">API KEY for openai</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null
      }

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
