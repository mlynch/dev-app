import React, { useEffect } from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonApp, IonSplitPane, IonPage } from '@ionic/react';
import { Route, Redirect, Router, Switch } from 'react-router';

import { AppContext } from '../State';
import { AppChoosePage } from './AppChoose';

import { Plugins, NetworkStatus } from '@capacitor/core';
import { ActionTypes } from '../actions';

export const AppStack: React.SFC = () => {
  const { state, dispatch } = React.useContext(AppContext);

  useEffect(() => {
    const { Network } = Plugins;

    const setStatus = (status: NetworkStatus) => {
      console.log('Setting network status', status);
      dispatch({
        type: ActionTypes.SET_NETWORK_STATUS,
        status
      })
    }

    async function checkNetwork() {
      setStatus(await Network.getStatus());
    }

    const handle = Network.addListener('networkStatusChange', (status: NetworkStatus) => {
      console.log('network status change!', status);
      setStatus(status);
    });

    checkNetwork();

    return () => {
      handle.remove();
    }
  }, []);

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path="/" component={AppChoosePage} />
        <Redirect from="*" to="/" />
      </IonRouterOutlet>
    </IonPage>
  );
}
