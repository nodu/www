import Summarize from 'components/Summarize'
import Transcribe from 'components/Transcribe'
import React, { useState } from 'react'
import Modal from './Modal'

export default function RecordingCard({
  recording,
  handleDeleteRecording,
  settings,
  setRecordings,
  updateRecording,
  setLoading,
  audioStream,
}) {
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    console.log(event.target.name)

    const { name, value } = event.target
    setRecordings(
      (prevRecs) =>
        prevRecs.map((rec) =>
          rec.name === recording.name
            ? {
                ...rec,
                [name]: value,
              }
            : rec
        ),
      setLoading({ isLoading: false, forceDone: true })
    )
    updateRecording(recording.name, { [name]: value })
  }
  const buttonBody = (
    <>
      {recording.transcript && (
        <p className="mb-2">Transcript: {recording.transcript.substring(0, 100)}...</p>
      )}
      {recording.summary && (
        <p className="mb-2">Summary: {recording.summary.substring(0, 100)}...</p>
      )}
    </>
  )

  const handleInputKeyDown = async (event) => {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
      event.preventDefault()
    }
  }

  const body = (
    <>
      <div className="flex flex-wrap">
        <form className="w-full px-4 py-3" onSubmit={handleSave}>
          <div className="rounded-lg bg-white p-6 text-gray-900 shadow-lg">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold">Transcript</h2>
                </div>
                <textarea
                  className="mt-2 h-40 w-full resize-none rounded-md border-2 border-gray-200 p-4"
                  placeholder="Text that can be edited"
                  value={recording.transcript}
                  onChange={handleSave}
                  name="transcript"
                  onKeyDown={handleInputKeyDown}
                ></textarea>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold">Summary</h2>
                </div>
                <textarea
                  className="mt-2 h-40 w-full resize-none rounded-md border-2 border-gray-200 p-4"
                  placeholder="Text that can be edited"
                  value={recording.summary}
                  onChange={handleSave}
                  name="summary"
                  onKeyDown={handleInputKeyDown}
                ></textarea>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
  return (
    <>
      <div className="rounded-lg bg-white p-4 shadow dark:bg-black">
        <div className="">
          {/* <button className="flex h-10 w-10 items-center justify-center "> */}
          {/*   <svg */}
          {/*     xmlns="http://www.w3.org/2000/svg" */}
          {/*     fill="none" */}
          {/*     viewBox="0 0 24 24" */}
          {/*     strokeWidth={1.5} */}
          {/*     stroke="currentColor" */}
          {/*     className="h-6 w-6" */}
          {/*   > */}
          {/*     <path */}
          {/*       strokeLinecap="round" */}
          {/*       strokeLinejoin="round" */}
          {/*       d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" */}
          {/*     /> */}
          {/*     <path */}
          {/*       strokeLinecap="round" */}
          {/*       strokeLinejoin="round" */}
          {/*       d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" */}
          {/*     /> */}
          {/*   </svg> */}
          {/* </button> */}

          <button className="" onClick={() => handleDeleteRecording(recording.name)}>
            {/* Delete */}
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
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
        <audio controls src={URL.createObjectURL(recording.blob)}>
          <track kind="captions" />
        </audio>
        <Modal
          title=""
          openModal={openModal}
          closeModal={closeModal}
          isOpen={isOpen}
          buttonBody={buttonBody}
          body={body}
        />
        <Transcribe
          apikey={settings?.apikey}
          name={recording.name}
          setRecordings={setRecordings}
          updateRecording={updateRecording}
          blob={recording.blob}
          whisperPrompt={settings?.whisperPrompt}
          transcript={recording.transcript}
        />
        {/* TODO: just pass the data, don't do lookups inside these childen components */}
        {/* TODO: Maybe do lookups inside the components with prop name, likely more performant with large recordings */}
        <Summarize
          apikey={settings?.apikey}
          prompts={settings.prompts}
          name={recording.name}
          setRecordings={setRecordings}
          updateRecording={updateRecording}
          transcript={recording.transcript}
          summary={recording.summary}
        />
        <div className="flex justify-between">
          <button className="">
            <a href={URL.createObjectURL(recording.blob)} download={recording.name}>
              {/* Download {recording.name} */}
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
                  d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                />
              </svg>
            </a>
          </button>
        </div>
      </div>
    </>
  )
}
