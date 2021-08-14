import { Meteor } from 'meteor/meteor';
import React from 'react';
import { LinksCollection } from '/imports/api/links';
import { onPageLoad } from 'meteor/server-render';
import { renderToString } from 'react-dom/server';
import { App } from '/imports/ui/App';
import "./graphql";
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import 'isomorphic-fetch';
import { getDataFromTree } from "@apollo/client/react/ssr";

const client = new ApolloClient({
  link: new BatchHttpLink({
    uri: "http://localhost:4000"
  }),
  cache: new InMemoryCache(),
  ssrMode: true,
  assumeImmutableResults: true,
});

function insertLink({ title, url }) {
  LinksCollection.insert({title, url, createdAt: new Date()});
}

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  if (LinksCollection.find().count() === 0) {
    insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app'
    });

    insertLink({
      title: 'Follow the Guide',
      url: 'http://guide.meteor.com'
    });

    insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com'
    });

    insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com'
    });
  }

    onPageLoad(async sink => {
        console.log('onPageLoad');

        const ProvidedApp = props => <ApolloProvider client={client}><App /></ApolloProvider>;

        // pre-load queries 
        await getDataFromTree(<ProvidedApp />);

        const url = sink.request.url.path;

        // Append the preloaded state to head to send to client
        sink.appendToHead(`<script id="appendToHeadScripts">
          window.__APOLLO_STATE__ = ${JSON.stringify(client.extract()).replace(/</g, '\\u003c')};
        </script>`);

        sink.renderIntoElementById('react-target', renderToString(<ProvidedApp />));
    })
});