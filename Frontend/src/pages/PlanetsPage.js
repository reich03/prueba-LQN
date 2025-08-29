import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { 
  Globe, 
  Users, 
  Film, 
  Mountain,
  Eye
} from 'lucide-react';
import { GET_ALL_PLANETS } from '../graphql/queries';

const PageContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled(motion.h1)`
  font-family: ${props => props.theme.fonts.primary};
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const PlanetGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const PlanetCard = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(26, 26, 46, 0.8) 0%, 
    rgba(22, 33, 62, 0.8) 100%
  );
  backdrop-filter: blur(15px);
  border: 2px solid ${props => props.theme.colors.primary}30;
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent 30%, ${props => props.theme.colors.primary}10 50%, transparent 70%);
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

const PlanetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PlanetIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px ${props => props.theme.colors.primary}40;
`;

const PlanetName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  font-family: ${props => props.theme.fonts.primary};
`;

const ClimateTag = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const PlanetDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex: 1;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 0.9rem;
`;

const TerrainSection = styled.div`
  grid-column: 1 / -1;
  margin-top: 0.5rem;
`;

const TerrainTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const TerrainTag = styled.span`
  background: rgba(255, 107, 53, 0.2);
  color: ${props => props.theme.colors.accent};
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const PlanetStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.primary}30;
  margin-top: auto;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const ViewButton = styled(motion.button)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: ${props => props.theme.colors.secondary};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px ${props => props.theme.colors.primary}40;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid ${props => props.theme.colors.primary}30;
  border-top: 3px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const PlanetsPage = () => {
  const { data, loading, error } = useQuery(GET_ALL_PLANETS, {
    variables: { first: 30 }
  });

  const planets = data?.allPlanets?.edges?.map(edge => edge.node) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const formatPopulation = (population) => {
    if (!population || population === 'unknown') return 'Unknown';
    const num = parseInt(population);
    if (isNaN(num)) return population;
    return num.toLocaleString();
  };

  const parseTerrain = (terrain) => {
    if (!terrain) return [];
    return terrain.split(',').map(t => t.trim()).filter(t => t);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Globe size={64} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>Error loading planets</h3>
          <p>Please try again later.</p>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header>
        <Title
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          Planets
        </Title>
      </Header>

      {planets.length === 0 ? (
        <EmptyState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Globe size={64} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No planets found</h3>
          <p>The galaxy seems empty today.</p>
        </EmptyState>
      ) : (
        <PlanetGrid variants={containerVariants}>
          <AnimatePresence>
            {planets.map((planet, index) => (
              <PlanetCard
                key={planet.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <PlanetHeader>
                  <PlanetIcon>
                    <Globe size={30} color="#000" />
                  </PlanetIcon>
                  <div>
                    <PlanetName>{planet.name}</PlanetName>
                    {planet.climate && (
                      <ClimateTag>{planet.climate}</ClimateTag>
                    )}
                  </div>
                </PlanetHeader>

                <PlanetDetails>
                  <DetailItem>
                    <DetailLabel>Diameter</DetailLabel>
                    <DetailValue>
                      {planet.diameter ? `${parseInt(planet.diameter).toLocaleString()} km` : 'Unknown'}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Population</DetailLabel>
                    <DetailValue>{formatPopulation(planet.population)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Gravity</DetailLabel>
                    <DetailValue>{planet.gravity || 'Unknown'}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Orbital Period</DetailLabel>
                    <DetailValue>
                      {planet.orbitalPeriod ? `${planet.orbitalPeriod} days` : 'Unknown'}
                    </DetailValue>
                  </DetailItem>
                  
                  {planet.terrain && (
                    <TerrainSection>
                      <DetailLabel>
                        <Mountain size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Terrain
                      </DetailLabel>
                      <TerrainTags>
                        {parseTerrain(planet.terrain).map((terrain, idx) => (
                          <TerrainTag key={idx}>{terrain}</TerrainTag>
                        ))}
                      </TerrainTags>
                    </TerrainSection>
                  )}
                </PlanetDetails>

                <PlanetStats>
                  <div>
                    <StatItem>
                      <Users size={16} />
                      {planet.residentCount || 0} residents
                    </StatItem>
                    <StatItem style={{ marginTop: '0.5rem' }}>
                      <Film size={16} />
                      {planet.filmCount || 0} films
                    </StatItem>
                  </div>
                  
                  <ViewButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye size={16} />
                    View
                  </ViewButton>
                </PlanetStats>
              </PlanetCard>
            ))}
          </AnimatePresence>
        </PlanetGrid>
      )}
    </PageContainer>
  );
};

export default PlanetsPage;