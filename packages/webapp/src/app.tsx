/*
 *    Copyright [2021] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */
import React, { ReactElement, Suspense, useEffect } from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { Route, Routes, BrowserRouter as Router, useNavigate } from 'react-router-dom';
import ForgotPasswordSuccessPage from './components/forgot-password-success-page';
import RegistationPage from './components/registration-page';
import LoginPage from './components/login-page';
import store from './redux/store';
import { ForgotPasswordPage } from './components/forgot-password-page';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from './theme';
import AppI18n, { Locales } from './classes/app-i18n';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import ReactGA from 'react-ga4';
import AppConfig from './classes/app-config';
import RegistrationSuccessPage from './components/registration-success-page';
import { ThemeProvider } from '@emotion/react';
import RegistrationCallbackPage from './components/registration-callback';
import ErrorPage from './components/error-page';
import { useStyles } from './style';

const EditorPage = React.lazy(() => import('./components/editor-page'));
const MapsPage = React.lazy(() => import('./components/maps-page'));

// Google Analytics Initialization.
const trackingId = AppConfig.getGoogleAnalyticsAccount();
if (trackingId) {
  ReactGA.initialize([
    {
      trackingId: trackingId,
    },
  ]);
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      staleTime: 5 * 1000 * 60, // 10 minutes
    },
  },
});

// eslint-disable-next-line react/prop-types
function Redirect({ to }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
}

const App = (): ReactElement => {
  const locale = AppI18n.getDefaultLocale();
  const overwriteView = window.errorMvcView;

  const classes = useStyles();

  const defineHeaderAndFooter = () => {
    const extendedUportalHeaderScript = document.createElement('script');
    extendedUportalHeaderScript.setAttribute('src', '/commun/extended-uportal-header.min.js');
    document.head.appendChild(extendedUportalHeaderScript);
    const extendedUportalFooterScript = document.createElement('script');
    extendedUportalFooterScript.setAttribute('src', '/commun/extended-uportal-footer.min.js');
    document.head.appendChild(extendedUportalFooterScript);
  };

  defineHeaderAndFooter();
  const domain = window.location.hostname;

  // This is a hack to move error handling on Spring MVC.
  return locale.message ? (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider
          locale={locale.code}
          defaultLocale={Locales.EN.code}
          messages={locale.message as Record<string, string>}
        >
          <StyledEngineProvider injectFirst>
            <MuiThemeProvider theme={theme}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <div css={classes.root}>
                  <header css={classes.header}>
                    <extended-uportal-header
                      domain={domain}
                      service-name="WiseMapping"
                      context-api-url="/portail"
                      sign-out-url="/portail/Logout"
                      default-org-logo-path="/annuaire_images/default_banner_v1.jpg"
                      default-avatar-path="/images/icones/noPictureUser.svg"
                      default-org-icon-path="/images/partners/netocentre-simple.svg"
                      favorite-api-url="/portail/api/layout"
                      layout-api-url="/portail/api/v4-3/dlm/layout.json"
                      organization-api-url="/change-etablissement/rest/v2/structures/structs/"
                      portlet-api-url="/portail/api/v4-3/dlm/portletRegistry.json?category=All%20categories"
                      user-info-api-url="/portail/api/v5-1/userinfo?claims=private,name,ESCOSIRENCourant,ESCOSIREN&groups="
                      user-info-portlet-url="/portail/p/ESCO-MCE"
                      session-api-url="/portail/api/session.json"
                      template-api-path="/commun/portal_template_api.tpl.json"
                      switch-org-portlet-url="/portail/p/etablissement-swapper"
                      favorites-portlet-card-size="small"
                      grid-portlet-card-size="auto"
                      hide-action-mode="never"
                      show-favorites-in-slider="true"
                      return-home-title="Aller à l'accueil"
                      return-home-target="_self"
                      icon-type="nine-square"
                    />
                  </header>
                  <main css={classes.main}>
                    {!overwriteView ? (
                      <Router>
                        <Routes>
                          <Route path="/" element={<Redirect to="/c/login" />} />
                          <Route path="/c/login" element={<LoginPage />} />
                          {/* <Route path="/c/registration" element={<RegistationPage />} /> */}
                          {/* <Route
                            path="/c/registration-google"
                            element={<RegistrationCallbackPage />}
                          /> */}
                          {/* <Route
                            path="/c/registration-success"
                            element={<RegistrationSuccessPage />}
                          /> */}
                          {/* <Route path="/c/forgot-password" element={<ForgotPasswordPage />} /> */}
                          {/* <Route
                            path="/c/forgot-password-success"
                            element={<ForgotPasswordSuccessPage />}
                          /> */}
                          <Route
                            path="/c/maps/"
                            element={
                              <Suspense
                                fallback={
                                  <div>
                                    <FormattedMessage
                                      id="dialog.loading"
                                      defaultMessage="Loading ..."
                                    />
                                  </div>
                                }
                              >
                                <MapsPage />
                              </Suspense>
                            }
                          />
                          <Route
                            path="/c/maps/:id/edit"
                            element={
                              <Suspense
                                fallback={
                                  <div>
                                    <FormattedMessage
                                      id="dialog.loading"
                                      defaultMessage="Loading ..."
                                    />
                                  </div>
                                }
                              >
                                <EditorPage isTryMode={false} />
                              </Suspense>
                            }
                          />
                          {/* <Route
                            path="/c/maps/:id/try"
                            element={
                              <Suspense
                                fallback={
                                  <div>
                                    <FormattedMessage
                                      id="dialog.loading"
                                      defaultMessage="Loading ..."
                                    />
                                  </div>
                                }
                              >
                                <EditorPage isTryMode={true} />
                              </Suspense>
                            }
                          /> */}
                        </Routes>
                      </Router>
                    ) : (
                      <Router>
                        <ErrorPage isSecurity={overwriteView === 'securityError'} />
                      </Router>
                    )}
                  </main>
                  <footer>
                    <extended-uportal-footer
                      domain={domain}
                      template-api-path="/commun/portal_template_api.tpl.json"
                    />
                  </footer>
                </div>
              </ThemeProvider>
            </MuiThemeProvider>
          </StyledEngineProvider>
        </IntlProvider>
      </QueryClientProvider>
    </Provider>
  ) : (
    <div>
      <FormattedMessage id="dialog.loading" defaultMessage="Loading ..." />
    </div>
  );
};

export default App;
