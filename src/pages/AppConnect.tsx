import React, { useState } from 'react';
import { IonButton, IonToolbar, IonModal, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonHeader, IonButtons } from '@ionic/react';

import { DiscoveredService } from '../models';

interface Props {
  isOpen: boolean;
  handleDismiss: () => void;
  handleConnect: (options: DiscoveredService) => void;
}

const makeService = ({ hostname, port, path } : { hostname: string, port: string, path: string }): DiscoveredService => {
  return {
    id: `${hostname}:${port}`,
    name: `${hostname}:${port}`,
    address: hostname,
    hostname,
    port: parseInt(port, 10),
    path
  }
}

export const AppConnect: React.FC<Props> = ({ isOpen, handleDismiss, handleConnect }) => {
  const [ hostname, setHostname ] = useState('localhost');
  const [ port, setPort ] = useState('3333');
  const [ path, setPath ] = useState('/');

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={handleDismiss}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Connect to App</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={_ => handleDismiss()} fill="clear">Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={(e) => { e.preventDefault(); handleConnect(makeService({ hostname, port, path })); handleDismiss()}}>
          <IonList>
            <IonItem>
              <IonLabel>Hostname</IonLabel>
              <IonInput type="text" value={hostname} onInput={(e: any) => setHostname(e.target.value)} placeholder="Hostname (ex: 10.0.1.1)" />
            </IonItem>
            <IonItem>
              <IonLabel>Port</IonLabel>
              <IonInput type="text" value={port} onInput={(e: any) => setPort(e.target.value)} placeholder="Port (ex: 3333)" />
            </IonItem>
            <IonItem>
              <IonLabel>Path</IonLabel>
              <IonInput type="text" value={path} onInput={(e: any) => setPath(e.target.value)} placeholder="Path (ex: /)" />
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