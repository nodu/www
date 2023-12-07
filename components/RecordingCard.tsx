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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const deleteButtonBody = (
    <button className="">
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
  )

  const deleteBody = (
    <div className="mt-5 flex justify-center">
      <button
        type="button"
        className="rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-800"
        onClick={() => {
          handleDeleteRecording(recording.name)
          closeDeleteModal()
        }}
      >
        Delete
      </button>
    </div>
  )
  function closeModal() {
    setIsOpen(false)
  }

  function openDeleteModal() {
    setIsDeleteOpen(true)
  }

  function closeDeleteModal() {
    setIsDeleteOpen(false)
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
  const rows: number = (() => {
    //TODO: shorten textarea height on mobile?
    let returnRows = 40
    const transcriptLength = recording.transcript ? recording.transcript.length : 0
    const summaryLength = recording.summary ? recording.summary.length : 0
    returnRows = transcriptLength > summaryLength ? transcriptLength : summaryLength
    // return returnRows / 20
    return 40
  })()

  const body = (
    <>
      <form className="text-gray-700" onSubmit={handleSave}>
        <div className="mx-auto my-0 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">Transcript</h2>
            <textarea
              className="w-full resize-y rounded-md border-2 border-gray-200 p-4"
              placeholder="Text that can be edited"
              value={recording.transcript}
              onChange={handleSave}
              name="transcript"
              onKeyDown={handleInputKeyDown}
              rows={rows}
            ></textarea>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Summary</h2>
            <textarea
              className="w-full resize-y rounded-md border-2 border-gray-200 p-4"
              placeholder="Text that can be edited"
              value={recording.summary}
              onChange={handleSave}
              name="summary"
              onKeyDown={handleInputKeyDown}
              rows={rows}
            ></textarea>
          </div>
        </div>
      </form>
    </>
  )
  return (
    <>
      <div className="rounded-lg border-2 border-gray-700 bg-white p-4 shadow shadow-gray-700 dark:bg-black dark:shadow-white">
        <div className="">
          <Modal
            title={'Delete ' + recording.name + '?'}
            openModal={openDeleteModal}
            closeModal={closeDeleteModal}
            isOpen={isDeleteOpen}
            buttonBody={deleteButtonBody}
            body={deleteBody}
            modalWidth="w-11/12 md:w-10/12"
          />
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
          modalWidth="w-11/12 md:w-10/12"
        />
        <Transcribe
          apikey={settings?.apikey}
          name={recording.name}
          setRecordings={setRecordings}
          updateRecording={updateRecording}
          blob={recording.blob}
          whisperPrompt={settings?.whisperPrompt}
          transcript={recording.transcript}
          setLoading={setLoading}
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
          setLoading={setLoading}
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
