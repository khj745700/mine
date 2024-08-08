/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from 'react';
import { chatCss, chatLogCss, containerCss } from './style';
import useChat, {
  ChatMessageData,
  ChatResponse,
  ChatType,
} from '../../../hooks/useChat';
import { AccountData } from '../../../apis/accountApi';
import { ScheduleData } from '../../../apis/scheduleApi';
import useModal from '../../../hooks/useModal';
import EditSchedule from '../../Schedule/Edit';
import EditAccount from '../../Account/Edit';
import EventMessage from '../../../components/molecules/EventMessage';
import ChatBox from '../../../components/organisms/ChatBox';
import TypeTextField from '../../../components/molecules/TypeTextField';

const Chat = () => {
  const chatRef = useRef<HTMLInputElement>(null);
  const chatLogRef = useRef<HTMLDivElement>(null);
  const [chatLog, setChatLog] = useState<ChatMessageData[]>([]);
  const chatTypeRef = useRef<ChatType>('chat');
  const { push } = useModal();
  const chat = useChat(1);

  const addChat = (data: ChatMessageData) => {
    setChatLog((chatLog) => [...chatLog, data]);
  };

  const handleChatSend = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter' || !chatRef.current || !chatRef.current.value.trim())
      return;

    const message = chatRef.current.value;

    chat.send(chatTypeRef.current, message, () => {
      addChat({ me: true, message, name: '나', dateTime: new Date().toJSON() });

      if (chatRef.current) {
        chatRef.current.value = '';
      }
    });
  };

  useEffect(() => {
    if (!chatLogRef.current) {
      return;
    }

    chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [chatLog, chatLogRef]);

  useEffect(() => {
    const handleOpen = () => {};

    const handleError = () => {};

    const handleClose = () => {};

    const handleMessage = (res: ChatResponse) => {
      addChat({
        me: false,
        message: res.text,
        name: res.avatarName,
        dateTime: res.sendedDate,
      });
    };

    const handleAccount = (data: AccountData) => {
      setChatLog((chatLog) => [
        ...chatLog,
        {
          me: false,
          message: (
            <EventMessage
              title={data.title}
              value="가계부 보기"
              onClick={() =>
                push({
                  component: <EditAccount data={data} />,
                  name: 'editAccount',
                })
              }
            />
          ),
          name: '아바타',
          dateTime: new Date().toJSON(),
        },
      ]);
    };

    const handleSchedule = (data: ScheduleData) => {
      setChatLog((chatLog) => [
        ...chatLog,
        {
          me: false,
          message: (
            <EventMessage
              title={data.title}
              value="일정 보기"
              onClick={() =>
                push({
                  component: <EditSchedule data={data} />,
                  name: 'editSchedule',
                })
              }
            />
          ),
          name: '아바타',
          dateTime: new Date().toJSON(),
        },
      ]);
    };

    chat.connect({
      onOpen: handleOpen,
      onError: handleError,
      onClose: handleClose,
      onMessage: handleMessage,
      onAccount: handleAccount,
      onSchedule: handleSchedule,
    });
  }, []);

  return (
    <>
      <div css={containerCss}>
        <div css={chatLogCss} ref={chatLogRef}>
          <ChatBox messages={chatLog} />
        </div>
        <div css={chatCss}>
          <TypeTextField
            ref={chatRef}
            types={[
              { name: '채팅', value: 'chat' },
              { name: '일정', value: 'schedule' },
              { name: '가계', value: 'account' },
            ]}
            onKeyDown={handleChatSend}
            onTypeChange={(type) => {
              chatTypeRef.current = type as ChatType;
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
