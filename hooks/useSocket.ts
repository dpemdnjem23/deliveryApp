import SocketIOClient, {Socket} from 'socket.io-client';

import Config from 'react-native-config';
import {useCallback} from 'react';
import commonFunction from '@/components/commonFunction';

let socket: Socket | undefined;
const useSocket = (): [Socket | undefined, () => void] => {
  //로그인 확인법으로 accessToken을 가져온다.
  const isLoggedIn = commonFunction.getAccessToken();
  //웹소켓 연결해제 useCallback 으로 memoization
  //loggein돼이스면 유지 loggedout상태면 disconnect유지
  const disconnect = useCallback(() => {
    if (socket && !isLoggedIn) {
      console.debug(socket && !isLoggedIn, '웹소켓 연결해제');
      socket.disconnect();
      socket = undefined;
    }
  }, [isLoggedIn]);

  if (!socket && isLoggedIn) {
    console.debug(!socket && isLoggedIn, '웹소켓 연결');
    socket = SocketIOClient(`${Config.API_URL}`);
  }
  return [socket, disconnect];
};
