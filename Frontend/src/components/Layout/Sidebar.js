import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  Film, 
  Globe, 
  Plus,
  Star,
  Zap
} from 'lucide-react';
import AddCharacterModal from '../AddCharacterModal ';

const SidebarContainer = styled(motion.nav)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${props => props.isOpen ? '280px' : '80px'};
  background: linear-gradient(180deg, 
    rgba(0, 0, 0, 0.95) 0%, 
    rgba(26, 26, 46, 0.95) 50%, 
    rgba(22, 33, 62, 0.95) 100%
  );
  backdrop-filter: blur(15px);
  border-right: 3px solid ${props => props.theme.colors.primary};
  z-index: 1001;
  transition: width 0.3s ease;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      linear-gradient(45deg, transparent 30%, ${props => props.theme.colors.primary}10 50%, transparent 70%),
      radial-gradient(circle at 20% 80%, ${props => props.theme.colors.accent}20 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    width: 280px;
  }
`;

const LogoSection = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  border-bottom: 1px solid ${props => props.theme.colors.primary}30;
  position: relative;
`;

const LogoIcon = styled(motion.div)`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  box-shadow: 0 0 30px ${props => props.theme.colors.primary}50;
`;

const LogoText = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.primary};
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const NavSection = styled.div`
  padding: 2rem 0;
  flex: 1;
`;

const NavItem = styled(motion.div)`
  margin: 0.5rem 1rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  text-decoration: none;
  color: ${props => props.isActive ? props.theme.colors.secondary : props.theme.colors.textSecondary};
  background: ${props => props.isActive ? 
    `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})` : 
    'transparent'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}20, ${props => props.theme.colors.accent}20);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: ${props => props.isActive ? 0 : 1};
  }

  &:hover {
    transform: translateX(5px);
    box-shadow: ${props => props.isActive ? 'none' : `0 5px 15px ${props.theme.colors.primary}30`};
  }
`;

const NavIcon = styled.div`
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.showText ? '1rem' : '0'};
  z-index: 1;
`;

const NavText = styled(motion.span)`
  font-size: 1rem;
  font-weight: 500;
  z-index: 1;
  white-space: nowrap;
`;

const AddButton = styled(motion.button)`
  width: calc(100% - 2rem);
  margin: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.accent}, ${props => props.theme.colors.primary});
  border: none;
  border-radius: 12px;
  color: ${props => props.theme.colors.secondary};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px ${props => props.theme.colors.accent}40;
  }
`;

const FooterSection = styled.div`
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.primary}30;
  text-align: center;
`;



const navItems = [
  {
    path: '/',
    label: 'Home',
    icon: Home,
  },
  {
    path: '/characters',
    label: 'Characters',
    icon: Users,
  },
  {
    path: '/films',
    label: 'Films',
    icon: Film,
  },
  {
    path: '/planets',
    label: 'Planets',
    icon: Globe,
  },
];

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sidebarVariants = {
    open: { width: '280px' },
    closed: { width: '80px' }
  };

  const textVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 }
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <SidebarContainer
        isOpen={isOpen}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        variants={sidebarVariants}
      >
        <LogoSection>
          <LogoIcon
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Star size={28} color="#000" />
          </LogoIcon>
          <AnimatePresence>
            {isOpen && (
              <LogoText
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                SW Galaxy
              </LogoText>
            )}
          </AnimatePresence>
        </LogoSection>

        <NavSection>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            
            return (
              <NavItem
                key={item.path}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <NavLink to={item.path} isActive={isActive}>
                  <NavIcon showText={isOpen}>
                    <IconComponent size={24} />
                  </NavIcon>
                  <AnimatePresence>
                    {isOpen && (
                      <NavText
                        variants={textVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                      </NavText>
                    )}
                  </AnimatePresence>
                </NavLink>
              </NavItem>
            );
          })}

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <AddButton
                  onClick={handleAddClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} />
                  Add New
                </AddButton>
              </motion.div>
            )}
          </AnimatePresence>
        </NavSection>

        <FooterSection>
         
        </FooterSection>
      </SidebarContainer>

      <AddCharacterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;