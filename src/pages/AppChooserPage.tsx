import React, { useState, useCallback } from 'react';
import { IonPage, IonButton } from '@ionic/react';
import styled from 'styled-components'

import { AppContext } from '../State';
import { AppConnect } from './AppConnect';
import { AppConnectOptions } from '../models';

export const AppChooserPage: React.SFC = () => {
  const { state, dispatch } = React.useContext(AppContext);

  const [ showAppConnect, setShowAppConnect ] = useState(false);

  const connectToApp = useCallback((options: AppConnectOptions) => {
    console.log('Connecting to app', options);
  }, []);

  return (
    <IonPage>
      <ChooseMessage>
        <div>
          <h2>Connect to App</h2>
          <div>
            <IonButton color="primary" onClick={() => setShowAppConnect(true)}>Connect</IonButton>
          </div>
        </div>
      </ChooseMessage>
      <AppConnect
        isOpen={showAppConnect}
        handleConnect={connectToApp}
        handleDismiss={() => setShowAppConnect(false)} />
    </IonPage>
  );
}

const ChooseMessage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
