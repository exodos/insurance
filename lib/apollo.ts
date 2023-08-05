import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const link = new HttpLink({
  uri: "http://localhost:3000/api/graphql",
  credentials: "same-origin",
});

// const link = createPersistedQueryLink({
//   sha256,
//   useGETForHashedQueries: true,
// }).concat(
//   new HttpLink({
//     uri: "http://localhost:3000/api/graphql",
//   })
// );

function createApolloClient() {
  return new ApolloClient({
    ssrMode: true,
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            feedCertificate(_, { args, toReference }) {
              return toReference({
                __typename: "FeedCertificate",
                id: args.id,
              });
            },
            feedClaim(_, { args, toReference }) {
              return toReference({
                __typename: "FeedClaim",
                id: args.id,
              });
            },
            feedClaimHitAndRun(_, { args, toReference }) {
              return toReference({
                __typename: "FeedClaimHitAndRun",
                id: args.id,
              });
            },
            feedClaimUnInsured(_, { args, toReference }) {
              return toReference({
                __typename: "FeedClaimUnInsured",
                id: args.id,
              });
            },
            feedHitAndRunPoliceReport(_, { args, toReference }) {
              return toReference({
                __typename: "FeedHitAndRunPoliceReport",
                id: args.id,
              });
            },
            feedInsured(_, { args, toReference }) {
              return toReference({
                __typename: "FeedInsured",
                id: args.id,
              });
            },
            feedInsuredPoliceReport(_, { args, toReference }) {
              return toReference({
                __typename: "FeedInsuredPoliceReport",
                id: args.id,
              });
            },
            feedMembership(_, { args, toReference }) {
              return toReference({
                __typename: "FeedMembership",
                id: args.id,
              });
            },
            feedOrganization(_, { args, toReference }) {
              return toReference({
                __typename: "FeedOrganization",
                id: args.id,
              });
            },
            feedPolicy(_, { args, toReference }) {
              return toReference({
                __typename: "FeedPolicy",
                id: args.id,
              });
            },
            feedTariff(_, { args, toReference }) {
              return toReference({
                __typename: "FeedTariff",
                id: args.id,
              });
            },
            feedUnInsuredPoliceReport(_, { args, toReference }) {
              return toReference({
                __typename: "FeedUnInsuredPoliceReport",
                id: args.id,
              });
            },
            feedUser(_, { args, toReference }) {
              return toReference({
                __typename: "FeedUser",
                id: args.id,
              });
            },
            feedVehicle(_, { args, toReference }) {
              return toReference({
                __typename: "FeedVehicle",
                id: args.id,
              });
            },
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();
  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  if (typeof window === "undefined") return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
