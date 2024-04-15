import { Button, Spin, Typography } from 'antd'
import styled from 'styled-components'

export const Root = styled.div`
  width: 100%;
  height: 100vh;
  background: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: calc(12vw + 20px);
`

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

export const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

export const RadioTitleTypo = styled(Typography)`
  &&& {
    font-size: 6vw;
    color: white;
  }
`

export const RadioRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`

export const RadioRowTypo = styled(Typography)`
  &&& {
    font-size: 4vw;
    color: white;
  }
`

export const RadioSubmitButtonWrapper = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`

export const RadioSubmitButton = styled(Button)`
  width: 100%;
`

export const MainImg = styled.img`
  width: calc(100vw - 40px);
  height: 50vh;
  object-fit: contain;
`

export const HeaderButtonContainer = styled.div`
  width: 100%;
  height: 8vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 20px;
  left: 0;
  padding: 0 20px;
  box-sizing: border-box;
`

export const ResetButton = styled(Button)`
  min-width: 20vw;
  height: 8vw;
`

export const WaitingTtsProgress = styled(Spin)``
