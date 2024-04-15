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

type ListenFeelPageProps = {
  className?: string
}

type StatusType = 'WAITING' | 'LISTEN' | 'WAITING_TTS' | 'TELL'

type DialogType = {
  text: string[]
  score: any
}

export const ListenFeelPage: FC<ListenFeelPageProps> = ({ className }) => {
  const [genderType, setGenderType] = useState<'0' | '1'>('0')
  const [chatbotType, setChatbotType] = useState<'0' | '1'>('0')
  const [dialog, setDialog] = useState<DialogType>({ text: [], score: {} })
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
    setDialog({ text: [], score: {} })
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
        text,
        history: dialog,
      })
      var requestOptions: any = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      }

      fetch(`${baseURL}/phqchat/phqchat`, requestOptions).then((response) =>
        response.text().then((res2) => {
          let text2 = JSON.parse(res2)

          setDialog(() => JSON.parse(res2).history)

          var myHeaders = new Headers()
          myHeaders.append('Content-Type', 'application/json')

          var raw = JSON.stringify({
            text: text2.text[0],
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
        <HeaderButtonContainer>
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
          <RadioRowContainer onClick={() => navigate('/listen')}>
            <RadioRowTypo>일상 대화 챗봇</RadioRowTypo>
            <Radio name="chatbotTypeRadio" checked={false} />
          </RadioRowContainer>
          <RadioRowContainer onClick={() => navigate('/listen/feel')}>
            <RadioRowTypo>우울증 상담 챗봇</RadioRowTypo>
            <Radio name="chatbotTypeRadio" checked={true} />
          </RadioRowContainer>
        </RadioContainer>
      </Container>
    </Root>
  )
}
