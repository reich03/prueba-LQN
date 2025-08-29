import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:8000/graphql/',
  credentials: 'same-origin',
});

const authLink = setContext((_, { headers }) => {
  // Si implementas JWT más tarde, descomenta esto:
  // const token = localStorage.getItem('authToken');
  return {
    headers: {
      ...headers,
      // Si Django requiere CSRF, podrías agregarlo aquí:
      // 'X-CSRFToken': getCookie('csrftoken'),
      // authorization: token ? `JWT ${token}` : "",
    }
  }
});

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          allPeople: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          allFilms: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          allPlanets: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});