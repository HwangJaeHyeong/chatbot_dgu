import { axiosPOST } from 'api/base'
import { AxiosRequestConfig } from 'axios'
import { useMutation, UseMutationOptions } from 'react-query'

export type PostAsrRequestType = {}

export type PostAsrResponseType = {}

// eslint-disable-next-line no-unused-vars
const postAsrMutationPath = (param: PostAsrRequestType) => `/asr/asr`

const postAsr = (params: PostAsrRequestType, config?: AxiosRequestConfig) => {
  return axiosPOST<PostAsrRequestType, PostAsrResponseType>(postAsrMutationPath(params), params, config)
}

export const usePostAsrMutation = (
  options?: Omit<UseMutationOptions<PostAsrResponseType, unknown, PostAsrRequestType>, 'mutationKey' | 'mutationFn'>,
  axiosConfig?: AxiosRequestConfig
) => {
  return useMutation<PostAsrResponseType, unknown, PostAsrRequestType>(
    (variables) => postAsr(variables, axiosConfig),
    options
  )
}
