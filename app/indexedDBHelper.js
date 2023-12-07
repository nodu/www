import { openDB } from 'idb'
//TODO: use dexie instead: https://github.com/dexie/Dexie.js
//TODO: Add backup/restore: https://github.com/Polarisation/indexeddb-export-import
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
        const settingsDB = db.createObjectStore(SETTINGS_STORE_NAME, { keyPath: 'name' })
        const prompt = {
          name: 'prompts',
          value: {
            default: `You are a great writer who writes very clearly.
Your task is to summarize text while maintaining its unique style.
You write in English (US).
Make the writing very clear.
If needed, change how the text flows to make it clearer.
You can change the order of the words if it helps.
Use paragraphs and punctuation where needed to make the text easier to understand.
Do your best and only send back the new text.
Do not make up information that is not found in the my text.
Make sure to clean up the text by removing crutch words like um and ah.
Now, here is my text:`,
            //             colorful: `Your task is to summarize my words while maintaining my unique style.
            // Please provide a concise and accurate summary that captures the essence of what I have said, using language and phrasing that reflects my personal style.
            // Please note that your response should be flexible enough to allow for various relevant and creative summaries.
            // You should focus on preserving the tone, voice, and personality of my original words, while still conveying the main points clearly and effectively.
            // Do not make up information that is not found in my words.
            // Make sure to clean up my words by removing crutch words like um and ah.
            // Form clearly structured text, organizing ideas so they are easily readable.
            // Do your best and only send back the new text.`,
          },
        }

        // Change it to the writing style we talked about.
        // Make it shorter too.
        // Remember your writing style and follow it while editing this text.
        // Now, shorten the text to half its length. Make sure it still makes sense and is easy to read.
        //
        settingsDB.put(prompt)
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

export const exportDB = async () => {
  return {
    settings: await getAllSettings(),
    recordings: await getAllRecordings(),
  }
}
