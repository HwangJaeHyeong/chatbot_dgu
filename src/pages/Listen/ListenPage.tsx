/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { Radio } from 'antd'
import { baseURL } from 'api/base'
import Main1Img from 'constants/images/main_1.png'
import Main2Img from 'constants/images/main_2.png'
import Main3Img from 'constants/images/main_3.png'
import Main4Img from 'constants/images/main_4.png'
import { HeaderButtonContainer } from 'pages/Main/styled'
import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import {
  Container,
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

type ListenPageProps = {
  className?: string
}

type StatusType = 'WAITING' | 'LISTEN' | 'WAITING_TTS' | 'TELL'

export const ListenPage: FC<ListenPageProps> = ({ className }) => {
  const [genderType, setGenderType] = useState<'0' | '1'>('0')
  const [chatbotType, setChatbotType] = useState<'0' | '1'>('0')
  const [dialog, setDialog] = useState<string>('')
  const [ttsAudio, setTtsAudio] = useState<any>()
  const [inputValue, setInputValue] = useState<string>('')
  const [status, setStatus] = useState<StatusType>('WAITING')
  const recorderRef = useRef<any>(null)
  const navigate = useNavigate()

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()

  const onClickNavigateToMainButton = () => {
    navigate('/')
  }

  const handleStatus = (type: StatusType) => () => {
    setStatus(type)
  }

  const handleRecording = () => {
    SpeechRecognition?.startListening({ language: 'ko' })
    handleStatus('LISTEN')()
  }

  const handleStop = () => {
    SpeechRecognition?.stopListening()
    handleStatus('WAITING')()
  }

  const onClickResetButton = () => {
    setDialog('')
    setGenderType('0')
    setChatbotType('0')
    handleStatus('WAITING')()
  }

  useEffect(() => {
    if (transcript !== '' && !listening) {
      handleStatus('WAITING_TTS')()
      let text = transcript

      var myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

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

      fetch(`${baseURL}/chat/chat`, requestOptions).then((response) =>
        response.text().then((res2) => {
          let text2 = chatbotType === '0' ? JSON.parse(res2).output : JSON.parse(res2).response

          setDialog((prev) => JSON.parse(res2).dialog)

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
              resetTranscript()
              SpeechRecognition?.startListening({ language: 'ko' })
              handleStatus('LISTEN')()
            })
            .then((result) => console.log(result))
            .catch((error) => console.log('error', error))
        })
      )
    }
  }, [transcript, listening])

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
          <ResetButton onClick={onClickNavigateToMainButton}>버튼 눌러서 듣기</ResetButton>
          <ResetButton onClick={onClickResetButton}>초기화</ResetButton>
        </HeaderButtonContainer>
        <MainImg src={mainImgSrc} />
        <RadioContainer>
          <RadioSubmitButtonWrapper>
            {status === 'WAITING' && <RadioSubmitButton onClick={handleRecording}>시작하기</RadioSubmitButton>}
            {status === 'LISTEN' && <RadioSubmitButton onClick={handleStop}>그만하기</RadioSubmitButton>}
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
