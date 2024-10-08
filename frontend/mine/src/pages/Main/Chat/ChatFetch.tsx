/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { chatCss, chatLogCss, containerCss, pendingCss } from './style';
import useChat, {
  ChatMessageData,
  ChatResponse,
  ChatType,
} from '../../../hooks/useChat';
import {
  AccountData,
  updateAccountAchievement,
} from '../../../apis/accountApi';
import {
  ScheduleData,
  updateScheduleAchievement,
} from '../../../apis/scheduleApi';
import ChatBox from '../../../components/organisms/ChatBox';
import TypeTextField from '../../../components/molecules/TypeTextField';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserAvatars } from '../../../apis/mypageApi';
import useDialog from '../../../hooks/useDialog';
import { useMutation } from '@tanstack/react-query';
import { updateChatEasterAchievement } from '../../../apis/avatarApi';
import { Typography } from 'oyc-ds';
import { getMainAvatar } from '../../../utils/avatarUtils';
import { MainContext } from '..';

const ChatFetch = () => {
  const chatRef = useRef<HTMLInputElement>(null);
  const chatLogRef = useRef<HTMLDivElement>(null);
  const [chatLog, setChatLog] = useState<ChatMessageData[]>([]);
  const chatTypeRef = useRef<ChatType>('chat');
  const { alert } = useDialog();
  const [isPending, setIsPending] = useState<boolean>(false);
  const mainContext = useContext(MainContext);

  const avatarQuery = useSuspenseQuery({
    queryKey: ['avatarinfo'],
    queryFn: async () => await getUserAvatars(),
  });

  if (avatarQuery.error && !avatarQuery.isFetching) {
    throw avatarQuery.error;
  }

  const chat = useChat(
    avatarQuery.data.data.length
      ? getMainAvatar(avatarQuery.data.data).avatarId
      : -1,
  );

  const addChat = (data: ChatMessageData) => {
    setChatLog((chatLog) => [...chatLog, data]);
  };

  const { mutate: updateSpinEaster } = useMutation({
    mutationFn: async () => await updateChatEasterAchievement(),
    onSuccess: (res) => {
      if (res.data)
        alert(
          <div>
            이스터에그 달성!
            <br />
            저는 바보가 아니예요 😒
          </div>,
        );
    },
  });

  const handleChatSend = (e: React.KeyboardEvent | void) => {
    if (
      (e && e.key !== 'Enter') ||
      !chatRef.current ||
      !chatRef.current.value.trim()
    ) {
      return;
    }

    const message = chatRef.current.value;

    if (chatTypeRef.current === 'chat' && chat.avatarId === -1) {
      alert('같이 대화할 아바타가 아직 없어요!');
      return;
    }

    if (message === '바보') {
      updateSpinEaster();
    }

    chat.send(chatTypeRef.current, message, () => {
      setIsPending(true);
      mainContext.onPendingChange(true);

      addChat({
        me: true,
        message,
        name: '나',
        dateTime: new Date().toJSON(),
        type: 'chat',
        data: null,
      });

      if (chatRef.current) {
        chatRef.current.blur();
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
        type: 'chat',
        data: null,
      });

      setIsPending(false);
      mainContext.onPendingChange(false);
    };

    const handleAccount = async (data: AccountData) => {
      const result = await updateAccountAchievement();

      if (result.data) {
        alert('새로운 업적을 달성하였습니다!');
      }

      addChat({
        me: false,
        message: '',
        name: '',
        dateTime: new Date().toJSON(),
        type: 'account',
        data,
      });

      setIsPending(false);
      mainContext.onPendingChange(false);
    };

    const handleSchedule = async (data: ScheduleData) => {
      const result = await updateScheduleAchievement();

      if (result.data) {
        alert('새로운 업적을 달성하였습니다!');
      }

      addChat({
        me: false,
        message: '',
        name: '',
        dateTime: new Date().toJSON(),
        type: 'schedule',
        data,
      });

      setIsPending(false);
      mainContext.onPendingChange(false);
    };

    chat.connect({
      onOpen: handleOpen,
      onError: handleError,
      onClose: handleClose,
      onMessage: handleMessage,
      onAccount: handleAccount,
      onSchedule: handleSchedule,
    });

    chat.getLog().forEach((chat) => {
      addChat(chat);
    });
  }, [setIsPending]);

  return (
    <>
      <div css={containerCss}>
        <div css={chatLogCss} ref={chatLogRef}>
          <ChatBox
            messages={chatLog}
            voiceId={
              avatarQuery?.data?.data.length
                ? getMainAvatar(avatarQuery.data.data).voiceId
                : ''
            }
          />
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
            onVoiceInput={handleChatSend}
            disabled={isPending}
          />
          {isPending && (
            <div css={pendingCss}>
              <Typography size="sm" color="light">
                아바타의 대답을 기다리고 있어요.
              </Typography>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatFetch;
