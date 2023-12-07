import { useState } from 'react'
import Modal from './Modal'
import ExportDB from 'components/ExportDB'

export default function Settings({ setLoading, settings, setSettings, addSetting }) {
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    const { name, value } = event.target
    const [key, subkey] = name.split('.')
    if (subkey) {
      // Nested object
      setSettings(
        (prevSettings) => ({
          ...prevSettings,
          [key]: {
            ...prevSettings[key],
            [subkey]: value,
          },
        }),
        setLoading({ isLoading: false, forceDone: true })
      )
    } else {
      // Root level key
      setSettings(
        (prevSettings) => ({
          ...prevSettings,
          [key]: value,
        }),
        setLoading({ isLoading: false, forceDone: true })
      )
    }

    Object.keys(settings).forEach((key) => {
      addSetting({ name: key, value: settings[key] })
    })
  }

  const handleInputKeyDown = async (event) => {
    if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
      event.preventDefault()
    }
  }

  const buttonBody = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-10 w-10 dark:fill-cyan-900"
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
      <form className="mt-5 text-gray-700" onSubmit={handleSubmit}>
        <div className="flex flex-wrap">
          <label className="mb-2 text-xs font-bold uppercase" htmlFor="id-apikey">
            API KEY:
          </label>
          <input
            className="mb-2 w-full rounded border border-gray-200 bg-gray-200 focus:border-gray-500 focus:bg-white focus:outline-none"
            id="id-apikey"
            type="text"
            placeholder={settings?.apikey || 'sk-...'}
            defaultValue={settings?.apikey ?? ''}
            name="apikey"
            onChange={handleSubmit}
            onKeyDown={handleInputKeyDown}
          />
          <p className="mb-8 text-xs italic">API KEY for openai</p>

          <label className="mb-2 w-full text-xs font-bold uppercase" htmlFor="id-whisperPrompt">
            whisper Prompt
          </label>
          <input
            className="mb-2 w-full rounded border border-gray-200 bg-gray-200 focus:border-gray-500 focus:bg-white focus:outline-none"
            id="id-whisperPrompt"
            type="text"
            onChange={handleSubmit}
            placeholder={settings.whisperPrompt || '...'}
            defaultValue={settings.whisperPrompt ?? ''}
            name="whisperPrompt"
            onKeyDown={handleInputKeyDown}
          />
          <p className="mb-8 text-xs italic">
            whisperPrompt (Proper nouns, punctuation examples, etc)
          </p>

          <>
            {Object.keys(settings.prompts).map((key, index) => (
              <div key={index}>
                <label className="mb-2 text-xs font-bold uppercase" htmlFor={'id-' + key}>
                  Prompt: {key}
                </label>
                <textarea
                  className="mb-2 w-full rounded border border-gray-200 bg-gray-200 focus:border-gray-500 focus:bg-white focus:outline-none"
                  id={'id=' + key}
                  rows={20}
                  cols={50}
                  placeholder={settings.prompts[key] || 'you are a expert ...'}
                  defaultValue={settings.prompts[key] ?? ''}
                  name={'prompts.' + key}
                  onChange={handleSubmit}
                  onKeyDown={handleInputKeyDown}
                />
              </div>
            ))}
          </>
        </div>
      </form>
      <ExportDB />
    </>
  )

  return (
    <>
      {settings && (
        <Modal
          openModal={openModal}
          closeModal={closeModal}
          isOpen={isOpen}
          title="Global Settings"
          body={body}
          buttonBody={buttonBody}
          modalWidth="w-3/4 md:w-2/3 lg:w-2/4"
        />
      )}
    </>
  )
}
