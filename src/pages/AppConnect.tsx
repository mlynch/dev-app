import React, { useEffect, useState } from 'react';
import { IonPage, IonButton, IonToolbar, IonModal, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput } from '@ionic/react';
import styled from 'styled-components'

import { AppContext } from '../State';
import { AppConnectOptions } from '../models';

interface Props {
  isOpen: boolean;
  handleDismiss: () => void;
  handleConnect: (options: AppConnectOptions) => void;
}

export const AppConnect: React.FC<Props> = ({ isOpen, handleDismiss, handleConnect }) => {
  const [ url, setUrl ] = useState('http://localhost:3333');

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={handleDismiss}
    >
      <IonToolbar>
        <IonTitle>Connect to App</IonTitle>
      </IonToolbar>
      <IonContent>
        <form onSubmit={(e) => { e.preventDefault(); handleConnect({ url })}}>
          <IonList>
            <IonItem>
              <IonLabel>URL</IonLabel>
              <IonInput type="text" value={url} onInput={(e: any) => setUrl(e.target.value)} placeholder="URL to connect to" />
            </IonItem>
          </IonList>
          <IonButton expand="block" type="submit">
            Connect
          </IonButton>
        </form>
      </IonContent>
    </IonModal>
  );
}