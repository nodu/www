export type RecordingType = {
  name: string
  blob: Blob
  transcript?: string
  summary?: string
  whisperPrompt?: string
  metaData?: object
}

export type RecordingUpdate = {
  transcript?: string
  summary?: string
  whisperPrompt?: string
  metaData?: object
}
