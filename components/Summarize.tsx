'use client'

import React, { useEffect, useState } from 'react'

import { RecordingType, RecordingUpdate } from '../types'

interface Props {
  apikey?: string
  transcript?: string
  name: string
  setRecordings: React.Dispatch<React.SetStateAction<RecordingType[]>> // either allow function or RecordingType[], or use:
  // setRecordings: (recordings: RecordingType[]) => void // And calculate the return arr first and pass into setRecordings
  updateRecording: (name: string, update: RecordingUpdate) => void
  summary?: string
}

export default function Summarize({
  apikey,
  transcript,
  name,
  setRecordings,
  updateRecording,
  summary,
}: Props) {
  const [showModal, setShowModal] = useState<boolean>(false)

  const gptEndpoint = 'https://api.openai.com/v1/chat/completions'
  const models = {
    gpt4: 'gpt-4',
    gpt4pv: 'gpt-4-1106-preview',
    gpt35t: 'gpt-3.5-turbo',
  }
  const temperature = null

  const prompt = `
Your task is to summarize my words while maintaining my unique style.
Please provide a concise and accurate summary that captures the essence of what I have said, using language and phrasing that reflects my personal style.
Please note that your response should be flexible enough to allow for various relevant and creative summaries.
You should focus on preserving the tone, voice, and personality of my original words, while still conveying the main points clearly and effectively.
Do not make up information that is not found in my words.
Make sure to clean up my words by removing crutch words like um and ah.
Form clearly structured text, organizing ideas so they are easily readable.
Do your best and only send back the new text.
`
  const prompt2 = `
You are a great writer who writes very clearly.
Your task is to summarize the input text while maintaining the unique style.
You write in English (US).
Write simple and easy words that a 5th grader can understand.
Make the writing very clear.
If needed, change how the text flows to make it clearer.
You can change the order of the words if it helps.
Use paragraphs and punctuation where needed to make the text easier to understand.
Do your best and only send back the new text.
Do not make up information that is not found in the input text.
Make sure to clean up the text by removing crutch words like um and ah.
Now, here is the input text:
`
  // Change it to the writing style we talked about.
  // Make it shorter too.
  // Remember your writing style and follow it while editing this text.
  // Now, shorten the text to half its length. Make sure it still makes sense and is easy to read.
  //
  const writingStyle = ``
  const summaryLength = ``

  const handleSummary = async () => {
    // Credit https://nicheless.blog/post/audiopen-prompts
    const requestBody = {
      model: models.gpt4pv,
      temperature: temperature,
      messages: [
        {
          role: 'system',
          content: prompt2,
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
    }

    async function postData(url = '', body = {}) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apikey} `,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      return response.json()
    }

    postData(gptEndpoint, requestBody).then((response) => {
      if (response.error) {
        console.log(response.error)
        alert(response.error)
      } else {
        const summaryResponse = response.choices[0].message.content
        const usage = response.usage
        setRecordings((prevRecs) =>
          prevRecs.map((rec) =>
            rec.name === name
              ? {
                  ...rec,
                  summary: summaryResponse,
                  metaData: usage,
                }
              : rec
          )
        )
        updateRecording(name, { summary: summaryResponse })
      }
    })
  }

  const handleSave = async (FormData) => {
    setShowModal(false)
  }
  return (
    <>
      <button
        className="mb-1 mr-1 rounded bg-blue-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-blue-600"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Summary Settings
      </button>
      {showModal ? (
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
                  {/* <div className="flex flex-wrap -mx-3 mb-6"> */}
                  {/*   <div className="w-full px-3"> */}
                  {/*     <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-whisperPrompt"> */}
                  {/*       whisperPrompt */}
                  {/*     </label> */}
                  {/*     <input */}
                  {/*       className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" */}
                  {/*       id="grid-whisperPrompt" */}
                  {/*       type="text" */}
                  {/*       placeholder={whisperPrompt || "..."} */}
                  {/*       defaultValue={whisperPrompt ?? ''} */}
                  {/*       name="whisperPrompt" */}
                  {/*     /> */}
                  {/*     <p className="text-gray-600 text-xs italic">whisperPrompt (Proper nouns, punctuation examples, etc)</p> */}
                  {/*   </div> */}
                  {/* </div> */}

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
      <div>
        <button onClick={handleSummary}>{summary ? 'Re-Summaraize' : 'Summaraize'}</button>
      </div>
    </>
  )
}
