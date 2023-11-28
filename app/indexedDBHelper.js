import { openDB } from 'idb'

const DATABASE_NAME = 'audioRecordingsDB'
const STORE_NAME = 'recordings'
const VERSION = 1

// Initialize the database
export const initDB = async () => {
  const db = await openDB(DATABASE_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'name' })
      }
    },
  })

  return db
}

export const addRecording = async (recording) => {
  const db = await initDB()
  await db.put(STORE_NAME, recording)
}

export const getAllRecordings = async () => {
  const db = await initDB()
  return db.getAll(STORE_NAME)
}

export const deleteRecording = async (name) => {
  const db = await initDB()
  await db.delete(STORE_NAME, name)
}

export const renameRecording = async (oldName, newName, blob) => {
  const db = await initDB()
  await db.delete(STORE_NAME, oldName)
  await db.put(STORE_NAME, { name: newName, blob })
}
