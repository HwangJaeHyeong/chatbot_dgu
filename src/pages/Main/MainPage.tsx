/* eslint-disable no-undef */
import { Radio } from 'antd'
import { baseURL } from 'api/base'
import Main1Img from 'constants/images/main_1.png'
import Main2Img from 'constants/images/main_2.png'
import Main3Img from 'constants/images/main_3.png'
import Main4Img from 'constants/images/main_4.png'
import { FC, useEffect, useRef, useState } from 'react'
import RecordRTC, { StereoAudioRecorder } from 'recordrtc'
import {
  Container,
  MainImg,
  RadioContainer,
  RadioRowContainer,
  RadioRowTypo,
  RadioSubmitButton,
  RadioTitleTypo,
  Root,
} from './styled'

type MainPageProps = {
  className?: string
}

type StatusType = 'INIT' | 'WAITING' | 'LISTEN' | 'TELL'

export const MainPage: FC<MainPageProps> = ({ className }) => {
  const [genderType, setGenderType] = useState<'0' | '1' | null>(null)
  const [chatbotType, setChatbotType] = useState<'0' | '1' | null>(null)
  const [blob, setBlob] = useState<any>(null)
  const [dialog, setDialog] = useState<string[]>([])
  const [response, setResponse] = useState<string>('')
  const [ttsAudio, setTtsAudio] = useState<any>()
  const [inputValue, setInputValue] = useState<string>('')
  const [status, setStatus] = useState<StatusType>('INIT')
  const recorderRef = useRef<any>(null)

  const handleStatus = (type: StatusType) => () => {
    setStatus(type)
  }

  const handleRecording = async () => {
    handleStatus('LISTEN')()
    const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    const options: any = {
      recorderType: StereoAudioRecorder,
      mimeType: 'audio/wav',
      video: false,
      audio: true,
    }
    recorderRef.current = new RecordRTC(audioStream, options)
    recorderRef.current.startRecording()
  }

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob())
    })
    handleStatus('WAITING')()
  }

  const onClickResetButton = () => {
    setDialog([])
    setGenderType(null)
    setChatbotType(null)
    handleStatus('INIT')()
  }

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
                    speaker: genderType,
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
            speaker: genderType,
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

  const mainImgSrc = (() => {
    if (status === 'INIT') {
      return Main1Img
    }
    if (status === 'WAITING') {
      return Main2Img
    }
    if (status === 'LISTEN') {
      return Main3Img
    }
    if (status === 'TELL') {
      return Main4Img
    }
  })()

  return (
    <Root className={className}>
      <Container>
        {status === 'INIT' && (
          <>
            <RadioContainer>
              <RadioTitleTypo>챗봇의 타입을 선택해주세요.</RadioTitleTypo>
              <RadioRowContainer onClick={() => setChatbotType('0')}>
                <RadioRowTypo>타입 1</RadioRowTypo>
                <Radio name="chatbotTypeRadio" checked={chatbotType === '0'} />
              </RadioRowContainer>
              <RadioRowContainer onClick={() => setChatbotType('1')}>
                <RadioRowTypo>타입 2</RadioRowTypo>
                <Radio name="chatbotTypeRadio" checked={chatbotType === '1'} />
              </RadioRowContainer>
            </RadioContainer>
            <RadioContainer>
              <RadioTitleTypo>챗봇의 성별을 선택해주세요.</RadioTitleTypo>
              <RadioRowContainer onClick={() => setGenderType('0')}>
                <RadioRowTypo>남성</RadioRowTypo>
                <Radio name="genderTypeRadio" checked={genderType === '0'} />
              </RadioRowContainer>
              <RadioRowContainer onClick={() => setGenderType('1')}>
                <RadioRowTypo>여성</RadioRowTypo>
                <Radio name="genderTypeRadio" checked={genderType === '1'} />
              </RadioRowContainer>
            </RadioContainer>
            {genderType && chatbotType && (
              <RadioSubmitButton type="primary" onClick={handleStatus('WAITING')}>
                제출
              </RadioSubmitButton>
            )}
          </>
        )}
        {status !== 'INIT' && genderType && chatbotType && (
          <div>
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
          </div>
        )}
        <MainImg src={mainImgSrc} />
      </Container>
    </Root>
  )
}
