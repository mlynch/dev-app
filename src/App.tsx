import React from 'react';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import { IonPage, IonApp, IonSplitPane } from '@ionic/react';
import { Route, Redirect, Switch, withRouter, RouteComponentProps } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import { AppContextProvider } from './State';
import { AppStack } from './pages/AppStack';
import Menu from './components/Menu';

const App: React.FC = () => {
  return (
  <AppContextProvider>
    <Router>
      <div id="app">
        <IonApp>
          <IonSplitPane contentId="main">
            <Menu />
            <IonPage id="main">
              <Switch>
                <Route path="/" component={AppStack} />
              </Switch>
            </IonPage>
          </IonSplitPane>
        </IonApp>
      </div>
    </Router>
  </AppContextProvider>
  )
}

export default App;