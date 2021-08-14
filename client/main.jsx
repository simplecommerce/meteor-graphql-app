import React from 'react';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/App';
import { onPageLoad } from 'meteor/server-render';  
import { hydrate } from 'react-dom';

import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink } from '@apollo/client';
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { getMainDefinition } from "@apollo/client/utilities";

// clears cache for specified root queries when mutations occur
const invalidateCacheMiddleware = new ApolloLink((operation, forward) => {
  // forward the operation and process the response
	return forward(operation).map(response => {
    const operationDefinition = getMainDefinition(operation.query);
    
    // only runs when a mutation type
    if (operationDefinition.operation === "mutation") {
      const context = operation.getContext();
      
      // clear cache for specified query
      context.cache.evict({ id: "ROOT_QUERY", fieldName: "getProjects" });
      
      // this ensures that any unreachable items are removed
      context.cache.gc();
    }
    
    return response;
  });
});


const client = new ApolloClient({
  link: new ApolloLink.from([invalidateCacheMiddleware, new BatchHttpLink({
    uri: "http://localhost:4000",
  })]),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  // no network requests will be sent upon initial render since they are queried and provided by SSR
  // if this is commented we will see network requests on client side on initial render
  ssrForceFetchDelay: 100,  // this seems to be only useful if `network-only` and `cache-and-network`
  assumeImmutableResults: true,
  // defaultOptions: {
  //     watchQuery: {
  //         fetchPolicy: 'cache-and-network',
  //     },
  // },
});

Meteor.startup(() => {
  onPageLoad(() => hydrate(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('react-target')));
});
