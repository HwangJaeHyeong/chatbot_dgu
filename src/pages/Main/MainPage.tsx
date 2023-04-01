/* eslint-disable no-undef */
import { baseURL } from 'api/base'
import { FC, useEffect, useRef, useState } from 'react'
import RecordRTC, { StereoAudioRecorder } from 'recordrtc'
import { Root } from './styled'

type MainPageProps = {
  className?: string
}

export const MainPage: FC<MainPageProps> = ({ className }) => {
  const [stream, setStream] = useState<any>(null)
  const [blob, setBlob] = useState<any>(null)
  const refVideo = useRef<any>(null)
  const recorderRef = useRef<any>(null)

  const handleRecording = async () => {
    const cameraStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })

    const options: any = {
      recorderType: StereoAudioRecorder,
      mimeType: 'audio/wav',
      video: false,
      audio: true,
    }
    setStream(cameraStream)
    recorderRef.current = new RecordRTC(cameraStream, options)
    recorderRef.current.startRecording()
  }

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob())
    })
  }

  const handleSave = () => {}

  useEffect(() => {
    if (!refVideo.current) {
      return
    }

    // refVideo.current.srcObject = stream;
  }, [stream, refVideo])

  useEffect(() => {
    if (blob) {
      // eslint-disable-next-line no-undef
      var formdata = new FormData()
      formdata.append('language', 'Korean')
      formdata.append('file', blob, '[PROXY]')

      var requestOptions: any = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      }

      // eslint-disable-next-line no-undef
      fetch(`${baseURL}/asr/asr`, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error))
    }
  }, [blob])

  return (
    <Root className={className}>
      <button onClick={handleRecording}>start</button>
      <button onClick={handleStop}>stop</button>
      <button onClick={handleSave}>save</button>
      {blob && (
        <audio
          src={URL.createObjectURL(blob)}
          controls
          autoPlay
          ref={refVideo}
          style={{ width: '700px', margin: '1em' }}
        />
      )}
    </Root>
  )
}
