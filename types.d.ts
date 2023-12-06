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
export type FileToDownload = {
  filename: string
  blob: Blob
}

export type SettingsType = {
  apikey?: string
  prompts?: object
}

export type LoadingType = {
  isLoading: boolean
  forceDone?: boolean
}
