import { gql } from '@apollo/client';

export const CREATE_PERSON = gql`
  mutation CreatePerson(
    $name: String!
    $height: String
    $mass: String
    $hairColor: String
    $skinColor: String
    $eyeColor: String
    $birthYear: String
    $gender: String
    $homeworldId: String
  ) {
    createPerson(
      name: $name
      height: $height
      mass: $mass
      hairColor: $hairColor
      skinColor: $skinColor
      eyeColor: $eyeColor
      birthYear: $birthYear
      gender: $gender
      homeworldId: $homeworldId
    ) {
      success
      errors
      person {
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
  }
`;

export const CREATE_PLANET = gql`
  mutation CreatePlanet(
    $name: String!
    $rotationPeriod: String
    $orbitalPeriod: String
    $diameter: String
    $climate: String
    $gravity: String
    $terrain: String
    $surfaceWater: String
    $population: String
  ) {
    createPlanet(
      name: $name
      rotationPeriod: $rotationPeriod
      orbitalPeriod: $orbitalPeriod
      diameter: $diameter
      climate: $climate
      gravity: $gravity
      terrain: $terrain
      surfaceWater: $surfaceWater
      population: $population
    ) {
      success
      errors
      planet {
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
      }
    }
  }
`;

export const CREATE_FILM = gql`
  mutation CreateFilm(
    $title: String!
    $episodeId: Int!
    $openingCrawl: String!
    $director: String!
    $producer: String!
    $releaseDate: String!
    $planetIds: [String]
    $characterIds: [String]
  ) {
    createFilm(
      title: $title
      episodeId: $episodeId
      openingCrawl: $openingCrawl
      director: $director
      producer: $producer
      releaseDate: $releaseDate
      planetIds: $planetIds
      characterIds: $characterIds
    ) {
      success
      errors
      film {
        id
        title
        episodeId
        openingCrawl
        director
        producer
        releaseDate
        planets {
          edges {
            node {
              id
              name
            }
          }
        }
        characters {
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
`;