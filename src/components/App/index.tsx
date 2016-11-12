import * as React from 'react';

import AnalysisResultsViewer from 'components/AnalysisResultsViewer/connected';
import AnalysisSelector from 'components/AnalysisSelector/connected';
import AnalysisStepper from 'components/AnalysisStepper/connected';
import CephaloCanvasContainer from 'components/CephaloCanvasContainer/connected';
import CommandPalette from 'components/CommandPalette/connected';
import CompatibilityChecker from 'components/CompatibilityChecker/connected';
import Menu from 'components/Menu/connected';
import Toolbar from 'components/Toolbar/connected';
import Progress from './Progress';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as cx from 'classnames';

import injectTapEventPlugin from 'react-tap-event-plugin';

import attempt from 'lodash/attempt';
import identity from 'lodash/identity';

import { compose, lifecycle, pure, branch, renderComponent } from 'recompose';

import Props from './props';

attempt(injectTapEventPlugin);

type State = { };

const classes = require('./style.scss');

const addLifeCycleHooks = lifecycle({
  componentDidMount(this: React.Component<Props, { }>) {
    this.props.onComponentMount();
  },
});

const showSpinner = branch(
  ({ isReady }: Props) => !isReady,
  renderComponent(Progress),
  identity,
);

const enhance = compose<Props, State>(pure, addLifeCycleHooks, showSpinner);

const App = enhance(({ isSummaryShown = false, shouldShowStepper = false }: Props) => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <div className={classes.root}>
      <CommandPalette className={classes.command_palette} />
      <AnalysisResultsViewer open={isSummaryShown} />
      <CompatibilityChecker />
      <div className={classes.container}>
        <Menu className={classes.menu} />
        <div className={classes.row}>
          <CephaloCanvasContainer className={classes.main} />
          <div className={cx(classes.sidebar, { [classes.sidebar_hidden]: !shouldShowStepper })}>
            <AnalysisSelector className={classes.selector} />
            <AnalysisStepper className={classes.stepper} />
          </div>
        </div>
        <Toolbar className={classes.toolbar} />
      </div>
    </div>
  </MuiThemeProvider>
));

export default App as React.ComponentClass<Props>;
