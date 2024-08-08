import React from 'react';
import Signup from './pages/Signup';
import { LightTheme } from 'oyc-ds';
import { ThemeProvider } from '@emotion/react';
import { UserProvider } from './pages/Login/UserContext';
import { ModalProvider } from './hooks/useModal';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import GlobalStyle from './styles/GlobalStyle';
import Home from './pages/Login/Home';
import Login from './pages/Login/Login';
import CreateAvatar from './pages/CreateAvatar';
import FindPassword from './pages/FindPassword';
import Main from './pages/Main';
import Schedule from './pages/Schedule';
import Account from './pages/Account';
import AccountChart from './pages/Statistics/Account/index';
import ScheduleChart from './pages/Statistics/Schedule/index';
import NickEdit from './pages/Main/Mypage/EditUser/NickEdit';
import PwdEdit from './pages/Main/Mypage/EditUser/PwdEdit';
import Achievement from './pages/Main/Mypage/Achievement';
import AvatarInfo from './pages/Main/Mypage/AvatarInfo';
import AvatarInfoEdit from './pages/Main/Mypage/EditAvatar/AvatarInfoEdit';
import AvatarQnAEdit from './pages/Main/Mypage/EditAvatar/AvatarQnAEdit';
import { NotificationProvider } from './hooks/useNotification';

function App() {
  return (
    <>
      <GlobalStyle />
      <UserProvider>
        <ThemeProvider theme={LightTheme}>
          <ModalProvider>
            <NotificationProvider>
              <Routes>
                {/* 개발용 메뉴 버튼들 */}
                <Route path="/btns" element={<Home />} />

                {/* 메인 화면 */}
                <Route path="/" element={<Main />} />

                {/* 회원 인증 / 인가 */}
                <Route path="/user/login" element={<Login />} />
                <Route path="/user/signup" element={<Signup />} />
                <Route path="/user/findpassword" element={<FindPassword />} />

                {/* 마이페이지 */}
                <Route path="/mypage/nick" element={<NickEdit />} />
                <Route path="/mypage/pwd" element={<PwdEdit />} />
                <Route path="/mypage/achievement" element={<Achievement />} />
                <Route path="/mypage/avatar" element={<AvatarInfo />} />
                <Route
                  path="/mypage/avatar/info"
                  element={<AvatarInfoEdit />}
                />
                <Route path="/mypage/avatar/qna" element={<AvatarQnAEdit />} />
                <Route path="/avatar/create" element={<CreateAvatar />} />

                {/* 일정 & 가계 */}
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/account" element={<Account />} />

                {/* 통계 */}
                <Route path="/accountchart" element={<AccountChart />} />
                <Route path="/schedulechart" element={<ScheduleChart />} />
              </Routes>
            </NotificationProvider>
          </ModalProvider>
        </ThemeProvider>
      </UserProvider>
    </>
  );
}

export default App;
