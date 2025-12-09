import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const SALEOR_API_URL =
  import.meta.env.VITE_SALEOR_API_URL || 'http://vendor1.localhost:8000/graphql/';

const httpLink = createHttpLink({
  uri: SALEOR_API_URL,
  // credentials: 'include', // enable later only if you *really* need cookies
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth_token');
  const csrfToken = localStorage.getItem('csrf_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'X-CSRFToken': csrfToken || '',
      'Content-Type': 'application/json',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }: any) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error('[Network error]:', networkError);

    // For CORS failures, this is usually a TypeError: Failed to fetch
    if (networkError?.message?.includes('Failed to fetch')) {
      console.error('Possible CORS error: check backend CORS_ALLOWED_ORIGINS and credentials.');
    }
  }
});

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;
