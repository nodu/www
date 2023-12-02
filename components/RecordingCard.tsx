import Summarize from 'components/Summarize'
import Transcribe from 'components/Transcribe'

export default function RecordingCard({
  recording,
  handleDeleteRecording,
  settings,
  setRecordings,
  updateRecording,
}) {
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="waveform-placeholder mb-6"></div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col rounded-lg bg-white p-4 shadow">
            <div className="mb-4 flex items-center justify-between">
              <button className="flex h-10 w-10 items-center justify-center ">
                {/* play recording */}
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
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                  />
                </svg>
              </button>
              <button className="h-8 w-8">
                {/* close/delete */}
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

            <div className="waveform-placeholder mb-4"></div>

            <audio controls src={URL.createObjectURL(recording.blob)}>
              <track kind="captions" />
            </audio>
            <a href={URL.createObjectURL(recording.blob)} download={recording.name}>
              Download {recording.name}
            </a>

            <button onClick={() => handleDeleteRecording(recording.name)}>Delete</button>
            {recording.transcript && (
              <p className="mb-2 text-gray-700">Transcript: {recording.transcript}</p>
            )}
            {recording.summary && (
              <p className="mb-2 text-gray-700">Summary: {recording.summary}</p>
            )}

            <Transcribe
              apikey={settings?.apikey}
              name={recording.name}
              setRecordings={setRecordings}
              updateRecording={updateRecording}
              blob={recording.blob}
              whisperPrompt={recording.whisperPrompt}
              transcript={recording.transcript}
            />

            {/* TODO: just pass the data, don't do lookups inside these childen components */}
            <Summarize
              apikey={settings?.apikey}
              name={recording.name}
              setRecordings={setRecordings}
              updateRecording={updateRecording}
              transcript={recording.transcript}
              summary={recording.summary}
            />
            <div className="mt-auto pt-2">
              <div className="flex justify-between">
                <button className="h-8 w-8">
                  {/* Local Settings */}
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
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <button className="h-8 w-8">
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="m-4 rounded-lg bg-white p-6 shadow-lg"> */}
      {/*   <div className="responsive-layout space-x-4"> */}
      {/*     <div className="flex-1"> */}
      {/*       <div className="flex items-start justify-between"> */}
      {/*         <h2 className="text-xl font-semibold text-gray-900">Transcript</h2> */}
      {/*         <span className="modal-close text-xl font-semibold text-gray-500">&times;</span> */}
      {/*       </div> */}
      {/*       <textarea */}
      {/*         className="mt-2 h-40 w-full resize-none rounded-md border-2 border-gray-200 p-4" */}
      {/*         placeholder="Text that can be edited" */}
      {/*       ></textarea> */}
      {/*     </div> */}
      {/**/}
      {/*     <div className="flex-1"> */}
      {/*       <div className="flex items-start justify-between"> */}
      {/*         <h2 className="text-xl font-semibold text-gray-900">Summary</h2> */}
      {/*         <span className="modal-close text-xl font-semibold text-gray-500">&times;</span> */}
      {/*       </div> */}
      {/*       <textarea */}
      {/*         className="mt-2 h-40 w-full resize-none rounded-md border-2 border-gray-200 p-4" */}
      {/*         placeholder="Text that can be edited" */}
      {/*       ></textarea> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}
    </>
  )
}
