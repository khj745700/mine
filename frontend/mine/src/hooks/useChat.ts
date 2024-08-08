import { ReactNode, useRef } from 'react';
import { AccountData, addAccountByChat } from '../apis/accountApi';
import { addScheduleByChat, ScheduleData } from '../apis/scheduleApi';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export type ChatType = 'chat' | 'schedule' | 'account';

export interface ChatMessageData {
  name: string;
  message: ReactNode;
  me: boolean;
  dateTime: string;
}

export interface ChatResponse {
  avatarId: number;
  avatarName: string;
  role: string;
  sendedDate: string;
  text: string;
}

interface ChatEventHandler {
  onOpen: () => void;
  onError: () => void;
  onClose: () => void;
  onMessage: (message: ChatResponse) => void;
  onAccount: EventCallback<AccountData>;
  onSchedule: EventCallback<ScheduleData>;
}

type EventCallback<T> = (data: T) => void;

const useChat = (
  avatarId: number,
  server: string = 'https://i11d106.p.ssafy.io/chat/stomp/chat',
) => {
  const accountRef = useRef<EventCallback<AccountData>>(() => {});
  const scheduleRef = useRef<EventCallback<ScheduleData>>(() => {});
  const socketRef = useRef<Client>();
  const connect = ({
    onOpen,
    onError,
    onClose,
    onMessage,
    onAccount,
    onSchedule,
  }: ChatEventHandler) => {
    socketRef.current = new Client({
      webSocketFactory: () =>
        new SockJS(server, null, {
          transports: ['websocket', 'jsonp'],
        }),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    const socket = socketRef.current;

    if (!socket) {
      return;
    }

    socket.onConnect = () => {
      onOpen();
      socket.subscribe(`/chat/${avatarId}`, (message) => {
        const data: ChatResponse = JSON.parse(message.body);
        addLog({
          me: false,
          name: data.avatarName,
          message: data.text,
          dateTime: data.sendedDate,
        });
        onMessage(data);
      });
    };

    socket.onStompError = onError;
    socket.onWebSocketClose = onClose;

    socket.activate();

    accountRef.current = onAccount;
    scheduleRef.current = onSchedule;
  };

  const addLog = (data: ChatMessageData) => {
    const log: ChatMessageData[] = getLog();
    log.push(data);
    localStorage.setItem('chatLog', JSON.stringify(log.slice(-30)));
  };

  const getLog = (): ChatMessageData[] => {
    return JSON.parse(localStorage.getItem('chatLog') ?? '[]');
  };

  const send = async (type: ChatType, content: string, onSend: () => void) => {
    switch (type) {
      case 'chat': {
        const date = new Date().toJSON();

        addLog({ me: true, name: '나', message: content, dateTime: date });
        onSend();

        const socket = socketRef.current;
        if (!socket) {
          return;
        }
        socket.publish({
          destination: `/pub/${avatarId}`,
          body: JSON.stringify({
            chatContent: content,
            sendedAt: date,
          }),
        });
        break;
      }
      case 'account': {
        onSend();

        const result = await addAccountByChat({ query: content });
        accountRef.current(result.data);
        break;
      }
      case 'schedule': {
        onSend();

        const result = await addScheduleByChat({ query: content });
        scheduleRef.current(result.data);
        break;
      }
    }
  };

  return { connect, send, getLog };
};

export default useChat;
