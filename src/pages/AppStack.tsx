import React, { useEffect } from 'react';
import { IonRouterOutlet, IonPage } from '@ionic/react';
import { Route, Redirect } from 'react-router';

import { AppContext } from '../State';
import { AppChoosePage } from './AppChoose';

import { Plugins, NetworkStatus } from '@capacitor/core';
import { ActionTypes } from '../actions';

export const AppStack: React.SFC = () => {
  const { dispatch } = React.useContext(AppContext);

  useEffect(() => {
    const { Network } = Plugins;

    const setStatus = (status: NetworkStatus) => {
      console.log('Setting network status', status);
      dispatch({
        type: ActionTypes.SetNetworkStatus,
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
  }, [dispatch]);

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path="/" component={AppChoosePage} />
        <Redirect from="*" to="/" />
      </IonRouterOutlet>
    </IonPage>
  );
}
