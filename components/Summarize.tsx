'use client'

import { RecordingType, RecordingUpdate } from 'types'

interface Props {
  apikey?: string
  prompt?: string
  transcript?: string
  name: string
  setRecordings: React.Dispatch<React.SetStateAction<RecordingType[]>> // either allow function or RecordingType[], or use:
  // setRecordings: (recordings: RecordingType[]) => void // And calculate the return arr first and pass into setRecordings
  updateRecording: (name: string, update: RecordingUpdate) => void
  summary?: string
}

export default function Summarize({
  apikey,
  prompt,
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

  //   const prompt = `
  // Your task is to summarize my words while maintaining my unique style.
  // Please provide a concise and accurate summary that captures the essence of what I have said, using language and phrasing that reflects my personal style.
  // Please note that your response should be flexible enough to allow for various relevant and creative summaries.
  // You should focus on preserving the tone, voice, and personality of my original words, while still conveying the main points clearly and effectively.
  // Do not make up information that is not found in my words.
  // Make sure to clean up my words by removing crutch words like um and ah.
  // Form clearly structured text, organizing ideas so they are easily readable.
  // Do your best and only send back the new text.
  // `
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
          content: prompt,
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
