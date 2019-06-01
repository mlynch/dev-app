import React, { useEffect } from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonApp, IonSplitPane, IonPage } from '@ionic/react';
import { Route, Redirect, Router, Switch } from 'react-router';

import { AppContext } from '../State';
import { AppRunPage } from './AppRun';
import { AppChoosePage } from './AppChoose';

export const AppStack: React.SFC = () => {
  const { state, dispatch } = React.useContext(AppContext);

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path="/" component={AppChoosePage} />
        <Redirect from="*" to="/" />
      </IonRouterOutlet>
    </IonPage>
  );
}
