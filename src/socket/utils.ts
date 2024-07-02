import { io } from './socket';

export const SocketResponse = (data: any) => {
  return {
    message: data?.message,
    data: data,
  };
};
export const emitMessage = (key: any, data: any) => {
  io.emit(key, data);
};
