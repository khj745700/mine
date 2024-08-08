/** @jsxImportSource @emotion/react */
import { TextField, Typography } from 'oyc-ds';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { chatCss, containerCss } from './style';
import useChat, { ChatResponse } from '../../../hooks/useChat';

interface AvatarChatProps {
  avatarId: number;
}

const AvatarChat = ({ avatarId }: AvatarChatProps) => {
  const { connect, getLog, send } = useChat(avatarId);
  const chatRef = useRef<HTMLInputElement>(null);
  const [response, setResponse] = useState<string | undefined>(undefined);
  const [request, setRequest] = useState<string | undefined>(undefined);

  const getRecentChat = useCallback(
    (me: boolean) =>
      getLog()
        .reverse()
        .find((item) => item.me === me),
    [getLog],
  );

  useEffect(() => {
    const handleOpen = () => {};

    const handleError = () => {};

    const handleClose = () => {};

    const handleMessage = (res: ChatResponse) => {
      setResponse(res.text);
    };

    connect({
      onOpen: handleOpen,
      onError: handleError,
      onClose: handleClose,
      onMessage: handleMessage,
      onAccount: () => {},
      onSchedule: () => {},
    });

    setResponse(getRecentChat(false)?.message?.toString());
    setRequest(getRecentChat(true)?.message?.toString());
  }, [getRecentChat, connect]);

  const handleChatSend = (e: React.KeyboardEvent) => {
    if (
      e.key !== 'Enter' ||
      !chatRef.current ||
      !chatRef.current.value.trim()
    ) {
      return;
    }

    const message = chatRef.current.value;

    send('chat', message, () => {
      if (!chatRef.current) {
        return;
      }

      setRequest(chatRef.current.value);
      chatRef.current.value = '';
    });
  };

  return (
    <div css={containerCss}>
      <Typography color="dark" size="lg">
        {response ?? '안녕!'}
      </Typography>
      <TextField
        variant="standard"
        label=""
        placeholder={request ?? '내 비서와 대화를 해보세요.'}
        css={chatCss}
        ref={chatRef}
        defaultValue=""
        onKeyDown={handleChatSend}
      />
    </div>
  );
};

export default AvatarChat;
