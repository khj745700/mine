import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Modal from './Modal';

export type ModalType = 'modal' | 'alert' | 'confirm';

export interface ModalPushProps {
  name: string;
  component: ReactElement;
  type?: ModalType;
  show?: boolean;
  onClose?: () => void;
}

export type ModalData = Required<ModalPushProps>;

interface ModalContextType {
  modals: ModalData[];
  push: (data: ModalData) => void;
  pop: () => void;
}

export const ModalContext = createContext<ModalContextType>(
  {} as ModalContextType,
);

export const ModalProvider = (props: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalData[]>([]);

  const push = ({
    component,
    name,
    show = true,
    type = 'modal',
    onClose = () => {},
  }: ModalPushProps) => {
    for (const modal of modals) {
      if (modal.name === name) {
        return;
      }
    }
    setModals((modals) => [
      ...modals,
      { component, name, show, type, onClose },
    ]);
    window.history.pushState({ ...window.history.state, type, name }, '', '');
  };

  const pop = (name: string) => {
    setModals((modals) => {
      for (let i = modals.length - 1; i >= 0; i--) {
        if (!modals[i].show && modals[i].name === name) {
          modals[i].onClose();
          return [...modals.slice(0, i), ...modals.slice(i + 1)];
        }
      }
      return modals;
    });
  };

  const hide = () => {
    setModals((modals) => {
      for (let i = modals.length - 1; i >= 0; i--) {
        if (modals[i].show) {
          modals[i].show = false;
          break;
        }
      }
      return [...modals];
    });
  };

  useEffect(() => {
    const handlePopState = () => {
      hide();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <ModalContext.Provider value={{ modals, push, pop: hide }}>
      {props.children}
      {modals.map((modal) => (
        <Modal
          key={modal.name}
          data={modal}
          onFadeOutEnd={() => pop(modal.name)}
        />
      ))}
    </ModalContext.Provider>
  );
};

const useModal = () => {
  const modalContext = useContext(ModalContext);

  const pop = () => {
    window.history.back();
  };

  const push = ({
    component,
    name,
    show = true,
    type = 'modal',
    onClose = () => {},
  }: ModalPushProps) => {
    modalContext.push({ component, name, show, type, onClose });
  };

  return { push, pop };
};

export default useModal;
