import { Button, Typography } from 'antd'
import styled from 'styled-components'

export const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
`

export const Container = styled.div`
  width: 300px;
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

export const RadioTitleTypo = styled(Typography)``

export const RadioRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`

export const RadioRowTypo = styled(Typography)``

export const RadioSubmitButton = styled(Button)`
  width: 100%;
`

export const MainImg = styled.img`
  width: 100%;
`
