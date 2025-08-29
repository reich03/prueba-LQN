import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { motion } from 'framer-motion';

import { client } from './graphql/client';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import HomePage from './pages/HomePage';
import CharactersPage from './pages/CharactersPage';
import FilmsPage from './pages/FilmsPage';
import PlanetsPage from './pages/PlanetsPage';
import CharacterDetailPage from './pages/CharacterDetailPage';
import FilmDetailPage from './pages/FilmDetailPage';

const theme = {
  colors: {
    primary: '#FFD700',
    secondary: '#000000',
    background: '#0a0a0a',
    cardBackground: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#cccccc',
    accent: '#ff6b35',
    success: '#00ff00',
    error: '#ff0000',
  },
  fonts: {
    primary: '"Orbitron", "Arial", sans-serif',
    secondary: '"Roboto", "Arial", sans-serif',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px',
  }
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%);
    color: ${props => props.theme.colors.text};
    font-family: ${props => props.theme.fonts.secondary};
    min-height: 100vh;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(ellipse at top, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at bottom, rgba(255, 107, 53, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.accent};
  }
`;

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
`;

const MainContent = styled(motion.main)`
  flex: 1;
  margin-left: ${props => props.sidebarOpen ? '280px' : '80px'};
  transition: margin-left 0.3s ease;
  padding: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-left: 0;
    padding: 10px;
  }
`;

const StarField = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -2;
  
  &::before {
    content: '';
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    border-radius: 50%;
    box-shadow: 
      25px 5px #fff, 45px 15px #fff, 70px 25px #fff,
      95px 35px #fff, 120px 45px #fff, 145px 55px #fff,
      170px 65px #fff, 195px 75px #fff, 220px 85px #fff,
      245px 95px #fff, 270px 105px #fff, 295px 115px #fff,
      320px 125px #fff, 345px 135px #fff, 370px 145px #fff,
      395px 155px #fff, 420px 165px #fff, 445px 175px #fff,
      470px 185px #fff, 495px 195px #fff, 520px 205px #fff,
      545px 215px #fff, 570px 225px #fff, 595px 235px #fff,
      620px 245px #fff, 645px 255px #fff, 670px 265px #fff,
      695px 275px #fff, 720px 285px #fff, 745px 295px #fff;
    animation: stars 20s linear infinite;
  }
  
  @keyframes stars {
    0% { transform: translateY(0); }
    100% { transform: translateY(-100vh); }
  }
`;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <AppContainer>
            <StarField />
            <Sidebar isOpen={sidebarOpen} />
            <div style={{ flex: 1 }}>
              <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
              <MainContent
                sidebarOpen={sidebarOpen}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/characters" element={<CharactersPage />} />
                  <Route path="/characters/:id" element={<CharacterDetailPage />} />
                  <Route path="/films" element={<FilmsPage />} />
                  <Route path="/films/:id" element={<FilmDetailPage />} />
                  <Route path="/planets" element={<PlanetsPage />} />
                </Routes>
              </MainContent>
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: theme.colors.cardBackground,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.primary}`,
                },
              }}
            />
          </AppContainer>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;