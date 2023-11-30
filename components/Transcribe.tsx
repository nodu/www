'use client'

import React, { useState, useEffect } from 'react'
import {
  addSetting,
  getRecording,
  getAllSettings,
  updateRecording,
} from '../app/indexedDBHelper'

interface Props {
  recording: Object;
  setRecording: Function;
  recordingName: string;
  blob: Blob;
}

interface Settings {
  apikey: string | null;
}

export default function Transcribe({ recording, setRecording, recordingName, blob }: Props) {
  const [settings, setSettings] = useState<Settings>({ apikey: null })
  // const [recording, setRecording] = useState({ name: null, blob: null, transcript: null, whisperPrompt: null });
  const [showModal, setShowModal] = useState<Boolean>(false);

  const whisperApiEndpoint = 'https://api.openai.com/v1/audio/'
  const mode = 'transcriptions'
  const response_format = 'json'

  useEffect(() => {
    // TODO: bug causing multiple renders
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

    const loadRecording = async () => {
      try {
        const recording = await getRecording(recordingName);
        if (recording) {
          // console.log('rec rec rec', recording)
          // console.log('script script', recording.transcript)
          setRecording(recording)
        }
      } catch (error) {
        console.error('Error fetching recording:', error);
      }
    };

    loadSettings()
    loadRecording()
  }, [])

  const handleTranscribe = async () => {
    const formBody = new FormData()
    formBody.append('file', blob)
    formBody.append('model', 'whisper-1')
    if (mode === 'transcriptions') {
      formBody.append('language', 'en')
    }
    if (recording.whisperPrompt) {
      formBody.append('whisperPrompt', recording.whisperPrompt)
    }
    if (response_format) {
      formBody.append('response_format', response_format)
    }
    // if (temperature) {
    //   body.append('temperature', `${temperature}`)
    // }

    async function postData(url = "", body = new FormData) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          // "Content-Type": 'multipart/form-data',
          "Authorization": `Bearer ${settings.apikey}`,
        },
        body: body,
      });
      return response.json();
    }

    postData(whisperApiEndpoint + mode, formBody).then((response) => {
      const transcribedText = response.text
      setRecording({ ...recording, transcript: transcribedText });
      // Update the IndexedDB entry with the new transcript
      updateRecording(recordingName, { transcript: transcribedText })
    });
  }
  const handleSave = async (FormData) => {
    console.log(".........", settings)
    setShowModal(false)
    const key = FormData.get("apikey")
    const whisperPrompt = FormData.get("whisperPrompt")
    setSettings({ ...settings, apikey: key })
    setRecording({ ...recording, whisperPrompt })
    addSetting({ name: "apikey", value: key })
    updateRecording(recordingName, { whisperPrompt })
  }
  return (
    <>
      <button
        className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Tx Settings
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
                    Transcription Settings
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
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-whisperPrompt">
                        whisper Prompt
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-whisperPrompt"
                        type="text"
                        placeholder={recording.whisperPrompt || "..."}
                        defaultValue={recording.whisperPrompt ?? ''}
                        name="whisperPrompt"
                      />
                      <p className="text-gray-600 text-xs italic">whisperPrompt (Proper nouns, punctuation examples, etc)</p>
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
      <div>
        <button disabled={!recording.blob} onClick={handleTranscribe}>{recording.transcript ? 'Re-Transcribe' : 'Transcibe'}</button>
        {recording && <p>{recording.transcript}</p>}
      </div>
    </>
  )
}
