'use client'

import { RecordingType, RecordingUpdate, LoadingType } from 'types'
import { toast } from 'sonner'
import { useEffect } from 'react'
interface Props {
  apikey?: string
  blob: Blob
  name: string
  transcript?: string
  whisperPrompt?: string
  setRecordings: React.Dispatch<React.SetStateAction<RecordingType[]>> // either allow function or RecordingType[], or use:
  // setRecordings: (recordings: RecordingType[]) => void // And calculate the return arr first and pass into setRecordings
  updateRecording: (name: string, update: RecordingUpdate) => void
  setLoading: (newState: LoadingType) => void
}

export default function Transcribe({
  apikey,
  blob,
  setRecordings,
  updateRecording,
  name,
  whisperPrompt,
  transcript,
  setLoading,
}: Props) {
  const whisperApiEndpoint = 'https://api.openai.com/v1/audio/'
  const mode = 'transcriptions'
  const response_format = 'json'
  const model = 'whisper-1'

  useEffect(() => {
    if (blob && !transcript) {
      handleTranscribe()
    }
  }, [])

  const handleTranscribe = async () => {
    setLoading({ isLoading: true, forceDone: false })
    const formBody = new FormData()
    formBody.append('file', blob)
    formBody.append('model', model)
    if (mode === 'transcriptions') {
      formBody.append('language', 'en')
    }
    if (whisperPrompt) {
      formBody.append('whisperPrompt', whisperPrompt)
    }
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
      setLoading({ isLoading: false, forceDone: false })

      if (response.error) {
        toast.error(response.error.message)
      } else {
        const transcribedText: string = response.text

        setRecordings((prevRecs: RecordingType[]): RecordingType[] =>
          prevRecs.map((rec: RecordingType) =>
            rec.name === name
              ? {
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

  return (
    <>
      <div>
        <button className="mb-2" disabled={!blob} onClick={handleTranscribe}>
          {transcript ? 'Re-Transcribe' : 'Transcibe'}
        </button>
      </div>
    </>
  )
}
