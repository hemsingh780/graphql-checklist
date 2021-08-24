import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client';
import { ApolloClient , ApolloProvider} from "@apollo/client";

// import ApolloClient from 'apollo-boost';
const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link:new HttpLink(
    {uri:'https://hemfirst.hasura.app/v1/graphql',
      headers:{
        'x-hasura-admin-secret':'BoZg6QhvkRVJ7mT3yo5eygQcrRFhmfs4vFdM7G98vRYdWg13OS9thJcAa7y0mTVV'
      }
     }
  ),
})



ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

