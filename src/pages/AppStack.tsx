import React, { useEffect } from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonApp, IonSplitPane, IonPage } from '@ionic/react';
import { Route, Redirect, Router, Switch } from 'react-router';

import { AppContext } from '../State';
import { AppPreviewPage } from './AppPreviewPage';
import { AppChooserPage } from './AppChooserPage';

export const AppStack: React.SFC = () => {
  const { state, dispatch } = React.useContext(AppContext);

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path="/" component={AppChooserPage} />
        <Redirect from="*" to="/" />
      </IonRouterOutlet>
    </IonPage>
  );
}
