import React, { useState } from 'react';
import { IonButton, IonToolbar, IonModal, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput } from '@ionic/react';

import { DiscoveredService } from '../models';

interface Props {
  isOpen: boolean;
  handleDismiss: () => void;
  handleConnect: (options: DiscoveredService) => void;
}

const makeService = ({ hostname, port } : { hostname: string, port: string }): DiscoveredService => {
  return {
    id: hostname + port,
    name: `${hostname}:${port}`,
    address: hostname,
    hostname,
    port,
    path: ''
  }
}

export const AppConnect: React.FC<Props> = ({ isOpen, handleDismiss, handleConnect }) => {
  const [ hostname, setHostname ] = useState('localhost');
  const [ port, setPort ] = useState('3333');

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={handleDismiss}
    >
      <IonToolbar>
        <IonTitle>Connect to App</IonTitle>
      </IonToolbar>
      <IonContent>
        <form onSubmit={(e) => { e.preventDefault(); handleConnect(makeService({ hostname, port }))}}>
          <IonList>
            <IonItem>
              <IonLabel>Hostname</IonLabel>
              <IonInput type="text" value={hostname} onInput={(e: any) => setHostname(e.target.value)} placeholder="Hostname (ex: 10.0.1.1)" />
            </IonItem>
            <IonItem>
              <IonLabel>Port</IonLabel>
              <IonInput type="text" value={port} onInput={(e: any) => setPort(e.target.value)} placeholder="Port (ex: 3333)" />
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