/** @jsxImportSource @emotion/react */
import { Icon, TextField, Typography } from 'oyc-ds';
import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  chatCss,
  containerCss,
  responseContainer,
  responseCss,
  speechCss,
  waitCss,
} from './style';
import useChat, { ChatResponse } from '../../../hooks/useChat';
import { avatarTTS } from '../../../apis/avatarApi';
import useDialog from '../../../hooks/useDialog';
import {
  EllipsisHorizontalIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/solid';
import { MainContext } from '../../../pages/Main';

interface AvatarChatProps {
  avatarId: number;
  voiceId: string;
}

const AvatarChat = ({ avatarId, voiceId }: AvatarChatProps) => {
  const { connect, getLog, send } = useChat(avatarId);
  const chatRef = useRef<HTMLInputElement>(null);
  const [response, setResponse] = useState<ReactNode>(undefined);
  const [IsResponsed, setIsResponsed] = useState<boolean>(false);
  const [request, setRequest] = useState<string | undefined>(undefined);
  const audioCacheRef = useRef<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const { alert } = useDialog();
  const mainContext = useContext(MainContext);

  const voiceIdRef = useRef<string>(voiceId);

  voiceIdRef.current = voiceId;

  const getRecentChat = (me: boolean) =>
    getLog()
      .reverse()
      .find(
        (item) =>
          item.me === me && item.type === 'chat' && item.avatarId === avatarId,
      );

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

      audioCacheRef.current = '';

      mainContext.onPendingChange(true);
      setResponse(<div css={waitCss}>아바타가 대답을 생각 중이에요.</div>);
      setIsResponsed(false);

      setRequest(chatRef.current.value);
      chatRef.current.value = '';
    });
  };

  const handleTTSClick = () => {
    if (!response || isPending) {
      return;
    }

    if (!audioCacheRef.current) {
      setIsPending(true);

      avatarTTS(voiceId, response.toString())
        .then((result) => {
          audioCacheRef.current = window.URL.createObjectURL(result.data);
          new Audio(audioCacheRef.current).play();
        })
        .catch(() => {
          alert('오류로 인해 TTS를 재생하지 못했습니다.');
        })
        .finally(() => {
          setIsPending(false);
        });
      return;
    }

    new Audio(audioCacheRef.current).play();
  };

  useEffect(() => {
    const handleOpen = () => {};

    const handleError = () => {};

    const handleClose = () => {};

    const handleMessage = (res: ChatResponse) => {
      setResponse(res.text);
      setIsResponsed(true);
      mainContext.onPendingChange(false);
    };

    connect({
      onOpen: handleOpen,
      onError: handleError,
      onClose: handleClose,
      onMessage: handleMessage,
      onAccount: () => {},
      onSchedule: () => {},
    });

    if (getRecentChat(false)?.message?.toString()) {
      setIsResponsed(true);
    }

    setResponse(getRecentChat(false)?.message?.toString());
    setRequest(getRecentChat(true)?.message?.toString());
  }, []);

  return (
    <div css={containerCss}>
      <div css={responseContainer} onClick={handleTTSClick}>
        {response && IsResponsed && (
          <Icon size="sm" css={speechCss}>
            {isPending ? <EllipsisHorizontalIcon /> : <SpeakerWaveIcon />}
          </Icon>
        )}
        <div css={responseCss}>
          <Typography color="dark" size="md">
            {response ?? '안녕!'}
          </Typography>
        </div>
      </div>
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

export default React.memo(AvatarChat);
