import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { 
  ArrowLeft,
  Film,
  User,
  Globe,
  Calendar,
  Camera,
  Star
} from 'lucide-react';
import { GET_FILM_DETAIL } from '../graphql/queries';

const PageContainer = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  margin-bottom: 2rem;
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.theme.colors.primary}50;
  border-radius: 25px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}20;
  }
`;

const FilmHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const EpisodeNumber = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 2rem;
  color: ${props => props.theme.colors.secondary};
  margin: 0 auto 1rem auto;
  box-shadow: 0 0 30px ${props => props.theme.colors.primary}40;
`;

const FilmTitle = styled.h1`
  font-family: ${props => props.theme.fonts.primary};
  font-size: 3rem;
  font-weight: 900;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const OpeningCrawl = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(26, 26, 46, 0.8) 0%, 
    rgba(22, 33, 62, 0.8) 100%
  );
  backdrop-filter: blur(15px);
  border: 2px solid ${props => props.theme.colors.primary}30;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  font-style: italic;
  line-height: 1.8;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const DetailSection = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(26, 26, 46, 0.8) 0%, 
    rgba(22, 33, 62, 0.8) 100%
  );
  backdrop-filter: blur(15px);
  border: 2px solid ${props => props.theme.colors.primary}30;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-family: ${props => props.theme.fonts.primary};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const DetailItem = styled.div`
  text-align: center;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const DetailValue = styled.div`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const CharacterList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const CharacterCard = styled(motion.div)`
  background: rgba(26, 26, 46, 0.5);
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const PlanetList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const PlanetCard = styled(motion.div)`
  background: rgba(26, 26, 46, 0.5);
  border: 1px solid ${props => props.theme.colors.accent}30;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accent};
    transform: translateY(-2px);
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

const FilmDetailPage = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_FILM_DETAIL, {
    variables: { id }
  });

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

  if (error || !data?.film) {
    return (
      <PageContainer>
        <BackButton to="/films">
          <ArrowLeft size={20} />
          Back to Films
        </BackButton>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2>Film not found</h2>
          <p>The film you're looking for doesn't exist.</p>
        </div>
      </PageContainer>
    );
  }

  const film = data.film;
  const characters = film.characters?.edges?.map(edge => edge.node) || [];
  const planets = film.planets?.edges?.map(edge => edge.node) || [];

  return (
    <PageContainer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <BackButton to="/films">
        <ArrowLeft size={20} />
        Back to Films
      </BackButton>

      <FilmHeader
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <EpisodeNumber>
          {film.episodeId}
        </EpisodeNumber>
        <FilmTitle>{film.title}</FilmTitle>
      </FilmHeader>

      <OpeningCrawl
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        "{film.openingCrawl}"
      </OpeningCrawl>

      <DetailSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <SectionTitle>
          <Film size={24} />
          Film Details
        </SectionTitle>
        
        <DetailGrid>
          <DetailItem>
            <DetailLabel>Release Date</DetailLabel>
            <DetailValue>{formatDate(film.releaseDate)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Director</DetailLabel>
            <DetailValue>{film.director}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Producer</DetailLabel>
            <DetailValue>{film.producer}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Episode</DetailLabel>
            <DetailValue>Episode {film.episodeId}</DetailValue>
          </DetailItem>
        </DetailGrid>
      </DetailSection>

      <DetailSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <SectionTitle>
          <User size={24} />
          Characters ({characters.length})
        </SectionTitle>
        
        <CharacterList>
          {characters.map((character, index) => (
            <CharacterCard
              key={character.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05, duration: 0.4 }}
            >
              <h4>{character.name}</h4>
              {character.homeworld && (
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#cccccc', 
                  marginTop: '0.5rem' 
                }}>
                  from {character.homeworld.name}
                </p>
              )}
            </CharacterCard>
          ))}
        </CharacterList>
      </DetailSection>

      <DetailSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <SectionTitle>
          <Globe size={24} />
          Planets ({planets.length})
        </SectionTitle>
        
        <PlanetList>
          {planets.map((planet, index) => (
            <PlanetCard
              key={planet.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05, duration: 0.4 }}
            >
              <h4>{planet.name}</h4>
              {planet.climate && (
                <p style={{ 
                  fontSize: '0.8rem', 
                  color: '#cccccc',
                  marginTop: '0.5rem' 
                }}>
                  {planet.climate}
                </p>
              )}
              {planet.terrain && (
                <p style={{ 
                  fontSize: '0.8rem', 
                  color: '#ff6b35',
                  marginTop: '0.25rem' 
                }}>
                  {planet.terrain}
                </p>
              )}
            </PlanetCard>
          ))}
        </PlanetList>
      </DetailSection>
    </PageContainer>
  );
};

export default FilmDetailPage;