import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  User, 
  MapPin, 
  Film, 
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { GET_ALL_PEOPLE, SEARCH_PEOPLE } from '../graphql/queries';
import { debounce } from 'lodash';

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

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
  }
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

const SearchSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
  }
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
  padding: 0.75rem 1rem 0.75rem 3rem;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  width: 300px;
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
    width: 100%;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  z-index: 1;
`;

const FilterButton = styled(motion.button)`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid ${props => props.theme.colors.primary}50;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}20;
  }
`;

const CharacterGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
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
  padding: 2rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;

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

const CharacterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CharacterAvatar = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px ${props => props.theme.colors.primary}40;
`;

const CharacterName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const CharacterGender = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
`;

const CharacterDetails = styled.div`
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

const CharacterStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.primary}30;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const ViewButton = styled(Link)`
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

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px ${props => props.theme.colors.primary}40;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PaginationButton = styled(motion.button)`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid ${props => props.theme.colors.primary}50;
  border-radius: 50px;
  padding: 0.75rem 1.5rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  disabled: ${props => props.disabled};

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const CharactersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: allPeopleData, loading: allPeopleLoading } = useQuery(GET_ALL_PEOPLE, {
    variables: { first: 50 },
    skip: searchTerm.length > 0
  });

  const { data: searchData, loading: searchLoading } = useQuery(SEARCH_PEOPLE, {
    variables: { name: searchTerm },
    skip: !searchTerm
  });

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    [debounce]
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const characters = searchTerm 
    ? searchData?.searchPeople || []
    : allPeopleData?.allPeople?.edges?.map(edge => edge.node) || [];

  const totalPages = Math.ceil(characters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCharacters = characters.slice(startIndex, startIndex + itemsPerPage);

  const loading = searchTerm ? searchLoading : allPeopleLoading;

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
          Characters
        </Title>

        <SearchSection>
          <SearchContainer>
            <SearchIcon size={20} />
            <SearchInput
              type="text"
              placeholder="Search characters..."
              onChange={handleSearchChange}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
          </SearchContainer>

          <FilterButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Filter size={20} />
            Filter
          </FilterButton>
        </SearchSection>
      </Header>

      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      ) : paginatedCharacters.length === 0 ? (
        <EmptyState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <User size={64} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No characters found</h3>
          <p>Try adjusting your search terms or filters.</p>
        </EmptyState>
      ) : (
        <>
          <CharacterGrid variants={containerVariants}>
            <AnimatePresence>
              {paginatedCharacters.map((character, index) => (
                <CharacterCard
                  key={character.id}
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
                  <CharacterHeader>
                    <CharacterAvatar>
                      <User size={30} color="#000" />
                    </CharacterAvatar>
                    <div>
                      <CharacterName>{character.name}</CharacterName>
                      {character.gender && (
                        <CharacterGender>{character.gender}</CharacterGender>
                      )}
                    </div>
                  </CharacterHeader>

                  <CharacterDetails>
                    <DetailItem>
                      <DetailLabel>Height</DetailLabel>
                      <DetailValue>{character.height || 'Unknown'} cm</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Mass</DetailLabel>
                      <DetailValue>{character.mass || 'Unknown'} kg</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Birth Year</DetailLabel>
                      <DetailValue>{character.birthYear || 'Unknown'}</DetailValue>
                    </DetailItem>
                    <DetailItem>
                      <DetailLabel>Eye Color</DetailLabel>
                      <DetailValue>{character.eyeColor || 'Unknown'}</DetailValue>
                    </DetailItem>
                  </CharacterDetails>

                  <CharacterStats>
                    <div>
                      <StatItem>
                        <MapPin size={16} />
                        {character.homeworld?.name || 'Unknown'}
                      </StatItem>
                      <StatItem style={{ marginTop: '0.5rem' }}>
                        <Film size={16} />
                        {character.filmCount || 0} films
                      </StatItem>
                    </div>
                    
                    <ViewButton 
                      to={`/characters/${character.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye size={16} />
                      View
                    </ViewButton>
                  </CharacterStats>
                </CharacterCard>
              ))}
            </AnimatePresence>
          </CharacterGrid>

          {totalPages > 1 && (
            <Pagination>
              <PaginationButton
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
              >
                <ChevronLeft size={20} />
                Previous
              </PaginationButton>

              <span style={{ color: '#cccccc', fontWeight: '500' }}>
                Page {currentPage} of {totalPages}
              </span>

              <PaginationButton
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
              >
                Next
                <ChevronRight size={20} />
              </PaginationButton>
            </Pagination>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default CharactersPage;