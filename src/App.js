import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import "./scss/style.scss";
import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { useTranslation, withTranslation } from "react-i18next";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const App = () => {
  const { t } = useTranslation();

  return (
    <HashRouter>
      <React.Suspense fallback={loading}>
        <Switch>
          <Route
            exact
            path="/login"
            name={`${"login"} ${t("page")}`}
            render={(props) => <Login {...props} />}
          />
          <Route
            exact
            path="/register"
            name={`${t("register")} ${t("page")}`}
            render={(props) => <Register {...props} />}
          />
          <Route
            exact
            path="/404"
            name={`${t("page")} 404`}
            render={(props) => <Page404 {...props} />}
          />
          <Route
            exact
            path="/500"
            name={`${t("page")} 500`}
            render={(props) => <Page500 {...props} />}
          />
          <Route
            path="/"
            name={t("home")}
            render={(props) =>
              (() => {
                const token = localStorage.getItem("orgAdmin")
                  ? JSON.parse(localStorage.getItem("orgAdmin")).token
                  : undefined;
                if (!token) return <Login {...props} />;
                const client = new ApolloClient({
                  link: new WebSocketLink({
                    uri: "wss://to-safe-cylfx2abya-ew.a.run.app/v1/graphql",
                    options: {
                      reconnect: true,
                      timeout: 600000,
                      connectionParams: {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          // "x-hasura-admin-secret": "tosafe#5@2026567WEhgfg",
                        },
                      },
                    },
                  }),
                  cache: new InMemoryCache(),
                });

                return (
                  <ApolloProvider client={client}>
                    <TheLayout {...props} />
                  </ApolloProvider>
                );
              })()
            }
          />
        </Switch>
      </React.Suspense>
    </HashRouter>
  );
};

export default withTranslation()(App);
