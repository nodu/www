'use client'

import { RecordingType, RecordingUpdate } from 'types'

interface Props {
  apikey?: string
  prompts?: { default: string; colorful?: string }
  transcript?: string
  name: string
  setRecordings: React.Dispatch<React.SetStateAction<RecordingType[]>> // either allow function or RecordingType[], or use:
  // setRecordings: (recordings: RecordingType[]) => void // And calculate the return arr first and pass into setRecordings
  updateRecording: (name: string, update: RecordingUpdate) => void
  summary?: string
}

export default function Summarize({
  apikey,
  prompts,
  transcript,
  name,
  setRecordings,
  updateRecording,
  summary,
}: Props) {
  const gptEndpoint = 'https://api.openai.com/v1/chat/completions'
  const models = {
    gpt4: 'gpt-4',
    gpt4pv: 'gpt-4-1106-preview',
    gpt35t: 'gpt-3.5-turbo',
  }
  const temperature = null

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
          content: prompts?.default,
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

  return (
    <>
      <div>
        <button className="mb-2" onClick={handleSummary}>
          {summary ? 'Re-Summaraize' : 'Summaraize'}
        </button>
      </div>
    </>
  )
}
