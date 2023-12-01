import { openDB } from 'idb'

const DATABASE_NAME = 'AudioGptDB'
const AUDIO_STORE_NAME = 'recordings'
const SETTINGS_STORE_NAME = 'settings'
const VERSION = 1

// Initialize the database
export const initDB = async () => {
  const db = await openDB(DATABASE_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(AUDIO_STORE_NAME)) {
        db.createObjectStore(AUDIO_STORE_NAME, { keyPath: 'name' })
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE_NAME)) {
        db.createObjectStore(SETTINGS_STORE_NAME, { keyPath: 'name' })
      }
    },
  })

  return db
}

export const addRecording = async (recording) => {
  const db = await initDB()
  await db.put(AUDIO_STORE_NAME, recording)
}

export const getRecording = async (name) => {
  const db = await initDB()
  return db.get(AUDIO_STORE_NAME, name)
}

export const getAllRecordings = async () => {
  const db = await initDB()
  return db.getAll(AUDIO_STORE_NAME)
}

export const deleteRecording = async (name) => {
  const db = await initDB()
  await db.delete(AUDIO_STORE_NAME, name)
}

export const renameRecording = async (oldName, newName, blob) => {
  const db = await initDB()
  await db.delete(AUDIO_STORE_NAME, oldName)
  await db.put(AUDIO_STORE_NAME, { name: newName, blob })
}

export const addSetting = async (setting) => {
  const db = await initDB()
  await db.put(SETTINGS_STORE_NAME, setting)
}

export const getAllSettings = async () => {
  const db = await initDB()
  return db.getAll(SETTINGS_STORE_NAME)
}

export const updateRecording = async (name, updates) => {
  const db = await initDB()
  const recording = await db.get(AUDIO_STORE_NAME, name)
  const updatedRecording = { ...recording, ...updates }
  await db.put(AUDIO_STORE_NAME, updatedRecording)
}
