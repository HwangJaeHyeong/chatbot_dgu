import { useState } from 'react'
import { ReactMicStopEvent } from 'react-mic'

type StatusType = 'RECORD' | 'PAUSE' | 'END'

type useMicHandlerType = {
  record: boolean
  pause: boolean
  stop: boolean
  recordedFile?: any
  // eslint-disable-next-line no-unused-vars
  handleStatus: (_type: StatusType) => () => void
  // eslint-disable-next-line no-unused-vars
  onStop: (_recordedFile: ReactMicStopEvent) => void
}

export const useMicHandler = (): useMicHandlerType => {
  const [status, setStatus] = useState<StatusType>('END')
  const [recordedFile, setRecordedFile] = useState<any>()

  const handleStatus = (type: StatusType) => () => {
    if (type === 'PAUSE') {
      setStatus((prev) => (prev === 'PAUSE' ? 'RECORD' : 'PAUSE'))
      return
    }
    setStatus(type)
    return
  }

  const onStop = (recordedFileValue: any) => {
    // eslint-disable-next-line no-undef
    let recordedBlob = new Blob([recordedFileValue['blob']], recordedFileValue['options'])
    setRecordedFile(recordedBlob)
    return
  }

  return {
    record: status === 'RECORD',
    pause: status === 'PAUSE',
    stop: status === 'END',
    recordedFile,
    handleStatus,
    onStop,
  }
}
