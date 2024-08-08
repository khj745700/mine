import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { ToastVariant } from 'oyc-ds/dist/components/molecules/Toast/Toast.types';
import { Palette } from 'oyc-ds/dist/themes/lightTheme';
import Notification from '../../components/common/Notification';

export interface INotiInfo {
  notiState: boolean;
  variant: ToastVariant;
  color: Palette;
  msg: string;
}

export interface INotification {
  notiInfo: INotiInfo;
}

export interface INotificationContext {
  info: INotiInfo;
  update: (newInfo: Partial<INotiInfo>) => void;
  handle: (variant: ToastVariant, color: Palette, msg: string) => void;
}

export const NotificationContext = createContext<INotificationContext>(
  {} as INotificationContext,
);

export const NotificationProvider = (props: { children: ReactNode }) => {
  const [notiInfo, setNotiInfo] = useState<INotiInfo>({
    notiState: false,
    variant: 'contained',
    color: 'primary',
    msg: '',
  });

  const updateInfo = useCallback((newInfo: Partial<INotiInfo>) => {
    setNotiInfo((info) => {
      return { ...info, ...newInfo };
    });
  }, []);

  const handleNoti = useCallback(
    (variant: ToastVariant, color: Palette, msg: string) => {
      updateInfo({
        notiState: true,
        variant: variant,
        color: color,
        msg: msg,
      });
      setTimeout(() => {
        updateInfo({
          notiState: false,
        });
      }, 2000);
    },
    [],
  );

  return (
    <NotificationContext.Provider
      value={{
        info: notiInfo,
        update: updateInfo,
        handle: handleNoti,
      }}
    >
      {notiInfo.notiState && <Notification notiInfo={notiInfo} />}
      {props.children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  const notificationContext = useContext(NotificationContext);

  const handle = (variant: ToastVariant, color: Palette, msg: string) => {
    notificationContext.handle(variant, color, msg);
  };

  return { handle };
};

export default useNotification;
