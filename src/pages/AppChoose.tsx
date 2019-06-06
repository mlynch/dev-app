import React, { useState, useCallback } from 'react';
import { IonPage, IonButton, IonList, IonItem, IonAvatar, IonLabel, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonMenuButton, IonSpinner } from '@ionic/react';
import styled from 'styled-components'

import { AppContext } from '../State';
import { AppConnect } from './AppConnect';
import { AppConnectOptions } from '../models';

import { Plugins } from '@capacitor/core';

const { CapacitorView } = Plugins;

export const AppChoosePage: React.SFC = () => {
  const { state, dispatch } = React.useContext(AppContext);

  const [ showAppConnect, setShowAppConnect ] = useState(false);

  const connectToApp = useCallback((options: AppConnectOptions) => {
    console.log('Connecting to app', options);
    CapacitorView.open({
      url: options.url
    });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle></IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={() => setShowAppConnect(true)}>
              <IonIcon name="add" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent padding>
        <h2>Apps</h2>

        <h4>Instructions</h4>
        <IonList>
          <IonItem>
            <IonAvatar>
            </IonAvatar>
            <IonLabel>Enable &amp; connect to Wi-Fi</IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar>
            </IonAvatar>
            <IonLabel>Connect computer to same network</IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar>
            </IonAvatar>
            <IonLabel>Run <code>ionic serve -c</code></IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar>
            </IonAvatar>
            <IonLabel>Allow app to build</IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar>
            </IonAvatar>
            <IonLabel>Preview &amp; enjoy</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
      <AppListening>
        <div>
          Listening for apps...
        </div>
        <IonSpinner name="lines" />
      </AppListening>
      <AppConnect
        isOpen={showAppConnect}
        handleConnect={connectToApp}
        handleDismiss={() => setShowAppConnect(false)} />
    </IonPage>
  );
}

const AppListening = styled.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  background-color: #27323F;
  border-radius: 12px;

  div {
    flex: 1;
  }
`;
const ChooseMessage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
