import React, { useState, useEffect } from 'react'
import { openDB } from 'idb'

const WebRTCComponent = () => {
  const [localConnection, setLocalConnection] = useState(null)
  const [remoteConnection, setRemoteConnection] = useState(null)
  const [localOffer, setLocalOffer] = useState(null)
  const [remoteOffer, setRemoteOffer] = useState(null)
  const [dbData, setDbData] = useState(null)
  const [remoteDbData, setRemoteDbData] = useState(null)

  useEffect(() => {
    // Initialize the local connection and create an offer
    const connection = new RTCPeerConnection()
    setLocalConnection(connection)

    // Handle local ICE candidates
    connection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send this to the remote peer through your manual signaling method
        console.log('New ICE candidate: ', event.candidate)
      }
    }

    // Handle remote track
    connection.ontrack = (event) => {
      // Use the received tracks
    }

    // Create a data channel
    const dataChannel = connection.createDataChannel('dbChannel')
    dataChannel.onmessage = (event) => {
      setRemoteDbData(JSON.parse(event.data))
      console.log('Received IndexedDB data from peer: ', event.data)
    }

    // Create an offer to start the process
    connection.createOffer().then((offer) => {
      connection.setLocalDescription(offer)
      setLocalOffer(offer)
      // Show the offer to the user to manually send to the remote peer
      console.log('Local Offer: ', offer)
    })
  }, [])

  // Function to start the connection based on the remote offer
  const startConnection = async (remoteOffer) => {
    const remoteDesc = new RTCSessionDescription(remoteOffer)
    await localConnection.setRemoteDescription(remoteDesc)

    // Create an answer
    const answer = await localConnection.createAnswer()
    await localConnection.setLocalDescription(answer)

    // Send the answer to the remote peer via your manual signaling method
    console.log('Local Answer: ', answer)
  }

  // Load IndexedDB data
  useEffect(() => {
    const loadDbData = async () => {
      const db = await openDB('myDatabase', 1)
      const tx = db.transaction('myObjectStore', 'readonly')
      const store = tx.objectStore('myObjectStore')
      const allData = await store.getAll()
      setDbData(allData)
      db.close()
    }
    loadDbData()
  }, [])

  // Handle merging of data when the user confirms
  const mergeDatabases = async () => {
    // Assume a simple merge strategy where we take the union of both datasets
    const combinedData = [...dbData, ...remoteDbData]
    // You would need a more complex merge strategy for real applications

    const db = await openDB('myDatabase', 1)
    const tx = db.transaction('myObjectStore', 'readwrite')
    const store = tx.objectStore('myObjectStore')

    for (const item of combinedData) {
      await store.put(item) // 'put' updates or inserts new
    }
    await tx.done
    db.close()
  }

  return (
    <div>
      <div>
        <h2>Local Offer</h2>
        <textarea value={JSON.stringify(localOffer, null, 2)} readOnly />
        <button onClick={() => navigator.clipboard.writeText(JSON.stringify(localOffer))}>
          Copy Offer to Clipboard
        </button>
      </div>
      <div>
        <h2>Remote Offer</h2>
        <textarea
          onChange={(e) => setRemoteOffer(JSON.parse(e.target.value))}
          placeholder="Paste Remote Offer Here"
        />
        <button onClick={() => startConnection(remoteOffer)}>Start Connection</button>
      </div>
      {remoteDbData && (
        <div>
          <h2>Remote IndexedDB Data</h2>
          <div>{JSON.stringify(remoteDbData)}</div>
          <button onClick={mergeDatabases}>Merge Databases</button>
        </div>
      )}
    </div>
  )
}

export default WebRTCComponent
