import { gql } from '@apollo/client';

export const GET_ALL_PEOPLE = gql`
  query GetAllPeople($first: Int, $after: String) {
    allPeople(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          name
          height
          mass
          hairColor
          skinColor
          eyeColor
          birthYear
          gender
          filmCount
          homeworld {
            id
            name
            climate
            terrain
          }
          films {
            edges {
              node {
                id
                title
                episodeId
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_FILMS = gql`
  query GetAllFilms($first: Int, $after: String) {
    allFilms(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          episodeId
          openingCrawl
          director
          producer
          releaseDate
          characterCount
          planetCount
          characters {
            edges {
              node {
                id
                name
              }
            }
          }
          planets {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_PLANETS = gql`
  query GetAllPlanets($first: Int, $after: String) {
    allPlanets(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          name
          rotationPeriod
          orbitalPeriod
          diameter
          climate
          gravity
          terrain
          surfaceWater
          population
          residentCount
          filmCount
          residents {
            edges {
              node {
                id
                name
              }
            }
          }
          films {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_PEOPLE = gql`
  query SearchPeople($name: String) {
    searchPeople(name: $name) {
      id
      name
      height
      mass
      hairColor
      skinColor
      eyeColor
      birthYear
      gender
      filmCount
      homeworld {
        id
        name
      }
    }
  }
`;

export const GET_FILMS_BY_CHARACTER = gql`
  query GetFilmsByCharacter($characterId: String!) {
    filmsByCharacter(characterId: $characterId) {
      id
      title
      episodeId
      openingCrawl
      director
      producer
      releaseDate
    }
  }
`;

export const GET_CHARACTERS_IN_FILM = gql`
  query GetCharactersInFilm($filmId: String!) {
    charactersInFilm(filmId: $filmId) {
      id
      name
      height
      mass
      hairColor
      skinColor
      eyeColor
      birthYear
      gender
      homeworld {
        id
        name
      }
    }
  }
`;

export const GET_PERSON_DETAIL = gql`
  query GetPersonDetail($id: ID!) {
    person(id: $id) {
      id
      name
      height
      mass
      hairColor
      skinColor
      eyeColor
      birthYear
      gender
      filmCount
      homeworld {
        id
        name
        climate
        terrain
        population
      }
      films {
        edges {
          node {
            id
            title
            episodeId
            releaseDate
            director
          }
        }
      }
    }
  }
`;

export const GET_FILM_DETAIL = gql`
  query GetFilmDetail($id: ID!) {
    film(id: $id) {
      id
      title
      episodeId
      openingCrawl
      director
      producer
      releaseDate
      characterCount
      planetCount
      characters {
        edges {
          node {
            id
            name
            homeworld {
              name
            }
          }
        }
      }
      planets {
        edges {
          node {
            id
            name
            climate
            terrain
          }
        }
      }
    }
  }
`;

export const GET_PLANET_DETAIL = gql`
  query GetPlanetDetail($id: ID!) {
    planet(id: $id) {
      id
      name
      rotationPeriod
      orbitalPeriod
      diameter
      climate
      gravity
      terrain
      surfaceWater
      population
      residentCount
      filmCount
      residents {
        edges {
          node {
            id
            name
          }
        }
      }
      films {
        edges {
          node {
            id
            title
            episodeId
          }
        }
      }
    }
  }
`;