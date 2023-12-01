'use client'

import React, { useEffect, useRef, useState } from 'react'
import { exportDB } from '../app/indexedDBHelper'
import { FileToDownload } from '../types'

export default function Export() {
  const downloadFile = (content, filename, contentType) => {
    const href = URL.createObjectURL(new Blob([content], { type: contentType }))
    const link = document.createElement('a')
    link.href = href
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(href)
  }

  const handleExport = async () => {
    try {
      const data = await exportDB()

      const filesToDownload: FileToDownload[] = []

      const modifiedData = data.recordings.map((item, index) => {
        if (item.blob && item.blob instanceof Blob) {
          const filename = item.name
          filesToDownload.push({ filename, blob: item.blob })
          return { ...item, blob: filename }
        }
        return item
      })
      const exportObject = { settings: data.settings, recordings: modifiedData }

      const jsonData = JSON.stringify(exportObject, null, 2)

      // Download JSON file
      downloadFile(jsonData, 'audiogpt_export.json', 'application/json')

      // Download each blob as a separate file
      filesToDownload.forEach((file) => {
        downloadFile(file.blob, file.filename, file.blob.type)
      })
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  return (
    <>
      <button
        className="mb-1 mr-1 rounded bg-blue-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-blue-600"
        type="button"
        onClick={() => handleExport()}
      >
        Export All Data
      </button>
    </>
  )
}
