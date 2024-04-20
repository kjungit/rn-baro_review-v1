import {useMutation, useQuery} from '@tanstack/react-query';

import {UseMutationCustomOptions, UseQueryCustomOptions} from '@/types/common';
import {removeEncryptStorage, setEncryptStorage} from '@/utils';
import {removeHeader, setHeader} from '@/utils/header';
import {useEffect} from 'react';
import queryClient from '@/apis/queryClient';
import {numbers, queryKeys, storageKeys} from '@/constants';
import {
  getAccessToken,
  getProfile,
  logout,
  postLogin,
  postSignup,
} from '@/apis/auth';

function useSignup(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postSignup,
    ...mutationOptions,
  });
}

function useLogin(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postLogin,
    onSuccess: ({accessToken, refreshToken}) => {
      setEncryptStorage(storageKeys.REFRESH_TOKEN, refreshToken);
      setHeader(queryKeys.AUTHORIZATION, `Bearer ${accessToken}`);
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
    ...mutationOptions,
  });
}

function useLogout(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeHeader(queryKeys.AUTHORIZATION);
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    },
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.AUTH]});
    },
    ...mutationOptions,
  });
}

function useGetRefreshToken() {
  const {isSuccess, data, isError} = useQuery({
    queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
    queryFn: getAccessToken,
    staleTime: numbers.ACCESS_TOKEN_REFRESH_TIME,
    refetchInterval: numbers.ACCESS_TOKEN_REFRESH_TIME,
    refetchOnReconnect: true, //네트워크 재연결 시
    refetchIntervalInBackground: true, // 백그라운드에 있는 동안에도 사용
  });

  useEffect(() => {
    if (isSuccess) {
      setEncryptStorage(storageKeys.REFRESH_TOKEN, data.refreshToken);
      setHeader(queryKeys.AUTHORIZATION, `Bearer ${data.accessToken}`);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      removeHeader(queryKeys.AUTHORIZATION);
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    }
  });

  return {isSuccess, isError};
}

function useGetProfile(queryOptions?: UseQueryCustomOptions) {
  return useQuery({
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    queryFn: getProfile,
    ...queryOptions,
  });
}

function useAuth() {
  const signupMutation = useSignup();
  const refreshTokenQuery = useGetRefreshToken();
  const getProfileQuery = useGetProfile({
    enabled: refreshTokenQuery.isSuccess,
  });
  const isLogin = getProfileQuery.isSuccess;
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  return {
    signupMutation,
    getProfileQuery,
    isLogin,
    loginMutation,
    logoutMutation,
  };
}

export default useAuth;
