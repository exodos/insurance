import "@/styles/globals.css";
import type { AppProps } from "next/app";
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

const MyApp = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const router = useRouter();

  if (
    router.pathname.startsWith("/auth/signin") ||
    router.pathname.startsWith("/auth/force-reset")
  ) {
    return (
      <ApolloProvider client={apolloClient}>
        <SessionProvider
          session={pageProps.session}
          // Re-fetch session every 5 minutes
          refetchInterval={5 * 60}
          // Re-fetches session when window is focused
          refetchOnWindowFocus={true}
        >
          <NotificationContextProvider>
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
          </NotificationContextProvider>
        </SessionProvider>
      </ApolloProvider>
    );
  }
  return (
    <ApolloProvider client={apolloClient}>
      <SessionProvider
        session={pageProps}
        refetchInterval={5 * 60}
        refetchOnWindowFocus={true}
      >
        <NotificationContextProvider>
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
        </NotificationContextProvider>
      </SessionProvider>
    </ApolloProvider>
  );
};

export default MyApp;
