'use client'

import React, { useEffect, useRef } from 'react'

interface Props {
  audioStream: MediaStream
}

export default function AudioVisualizer({ audioStream }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  let audioContext: AudioContext | null = null
  let analyser: AnalyserNode
  let dataArray: Uint8Array
  let animationFrameId: number

  useEffect(() => {
    // Initialize AudioContext and Analyzer when component mounts
    const newAudioContext = new AudioContext()
    audioContext = newAudioContext
    analyser = newAudioContext.createAnalyser()
    analyser.fftSize = 2048
    dataArray = new Uint8Array(analyser.frequencyBinCount)

    return () => {
      // Cleanup when component unmounts
      cancelAnimationFrame(animationFrameId)
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close()
      }
    }
  })

  useEffect(() => {
    // Handle changes in audioStream
    if (audioStream && audioContext) {
      const source = audioContext.createMediaStreamSource(audioStream)
      source.connect(analyser)
      draw()
    }
  }, [audioStream])

  const draw = () => {
    if (!canvasRef.current) return

    const bufferLength = analyser.frequencyBinCount

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      console.error('Failed to get canvas context')
      return
    }

    animationFrameId = requestAnimationFrame(draw)

    analyser.getByteTimeDomainData(dataArray)

    ctx.fillStyle = 'rgb(200, 200, 200)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgb(0, 0, 0)'

    ctx.beginPath()

    const sliceWidth = (canvas.width * 1.0) / bufferLength
    let x = 0

    // for (let i = 0; i < analyser.fftSize; i++) {
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0
      const y = (v * canvas.height) / 2

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      x += sliceWidth
    }

    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()
  }

  return <canvas ref={canvasRef} width="300" height="150"></canvas>
}
