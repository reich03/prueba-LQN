import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import {
  Film,
  Calendar,
  User,
  Globe,
  Eye
} from 'lucide-react';
import { GET_ALL_FILMS } from '../graphql/queries';

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

const FilmGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FilmCard = styled(motion.div)`
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

const FilmHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const EpisodeNumber = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.secondary};
  box-shadow: 0 0 20px ${props => props.theme.colors.primary}40;
`;

const FilmTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  font-family: ${props => props.theme.fonts.primary};
`;

const ReleaseDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const OpeningCrawl = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-style: italic;
`;

const FilmDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
`;

const FilmStats = styled.div`
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

const ViewButton = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: ${props => props.theme.colors.secondary};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

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

const FilmsPage = () => {
  const { data, loading, error } = useQuery(GET_ALL_FILMS, {
    variables: { first: 20 }
  });

  const films = data?.allFilms?.edges?.map(edge => edge.node) || [];

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

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
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
          <Film size={64} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>Error loading films</h3>
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
          Films
        </Title>
      </Header>

      {films.length === 0 ? (
        <EmptyState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Film size={64} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No films found</h3>
          <p>The galaxy seems empty today.</p>
        </EmptyState>
      ) : (
        <FilmGrid variants={containerVariants}>
          <AnimatePresence>
            {films.map((film, index) => (
              <FilmCard
                key={film.id}
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
                <FilmHeader>
                  <EpisodeNumber>
                    {film.episodeId}
                  </EpisodeNumber>
                  <div>
                    <FilmTitle>{film.title}</FilmTitle>
                    <ReleaseDate>
                      <Calendar size={16} />
                      {formatDate(film.releaseDate)}
                    </ReleaseDate>
                  </div>
                </FilmHeader>

                <OpeningCrawl>
                  {film.openingCrawl}
                </OpeningCrawl>

                <FilmDetails>
                  <DetailItem>
                    <DetailLabel>Director</DetailLabel>
                    <DetailValue>{film.director}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Producer</DetailLabel>
                    <DetailValue>{film.producer}</DetailValue>
                  </DetailItem>
                </FilmDetails>

                <FilmStats>
                  <div>
                    <StatItem>
                      <User size={16} />
                      {film.characterCount || 0} characters
                    </StatItem>
                    <StatItem style={{ marginTop: '0.5rem' }}>
                      <Globe size={16} />
                      {film.planetCount || 0} planets
                    </StatItem>
                  </div>

                  {/* <ViewButton
                    to={`/films/${film.id}`}
                    onClick={(e) => {
                      console.log(`View button clicked for film id: ${film.id}`);
                    }}
                  >
                    <Eye size={16} />
                    View
                  </ViewButton> */}
                  <a
                    href={`/films/${film.id}`}
                    style={{
                      textDecoration: 'none',
                      zIndex: 1000000,
                      background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <Eye size={16} />
                    View
                  </a>

              </FilmStats>
              </FilmCard>
            ))}
        </AnimatePresence>
        </FilmGrid>
  )
}
    </PageContainer >
  );
};

export default FilmsPage;