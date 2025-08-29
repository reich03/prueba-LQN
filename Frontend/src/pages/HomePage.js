import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { 
  Users, 
  Film, 
  Globe, 
  ArrowRight
} from 'lucide-react';
import { GET_ALL_PEOPLE, GET_ALL_FILMS, GET_ALL_PLANETS } from '../graphql/queries';

const HomeContainer = styled(motion.div)`
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled(motion.section)`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
`;

const HeroTitle = styled(motion.h1)`
  font-family: ${props => props.theme.fonts.primary};
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const StatsSection = styled(motion.section)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const StatCard = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(26, 26, 46, 0.8) 0%, 
    rgba(22, 33, 62, 0.8) 100%
  );
  backdrop-filter: blur(10px);
  border: 2px solid ${props => props.theme.colors.primary}30;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent 30%, ${props => props.theme.colors.primary}10 50%, transparent 70%);
    pointer-events: none;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 10px 40px ${props => props.theme.colors.primary}20;
    transform: translateY(-5px);
  }
`;

const StatIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  box-shadow: 0 0 30px ${props => props.theme.colors.primary}40;
`;

const StatNumber = styled(motion.div)`
  font-size: 3rem;
  font-weight: 900;
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const QuickActionsSection = styled(motion.section)`
  margin-bottom: 4rem;
`;

const SectionTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.primary};
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ActionCard = styled(motion(Link))`
  background: linear-gradient(135deg, 
    rgba(26, 26, 46, 0.6) 0%, 
    rgba(22, 33, 62, 0.6) 100%
  );
  backdrop-filter: blur(15px);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}10, ${props => props.theme.colors.accent}10);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-5px);
    box-shadow: 0 15px 50px ${props => props.theme.colors.primary}25;
  }
`;

const ActionIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  z-index: 1;
`;

const ActionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  z-index: 1;
`;

const ActionDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
  margin-bottom: 1rem;
  z-index: 1;
`;

const ActionArrow = styled(ArrowRight)`
  z-index: 1;
  transition: transform 0.3s ease;
  
  ${ActionCard}:hover & {
    transform: translateX(5px);
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid ${props => props.theme.colors.primary}30;
  border-top: 3px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  margin: 2rem auto;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const HomePage = () => {
  const { data: peopleData, loading: peopleLoading } = useQuery(GET_ALL_PEOPLE, { 
    variables: { first: 1 } 
  });
  const { data: filmsData, loading: filmsLoading } = useQuery(GET_ALL_FILMS, { 
    variables: { first: 1 } 
  });
  const { data: planetsData, loading: planetsLoading } = useQuery(GET_ALL_PLANETS, { 
    variables: { first: 1 } 
  });

  const stats = [
    {
      icon: Users,
      number: peopleLoading ? '...' : peopleData?.allPeople?.edges?.length || '0',
      label: 'Characters',
      color: '#FFD700'
    },
    {
      icon: Film,
      number: filmsLoading ? '...' : filmsData?.allFilms?.edges?.length || '0',
      label: 'Films',
      color: '#ff6b35'
    },
    {
      icon: Globe,
      number: planetsLoading ? '...' : planetsData?.allPlanets?.edges?.length || '0',
      label: 'Planets',
      color: '#00ff88'
    }
  ];

  const quickActions = [
    {
      to: '/characters',
      icon: Users,
      title: 'Explore Characters',
      description: 'Discover heroes, villains, and everyone in between from the Star Wars universe.'
    },
    {
      to: '/films',
      icon: Film,
      title: 'Browse Films',
      description: 'Explore the complete saga from Episode I to IX and beyond.'
    },
    {
      to: '/planets',
      icon: Globe,
      title: 'Visit Planets',
      description: 'Journey across the galaxy and explore diverse worlds and civilizations.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <HomeContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <HeroSection variants={itemVariants}>
        <HeroTitle
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Welcome to the Galaxy
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Explore the vast Star Wars universe with our comprehensive database of characters, 
          films, and planets from a galaxy far, far away.
        </HeroSubtitle>
      </HeroSection>

      <StatsSection variants={itemVariants}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <StatCard
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.6 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <StatIcon>
                <IconComponent size={40} color="#000" />
              </StatIcon>
              <StatNumber
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.8, duration: 0.4 }}
              >
                {stat.number}
              </StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          );
        })}
      </StatsSection>

      <QuickActionsSection variants={itemVariants}>
        <SectionTitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Quick Access
        </SectionTitle>
        
        <ActionsGrid>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <ActionCard
                key={action.to}
                to={action.to}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 + 1.2, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <ActionIcon>
                  <IconComponent size={30} color="#000" />
                </ActionIcon>
                <ActionTitle>{action.title}</ActionTitle>
                <ActionDescription>{action.description}</ActionDescription>
                <ActionArrow size={24} />
              </ActionCard>
            );
          })}
        </ActionsGrid>
      </QuickActionsSection>
    </HomeContainer>
  );
};

export default HomePage;