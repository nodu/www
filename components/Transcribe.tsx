'use client'

import React, { useEffect, useState } from 'react'

import { RecordingType, RecordingUpdate } from '../types'

interface Props {
  apikey?: string
  blob: Blob
  name: string
  transcript?: string
  whisperPrompt?: string
  setRecordings: React.Dispatch<React.SetStateAction<RecordingType[]>> // either allow function or RecordingType[], or use:
  // setRecordings: (recordings: RecordingType[]) => void // And calculate the return arr first and pass into setRecordings
  updateRecording: (name: string, update: RecordingUpdate) => void
}

export default function Transcribe({
  apikey,
  blob,
  setRecordings,
  updateRecording,
  name,
  transcript,
  whisperPrompt,
}: Props) {
  const [showModal, setShowModal] = useState<boolean>(false)

  const whisperApiEndpoint = 'https://api.openai.com/v1/audio/'
  const mode = 'transcriptions'
  const response_format = 'json'
  const model = 'whisper-1'

  const handleTranscribe = async () => {
    const formBody = new FormData()
    formBody.append('file', blob)
    formBody.append('model', model)
    if (mode === 'transcriptions') {
      formBody.append('language', 'en')
    }
    // if (recording.whisperPrompt) {
    //   formBody.append('whisperPrompt', recording.whisperPrompt)
    // }
    if (response_format) {
      formBody.append('response_format', response_format)
    }
    // if (temperature) {
    //   body.append('temperature', `${temperature}`)
    // }

    async function postData(url = '', body = new FormData()) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apikey}`,
        },
        body: body,
      })
      return response.json()
    }

    postData(whisperApiEndpoint + mode, formBody).then((response) => {
      if (response.error) {
        console.log(response.error)
      } else {
        const transcribedText: string = response.text

        setRecordings((prevRecs: RecordingType[]): RecordingType[] =>
          prevRecs.map((rec: RecordingType) =>
            rec.name === name ?
              {
                ...rec,
                transcript: transcribedText,
              }
            : rec
          )
        )
        updateRecording(name, { transcript: transcribedText })
      }
    })
  }
  const handleSave = async (FormData) => {
    setShowModal(false)
    const whisperPrompt = FormData.get('whisperPrompt')
    setRecordings((prevRecs) =>
      prevRecs.map((rec) =>
        rec.name === name ?
          {
            ...rec,
            whisperPrompt,
          }
        : rec
      )
    )
  }

  return (
    <>
      <button
        className="mb-1 mr-1 rounded bg-blue-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-blue-600"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Tx Settings
      </button>
      {showModal ?
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative mx-auto my-6 w-auto max-w-3xl">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="border-blueGray-200 flex items-start justify-between rounded-t border-b border-solid p-5">
                  <h3 className="text-3xl font-semibold text-black">Transcription Settings</h3>
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
                        htmlFor="grid-whisperPrompt"
                      >
                        whisper Prompt
                      </label>
                      <input
                        className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                        id="grid-whisperPrompt"
                        type="text"
                        placeholder={whisperPrompt || '...'}
                        defaultValue={whisperPrompt ?? ''}
                        name="whisperPrompt"
                      />
                      <p className="text-xs italic text-gray-600">
                        whisperPrompt (Proper nouns, punctuation examples, etc)
                      </p>
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
      : null}
      <div>
        <button disabled={!blob} onClick={handleTranscribe}>
          {transcript ? 'Re-Transcribe' : 'Transcibe'}
        </button>
      </div>
    </>
  )
}
