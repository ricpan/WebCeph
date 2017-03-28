import * as React from 'react';

import VerticalTabBar from 'components/VerticalTabBar/connected';
import Workspace from 'components/Workspace/connected';
import Settings from 'components/Settings/connected';

import { Route, Link } from 'react-router-dom';

import Progress from './Progress';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

import attempt from 'lodash/attempt';

import { compose, lifecycle, pure } from 'recompose';

import { IntlProvider } from 'react-intl';

import { getDirForLocale } from 'utils/locale';

import Props from './props';

attempt(injectTapEventPlugin);

type State = { };

const classes = require('./style.scss');

const addLifeCycleHooks = lifecycle({
  componentDidMount(this: React.Component<Props, { }>) {
    this.props.onComponentMount();
  },
  componentDidUpdate(this: React.Component<Props, { }>) {
    this.props.onComponentUpdate();
  },
});

const enhance = compose<Props, State>(pure, addLifeCycleHooks);

import { HotKeys } from 'react-hotkeys';
import Helmet from 'react-helmet';

const App = enhance(({
  isReady, keyMap, handlers,
  shouldShowWorkspaceSwitcher,
  activeWorkspaceId,
  title,
  locale, messages,
}: Props) => (
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      { isReady ? (
          <IntlProvider key={locale} defaultLocale="en" locale={locale} messages={messages}>
            <HotKeys keyMap={keyMap} handlers={handlers}>
              <Helmet
                htmlAttributes={{
                  lang: locale,
                  dir: getDirForLocale(locale),
                }}
                title={title !== null ? `${title} - WebCeph` : 'WebCeph'}
              />
              <div className={classes.root}>
                <div className={classes.container}>
                  <div className={classes.row}>
                    {shouldShowWorkspaceSwitcher ? (
                      <VerticalTabBar
                        className={classes.tab_bar}
                      />
                    ) : null}
                    <Workspace className={classes.workspace} workspaceId={activeWorkspaceId} />
                  </div>
                  <Link to="/settings">Settings</Link>
                </div>
                <Route path="/settings" component={Settings} />
              </div>
            </HotKeys>
          </IntlProvider>
        ) : (
          <div className={classes.root_loading}>
            <Progress />
          </div>
        )
      }
    </MuiThemeProvider>
));

export default App as React.ComponentClass<Props>;
