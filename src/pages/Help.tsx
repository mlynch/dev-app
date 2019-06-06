import React, { useEffect, useState } from 'react';
import { IonPage, IonButton, IonToolbar, IonModal, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonHeader, IonButtons } from '@ionic/react';
import styled from 'styled-components'

import { AppContext } from '../State';
import { AppConnectOptions } from '../models';

interface Props {
  isOpen: boolean;
  handleDismiss: () => void;
}

export const Help: React.FC<Props> = ({ isOpen, handleDismiss }) => {
  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={handleDismiss}
    >
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Troubleshooting</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={_ => handleDismiss()} fill="clear">Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent padding={true}>
          <h2>Troubleshooting Dev App</h2>
          <p>
            Ionic Dev App listens for serve sessions on your network that support
            UDP Broadcasting. A few things need to be in order for this to work properly:
          </p>
          <ol>
            <li>
              your device needs to be on the same network <i>and the same subnet</i> as the 
              machine you're serving from. For most users not in complex networking environments,
              simply being on the same Wi-Fi network will suffice.
            </li>
            <li>
              Your app needs to be served with UDP Broadcasting enabled. That means you need to use
              <code>ionic serve -c</code>, and NOT the serve system that comes with your framework (Angular, React, etc)
            </li>
            <li>
              Your network needs to allow UDP Broadcasting. If you've tried everything and Dev App still
              can't find your app, it's likely your network is configured to not allow UDP Broadcasting.
              <p>
                In this case, your only options are to work with your network administrator to allow UDP Broadcasting,
                or to use the manual connect option available at the top of the discovery page.
              </p>
            </li>
          </ol>
          <h2>If the above doesn't work</h2>
          <p>
            Dev App supports a manual connect option where you can enter the IP address of the machine on your network and the
            port your app server is running on.
          </p>
          <p>
            In order for this to work, you need the actual LAN IP address for that machine, which you can find through
            inspecting your network properties or using a tool like ifconfig on Mac. Your network also needs to be configured
            such that other machines on the network can access your development machine.
          </p>
          <p>
            If that doesn't work, you can use a tool like localtunnel or ngrok to tunnel your local server to the internet
            and then use <i>that</i> hostname and port to load your app from the manual entry UI.
          </p>
          <p>
            If all those fail, then unfortunately Dev App isn't going to work for you without some changes to your network environment. We recommend trying the app at home or outside of your work network to isolate the problem.
          </p>
        </IonContent>
      </IonPage>
    </IonModal>
  );
}