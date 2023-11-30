'use client'

import React, { useState, useEffect } from 'react'

interface Props {
  apikey: string
  transcript: string
  name: string
  setRecordings: Function
  updateRecording: Function
  summary: string
}

export default function Summarize({ apikey, transcript, name, setRecordings, updateRecording, summary }: Props) {
  const [showModal, setShowModal] = useState<Boolean>(false);

  const gptEndpoint = 'https://api.openai.com/v1/chat/completions'
  const models = {
    gpt4: "gpt-4",
    gpt4pv: "gpt-4-1106-preview",
    gpt35t: "gpt-3.5-turbo",
  }
  const temperature = null

  const prompt = `
Your task is to summarize my words while maintaining my unique style. Please provide a concise and accurate summary that captures the essence of what I have said, using language and phrasing that reflects my personal style.
Please note that your response should be flexible enough to allow for various relevant and creative summaries.You should focus on preserving the tone, voice, and personality of my original words, while still conveying the main points clearly and effectively.
Do not make up information that is not found in my words. Make sure to clean up my words by removing crutch words like um and ah.Form clearly structured text, organizing ideas so they are easily readable.
`

  // You are a great writer who writes very clearly. You write in English (US). Write simple and easy words that a 5th grader can understand. Make the writing very clear.
  // Now, here is some text. Change it to the writing style we talked about. Make it shorter too. Use paragraphs and punctuation. Just write the text.
  // Remember your writing style and follow it while editing this text. If needed, change how the text flows to make it clearer. Also add breaks and punctuation where needed to make the text easier to understand. Do your best and only send back the new text.
  // You can change the order of the words if it helps.
  // Now, shorten the text to half its length. Make sure it still makes sense and is easy to read.
  const writingStyle = ``
  const summaryLength = ``


  const handleSummary = async () => {

    // Credit https://nicheless.blog/post/audiopen-prompts
    const requestBody = {
      model: models.gpt4pv,
      temperature: temperature,
      messages: [
        {
          "role": "system",
          "content": prompt,
        },
        {
          "role": "user",
          "content": transcript,
        }
      ]
    }

    async function postData(url = "", body = {}) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apikey} `,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
      });
      return response.json();
    }

    postData(gptEndpoint, requestBody).then((response) => {
      // TODO: add error handling
      const summaryResponse = response.choices[0].message.content
      const usage = response.usage


      setRecordings((prevRecs) => prevRecs.map(rec =>
        rec.name === name ? { ...rec, summary: summaryResponse, metaData: usage } : rec
      ));

      updateRecording(name, { summary: summaryResponse })
    });
  }

  const handleSave = async (FormData) => {
    setShowModal(false)
    // const key = FormData.get("apikey")
    const whisperPrompt = FormData.get("whisperPrompt")
    // setSettings({ ...settings, apikey: key })
    // setSummary({ ...recording, whisperPrompt })
    // addSetting({ name: "apikey", value: key })
    updateRecording(name, { whisperPrompt })
  }
  return (
    <>
      <button
        className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Summary Settings
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
                        placeholder={apikey || "sk-..."}
                        defaultValue={apikey ?? ''}
                        name="apikey"
                      />
                      <p className="text-gray-600 text-xs italic">API KEY for openai</p>
                    </div>
                  </div>
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
        <button onClick={handleSummary}>{summary ? 'Re-Summaraize' : 'Summaraize'}</button>
      </div>
    </>
  )
}
