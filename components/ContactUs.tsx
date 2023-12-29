'use client'
import React, { useState } from 'react'

interface FormErrors {
  email?: string
  message?: string
  fullname?: string
}

export default function ContactUs() {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [buttonText, setButtonText] = useState('Send')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showFailureMessage, setShowFailureMessage] = useState(false)

  const handleValidation = () => {
    const tempErrors = {}
    let isValid = true

    if (fullname.length <= 0) {
      tempErrors['fullname'] = true
      isValid = false
    }
    if (email.length <= 0) {
      tempErrors['email'] = true
      isValid = false
    }
    if (message.length <= 0) {
      tempErrors['message'] = true
      isValid = false
    }

    setErrors({ ...tempErrors })
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isValidForm = handleValidation()

    if (isValidForm) {
      setButtonText('Sending')
      const res = await fetch('/api/sendgrid', {
        body: JSON.stringify({
          email: email,
          fullname: fullname,
          message: message,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const { error } = await res.json()

      if (error) {
        setShowSuccessMessage(false)
        setShowFailureMessage(true)
        setButtonText('Send')

        // Reset form fields
        setFullname('')
        setEmail('')
        setMessage('')
        return
      }
      setShowSuccessMessage(true)
      setShowFailureMessage(false)
      setButtonText('Send')
      // Reset form fields
      setFullname('')
      setEmail('')
      setMessage('')
    }
  }
  return (
    <main>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col rounded-lg border-2 border-gray-200 border-opacity-60 p-10 shadow-xl dark:border-gray-700 "
      >
        <h1 className="text-center text-2xl font-bold ">Get in Touch</h1>

        <label htmlFor="fullname" className="mt-8 font-light ">
          Full name<span className="text-red-500 ">*</span>
        </label>
        <input
          type="text"
          value={fullname}
          name="fullname"
          onChange={(e) => {
            setFullname(e.target.value)
          }}
          className="mb-3 block w-full rounded border border-gray-200 bg-gray-200 px-4 py-3 dark:text-black"
        />

        {errors?.fullname && <p className="text-red-500">Full name cannot be empty.</p>}

        <label htmlFor="email" className="mt-4 font-light ">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          name="email"
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          className="mb-3 block w-full rounded border border-gray-200 bg-gray-200 px-4 py-3 dark:text-black"
        />

        {errors?.email && <p className="text-red-500">Email cannot be empty.</p>}

        <label htmlFor="message" className="mt-4 font-light ">
          Message<span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
          }}
          className="mb-3 block w-full rounded border border-gray-200 bg-gray-200 px-4 py-3 dark:text-black"
        ></textarea>

        {errors?.message && <p className="text-red-500">Message cannot be empty.</p>}

        <div className="flex  flex-col items-center">
          <button
            type="submit"
            className="mt-8 flex flex-col items-center rounded-md bg-blue-500 px-10 py-2 text-lg font-bold text-white hover:bg-blue-700"
          >
            {buttonText}
          </button>
        </div>

        <div className="text-left">
          {showSuccessMessage && (
            <p className="my-2 text-sm font-semibold text-green-500">Thank you! We'll chat soon.</p>
          )}
          {showFailureMessage && (
            <p className="text-red-500">Oops! Something went wrong, please try again.</p>
          )}
        </div>
      </form>
    </main>
  )
}
