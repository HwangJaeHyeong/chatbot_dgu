import { axiosPOST } from 'api/base'
import { AxiosRequestConfig } from 'axios'
import { useMutation, UseMutationOptions } from 'react-query'

export type PostTtsRequestType = {
  text: string
  speaker: '0' | '1'
}

export type PostTtsResponseType = {}

// eslint-disable-next-line no-unused-vars
const postTtsMutationPath = (param: PostTtsRequestType) => `/tts/tts`

const postTts = (params: PostTtsRequestType, config?: AxiosRequestConfig) => {
  return axiosPOST<PostTtsRequestType, PostTtsResponseType>(postTtsMutationPath(params), params, {
    ...config,
    withCredentials: true,
  })
}

export const usePostTtsMutation = (
  options?: Omit<UseMutationOptions<PostTtsResponseType, unknown, PostTtsRequestType>, 'mutationKey' | 'mutationFn'>,
  axiosConfig?: AxiosRequestConfig
) => {
  return useMutation<PostTtsResponseType, unknown, PostTtsRequestType>(
    (variables) => postTts(variables, axiosConfig),
    options
  )
}
