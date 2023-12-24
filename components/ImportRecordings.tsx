import { useState, ChangeEvent } from 'react'
import JSZip from 'jszip'
import { addRecording } from 'app/indexedDBHelper'
import { RecordingType, LoadingType } from 'types'
import { toast } from 'sonner'

interface Props {
  setLoading: (newState: LoadingType) => void
}

type JsonData = {
  recordings: RecordingType[]
}

export default function ImportRecordings({ setLoading }: Props) {
  const [selectedZip, setSelectedZip] = useState<File | undefined>(undefined)

  const handleFileChangeZip = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      console.log(file)
      setSelectedZip(file)
    } else {
      toast.warning('No files found!')
    }
  }

  const importZip = async () => {
    if (selectedZip) {
      setLoading({ isLoading: true, forceDone: false })
      toast.message('Importing...')
      console.log(selectedZip)
      const zip = await JSZip.loadAsync(selectedZip)
      let jsonData: JsonData = { recordings: [] }
      const blobs = {}

      for (const fileName in zip.files) {
        console.log('filename', fileName)
        if (fileName.endsWith('.json')) {
          const fileData = await zip.files[fileName].async('string')
          jsonData = JSON.parse(fileData)
          console.log(jsonData)
        } else {
          const fileData = await zip.files[fileName].async('blob')
          const blob = new Blob([fileData], { type: 'audio/wav' })
          blobs[fileName] = blob
        }
      }

      if (!jsonData || jsonData.recordings.length === 0) {
        toast.error('JSON file is missing or contains 0 recordings.')
        setLoading({ isLoading: false, forceDone: false })
        return
      }

      for (const item of jsonData.recordings) {
        if (item.blob && blobs[item.name]) {
          const recording = {
            ...item,
            blob: blobs[item.name],
          }
          await addRecording(recording)
        }
      }
      toast.message('Import complete!')
      setLoading({ isLoading: false, forceDone: false })
    } else {
      toast.warning('No selected Zip file!')
    }
  }

  return (
    <div>
      {/* <input type="file" multiple onChange={handleFileChange} /> */}
      {/* <button */}
      {/*   className="mb-1 mr-1 rounded bg-blue-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-blue-600" */}
      {/*   onClick={importData} */}
      {/* > */}
      {/*   Import Recordings */}
      {/* </button> */}
      <hr />
      <input type="file" onChange={handleFileChangeZip} />
      <button onClick={importZip}>IMPORT</button>
    </div>
  )
}
