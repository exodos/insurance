import "@/styles/globals.css";
import type { AppProps } from "next/app";
import axios from "axios";
import useSWR from "swr";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { Router, useRouter } from "next/router";
import { useApollo } from "../lib/apollo";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { NotificationContextProvider } from "@/store/notification-context";
import Head from "next/head";
import MainSignInLayout from "../components/layout/main-signin-layout";
import MainLayout from "@/components/layout/main-layout";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({
      Component,
      pageProps: { session, ...pageProps },
    }) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const router = useRouter();

  return (
    <ApolloProvider client={apolloClient}>
      <SessionProvider
        session={session}
        refetchInterval={5 * 60}
        refetchOnWindowFocus={true}
      >
        <NotificationContextProvider>
          {router.pathname.startsWith("/auth/signin") ||
          router.pathname.startsWith("/auth/force-reset") ? (
            <MainSignInLayout>
              <Head>
                <title>Third Party Insurance Management System</title>
                <meta
                  name="description"
                  content="Third Party Insurance Management System"
                />
                <meta
                  name="viewport"
                  content="initial-scale=1.0, width=device-width"
                />
              </Head>
              <Component {...pageProps} />
            </MainSignInLayout>
          ) : (
            <MainLayout>
              <Head>
                <title>Third Party Insurance Management System</title>
                <meta
                  name="description"
                  content="Third Party Insurance Management System"
                />
                <meta
                  name="viewport"
                  content="initial-scale=1.0, width=device-width"
                />
              </Head>
              <Component {...pageProps} />
            </MainLayout>
          )}
        </NotificationContextProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
