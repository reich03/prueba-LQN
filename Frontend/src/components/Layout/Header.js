import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Menu, Search } from 'lucide-react';

const HeaderContainer = styled(motion.header)`
  background: linear-gradient(90deg, 
    rgba(0, 0, 0, 0.9) 0%, 
    rgba(26, 26, 46, 0.9) 50%, 
    rgba(0, 0, 0, 0.9) 100%
  );
  backdrop-filter: blur(10px);
  border-bottom: 2px solid ${props => props.theme.colors.primary};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  margin-left: ${props => props.sidebarOpen ? '280px' : '80px'};
  transition: margin-left 0.3s ease;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled(motion.button)`
  background: none;
  border: 2px solid ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primary};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.secondary};
    box-shadow: 0 0 20px ${props => props.theme.colors.primary}40;
  }

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const Title = styled(motion.h1)`
  font-family: ${props => props.theme.fonts.primary};
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 30px ${props => props.theme.colors.primary}50;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.4rem;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled(motion.input)`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid transparent;
  border-radius: 25px;
  padding: 0.5rem 1rem 0.5rem 3rem;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  width: 250px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 20px ${props => props.theme.colors.primary}30;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 200px;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  z-index: 1;
`;

const StatusIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(26, 26, 46, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.primary}30;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.theme.colors.success};
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const StatusText = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Header = ({ onToggleSidebar, sidebarOpen }) => {
  return (
    <HeaderContainer
      sidebarOpen={sidebarOpen}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LeftSection>
        <MenuButton
          onClick={onToggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={24} />
        </MenuButton>
        
        <Title
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Star Wars Galaxy
        </Title>
      </LeftSection>

      <RightSection>
       

        <StatusIndicator
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <StatusDot />
          <StatusText>Connected</StatusText>
        </StatusIndicator>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;