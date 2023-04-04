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
  const [dialog, setDialog] = useState<string[]>([])
  const [response, setResponse] = useState<string>('')
  const [ttsAudio, setTtsAudio] = useState<any>()
  const [inputValue, setInputValue] = useState<string>('')
  const refVideo = useRef<any>(null)
  const recorderRef = useRef<any>(null)

  const handleRecording = async () => {
    const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })

    const options: any = {
      recorderType: StereoAudioRecorder,
      mimeType: 'audio/wav',
      video: false,
      audio: true,
    }
    setStream(audioStream)
    recorderRef.current = new RecordRTC(audioStream, options)
    recorderRef.current.startRecording()
  }

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob())
    })
  }

  const onClickResetButton = () => {
    setDialog([])
  }

  useEffect(() => {
    if (!refVideo.current) {
      return
    }
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
        .then((response) => {
          response.text().then((res) => {
            let text = JSON.parse(res)[0].transcription
            setDialog((prev) => [...prev, text])

            var myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json')

            var raw = JSON.stringify({
              input: text,
              dialog,
            })

            var requestOptions: any = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow',
            }

            fetch(`${baseURL}/chat1/chat`, requestOptions)
              .then((response) =>
                response.text().then((res2) => {
                  let text2 = JSON.parse(res2).output
                  setResponse(text2)
                  setDialog((prev) => [...prev, text2])

                  var myHeaders = new Headers()
                  myHeaders.append('Content-Type', 'application/json')

                  var raw = JSON.stringify({
                    text: text2,
                    speaker: '0',
                  })

                  var requestOptions: any = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow',
                  }

                  fetch(`${baseURL}/tts/tts`, requestOptions)
                    .then((response) => {
                      response.text().then((res) => {
                        const blob = new Blob([res])
                        const url = URL.createObjectURL(blob)
                        const file = new File([blob], 'test.wav')
                        console.log({ file })
                        setTtsAudio(url)
                      })
                    })
                    .then((result) => console.log(result))
                    .catch((error) => console.log('error', error))
                })
              )
              .then((result) => console.log(result))
              .catch((error) => console.log('error', error))
          })
        })
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error))
    }
  }, [blob])

  const onClickSubmit = () => {
    let text = inputValue
    setDialog((prev) => [...prev, text])

    var myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    var raw = JSON.stringify({
      input: text,
      dialog,
    })

    var requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(`${baseURL}/chat1/chat`, requestOptions)
      .then((response) =>
        response.text().then((res2) => {
          let text2 = JSON.parse(res2).output
          setResponse(text2)
          setDialog((prev) => [...prev, text2])

          var myHeaders = new Headers()
          myHeaders.append('Content-Type', 'application/json')

          var raw = JSON.stringify({
            text: text2,
            speaker: '0',
          })

          var requestOptions: any = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
          }

          fetch(`${baseURL}/tts/tts`, requestOptions)
            .then(async (response) => {
              const audioBlob = await response.blob()
              const url = URL.createObjectURL(audioBlob)
              setTtsAudio(url)
            })
            .then((result) => console.log(result))
            .catch((error) => console.log('error', error))
        })
      )
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
  }

  return (
    <Root className={className}>
      <div>
        <button onClick={handleRecording}>start</button>
        <button onClick={handleStop}>stop</button>
        <button onClick={onClickResetButton}>reset</button>
      </div>
      <div>
        <input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          onKeyDown={(e) => e.key === 'Enter' && onClickSubmit()}
        />
        <button onClick={onClickSubmit}>submit</button>
      </div>
      <p>{response}</p>
      {ttsAudio && <audio src={ttsAudio} controls autoPlay />}
    </Root>
  )
}
