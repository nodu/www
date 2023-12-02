import { useState } from 'react'
import Modal from './Modal'
import ExportDB from 'components/ExportDB'
export default function Settings({ settings, setSettings, addSetting }) {
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  const handleSave = async (FormData) => {
    setIsOpen(false)
    const apikey = FormData.get('apikey')
    const prompt = FormData.get('prompt')
    setSettings({ ...settings, apikey, prompt })
    addSetting({ name: 'apikey', value: apikey })

    addSetting({ name: 'prompt', value: prompt })
  }
  const buttonBody = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6 dark:fill-cyan-900"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
      />
    </svg>
  )
  const body = (
    <>
      <form className="w-full max-w-lg px-4 py-3" action={handleSave}>
        <div className="-mx-3 mb-6 flex flex-wrap">
          <div className="w-full px-3">
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="grid-apikey"
            >
              API KEY:
            </label>
            <input
              className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="grid-apikey"
              type="text"
              placeholder={settings?.apikey || 'sk-...'}
              defaultValue={settings?.apikey ?? ''}
              name="apikey"
            />
            <p className="text-xs italic text-gray-600">API KEY for openai</p>
            <textarea
              className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              id="grid-prompt"
              rows={10}
              cols={50}
              placeholder={settings?.prompt || 'you are a expert ...'}
              defaultValue={settings?.prompt ?? ''}
              name="prompt"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="justify-left inline-flex rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            type="submit"
            className="justify-right inline-flex rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={closeModal}
          >
            Submit
          </button>
        </div>
      </form>
      <ExportDB />
    </>
  )

  return (
    <>
      <Modal
        openModal={openModal}
        closeModal={closeModal}
        isOpen={isOpen}
        title="Global Settings"
        body={body}
        buttonBody={buttonBody}
      />
    </>
  )
}
