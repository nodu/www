import { exportDB } from '../app/indexedDBHelper'
import { LoadingType, FileToDownload } from '../types'
import JSZip from 'jszip'
import { toast } from 'sonner'

interface Props {
  setLoading: (newState: LoadingType) => void
}

export default function Export({ setLoading }: Props) {
  const handleExportZip = async () => {
    setLoading({ isLoading: true, forceDone: false })
    toast.message('Eporting...')

    const zip = new JSZip()
    const filesToDownload: FileToDownload[] = []
    const data = await exportDB()

    const modifiedData = data.recordings.map((item, index) => {
      if (item.blob) {
        const filename = item.name
        filesToDownload.push({ filename, blob: item.blob })
        return { ...item, blob: filename }
      }
      return item
    })
    const exportObject = {
      recordingCount: modifiedData.length,
      settings: data.settings,
      recordings: modifiedData,
    }

    // Add JSON object to the zip
    zip.file('audiogpt_export.json', JSON.stringify(exportObject, null, 2))

    // Add blob files to the zip
    filesToDownload.forEach((blob) => {
      zip.file(blob.filename, blob.blob)
    })

    zip.generateAsync({ type: 'blob' }).then((content) => {
      // Create and trigger a download link
      const url = window.URL.createObjectURL(content)
      const tempLink = document.createElement('a')
      const dateTimeStamp = new Date().toISOString().replace(/:/g, '-')
      tempLink.download = dateTimeStamp + 'audiogpt_export.zip'
      tempLink.href = url
      document.body.appendChild(tempLink)
      tempLink.click()
      document.body.removeChild(tempLink)
      window.URL.revokeObjectURL(url)
      toast.message('Export Finished!')
      setLoading({ isLoading: false, forceDone: false })
    })
  }

  return (
    <>
      <button
        className="mb-1 mr-1 rounded bg-blue-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-blue-600"
        type="button"
        onClick={() => handleExportZip()}
      >
        Export All Data
      </button>
    </>
  )
}
