import React, { useEffect } from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonApp, IonSplitPane, IonPage } from '@ionic/react';
import { Route, Redirect, Router, Switch } from 'react-router';

import { AppContext } from '../State';

export const AppRunPage: React.SFC = () => {
  const { state, dispatch } = React.useContext(AppContext);

  return (
    <IonPage>
    </IonPage>
  );
}
