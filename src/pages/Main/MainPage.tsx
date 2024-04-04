/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { Radio } from 'antd'
import { baseURL } from 'api/base'
import Main1Img from 'constants/images/main_1.png'
import Main2Img from 'constants/images/main_2.png'
import Main3Img from 'constants/images/main_3.png'
import Main4Img from 'constants/images/main_4.png'
import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RecordRTC, { StereoAudioRecorder } from 'recordrtc'
import {
  Container,
  HeaderButtonContainer,
  MainImg,
  RadioContainer,
  RadioRowContainer,
  RadioRowTypo,
  RadioSubmitButton,
  RadioSubmitButtonWrapper,
  RadioTitleTypo,
  ResetButton,
  Root,
  WaitingTtsProgress,
} from './styled'

type MainPageProps = {
  className?: string
}

type StatusType = 'WAITING' | 'LISTEN' | 'WAITING_TTS' | 'TELL'

export const MainPage: FC<MainPageProps> = ({ className }) => {
  const [genderType, setGenderType] = useState<'0' | '1'>('0')
  const [chatbotType, setChatbotType] = useState<'0' | '1'>('0')
  const [blob, setBlob] = useState<any>(null)
  const [dialog, setDialog] = useState<string>('')
  const [ttsAudio, setTtsAudio] = useState<any>()
  const [inputValue, setInputValue] = useState<string>('')
  const [status, setStatus] = useState<StatusType>('WAITING')
  const recorderRef = useRef<any>(null)
  const navigate = useNavigate()

  const onClickNavigateToListenButton = () => {
    navigate('/listen')
  }

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
    handleStatus('WAITING_TTS')()
  }

  const onClickResetButton = () => {
    setDialog('')
    setGenderType('0')
    setChatbotType('0')
    handleStatus('WAITING')()
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
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json')

            // var raw =
            //   chatbotType === '0'
            //     ? JSON.stringify({
            //         input: text,
            //         dialog,
            //       })
            //     : JSON.stringify({
            //         input: text,
            //         agent_state: {
            //           history: dialog,
            //           ontology_flow_num: -1,
            //           abnormal_flag: 0,
            //         },
            //       })

            var raw = JSON.stringify({
              input: text,
              history: dialog,
            })
            var requestOptions: any = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow',
            }

            fetch(`${baseURL}/chat/chat`, requestOptions)
              .then((response) =>
                response.text().then((res2) => {
                  let text2 = chatbotType === '0' ? JSON.parse(res2).output : JSON.parse(res2).response

                  setDialog(() => JSON.parse(res2).dialog)

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
                      const audioElement = new Audio(url)
                      audioElement.play()
                      handleStatus('WAITING')()
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

  const mainImgSrc = (() => {
    if (status === 'WAITING_TTS') {
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
        {/* {status !== 'INIT' && genderType && chatbotType && (
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
        )} */}
        <HeaderButtonContainer>
          <ResetButton onClick={onClickNavigateToListenButton}>계속 듣기</ResetButton>
          <ResetButton onClick={onClickResetButton}>초기화</ResetButton>
        </HeaderButtonContainer>
        <MainImg src={mainImgSrc} />
        <RadioContainer>
          <RadioSubmitButtonWrapper>
            {status === 'WAITING' && <RadioSubmitButton onClick={handleRecording}>말하기</RadioSubmitButton>}
            {status === 'LISTEN' && <RadioSubmitButton onClick={handleStop}>듣기</RadioSubmitButton>}
            {status === 'WAITING_TTS' && <WaitingTtsProgress tip="Loading" />}
          </RadioSubmitButtonWrapper>
          <RadioTitleTypo>챗봇의 타입을 선택해주세요.</RadioTitleTypo>
          <RadioRowContainer onClick={() => setChatbotType('0')}>
            <RadioRowTypo>노인 케어 챗봇</RadioRowTypo>
            <Radio name="chatbotTypeRadio" checked={chatbotType === '0'} />
          </RadioRowContainer>
          <RadioRowContainer onClick={() => setChatbotType('1')}>
            <RadioRowTypo>공황장애 환자 케어 챗봇</RadioRowTypo>
            <Radio name="chatbotTypeRadio" checked={chatbotType === '1'} />
          </RadioRowContainer>
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
      </Container>
    </Root>
  )
}
