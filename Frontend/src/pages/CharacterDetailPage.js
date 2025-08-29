import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { 
  ArrowLeft,
  User,
  MapPin,
  Film,
  Calendar,
  Ruler,
  Weight
} from 'lucide-react';
import { GET_PERSON_DETAIL } from '../graphql/queries';

const PageContainer = styled(motion.div)`
  max-width: 800px;
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

const CharacterCard = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(26, 26, 46, 0.8) 0%, 
    rgba(22, 33, 62, 0.8) 100%
  );
  backdrop-filter: blur(15px);
  border: 2px solid ${props => props.theme.colors.primary}30;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem auto;
  box-shadow: 0 0 30px ${props => props.theme.colors.primary}40;
`;

const CharacterName = styled.h1`
  font-family: ${props => props.theme.fonts.primary};
  font-size: 2.5rem;
  font-weight: 900;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const DetailCard = styled(motion.div)`
  background: rgba(26, 26, 46, 0.5);
  border: 1px solid ${props => props.theme.colors.primary}30;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const DetailIcon = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.theme.colors.primary}20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const DetailValue = styled.div`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
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

const CharacterDetailPage = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_PERSON_DETAIL, {
    variables: { id }
  });

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error || !data?.person) {
    return (
      <PageContainer>
        <BackButton to="/characters">
          <ArrowLeft size={20} />
          Back to Characters
        </BackButton>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2>Character not found</h2>
          <p>The character you're looking for doesn't exist.</p>
        </div>
      </PageContainer>
    );
  }

  const character = data.person;

  return (
    <PageContainer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <BackButton to="/characters">
        <ArrowLeft size={20} />
        Back to Characters
      </BackButton>

      <CharacterCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Avatar>
          <User size={60} color="#000" />
        </Avatar>
        <CharacterName>{character.name}</CharacterName>

        <DetailGrid>
          <DetailCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <DetailIcon>
              <Ruler size={24} color="#FFD700" />
            </DetailIcon>
            <DetailLabel>Height</DetailLabel>
            <DetailValue>{character.height || 'Unknown'} cm</DetailValue>
          </DetailCard>

          <DetailCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <DetailIcon>
              <Weight size={24} color="#FFD700" />
            </DetailIcon>
            <DetailLabel>Mass</DetailLabel>
            <DetailValue>{character.mass || 'Unknown'} kg</DetailValue>
          </DetailCard>

          <DetailCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <DetailIcon>
              <Calendar size={24} color="#FFD700" />
            </DetailIcon>
            <DetailLabel>Birth Year</DetailLabel>
            <DetailValue>{character.birthYear || 'Unknown'}</DetailValue>
          </DetailCard>

          <DetailCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <DetailIcon>
              <MapPin size={24} color="#FFD700" />
            </DetailIcon>
            <DetailLabel>Homeworld</DetailLabel>
            <DetailValue>{character.homeworld?.name || 'Unknown'}</DetailValue>
          </DetailCard>

          <DetailCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <DetailIcon>
              <Film size={24} color="#FFD700" />
            </DetailIcon>
            <DetailLabel>Films</DetailLabel>
            <DetailValue>{character.filmCount || 0}</DetailValue>
          </DetailCard>

          <DetailCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <DetailIcon>
              <User size={24} color="#FFD700" />
            </DetailIcon>
            <DetailLabel>Gender</DetailLabel>
            <DetailValue>{character.gender || 'Unknown'}</DetailValue>
          </DetailCard>
        </DetailGrid>
      </CharacterCard>
    </PageContainer>
  );
};

export default CharacterDetailPage;