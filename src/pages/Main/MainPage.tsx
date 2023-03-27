import { usePostTtsMutation } from 'api/postTts'
import { FC, useEffect } from 'react'
import { Root } from './styled'

type MainPageProps = {
  className?: string
}

export const MainPage: FC<MainPageProps> = ({ className }) => {
  const { mutate: postTtsMutate } = usePostTtsMutation()

  useEffect(() => {
    postTtsMutate({ speaker: '0', text: '안녕하세요' })
  }, [])

  return <Root className={className}>test</Root>
}
