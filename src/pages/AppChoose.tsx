import React, { useState, useCallback, useEffect } from 'react';
import { IonPage, IonButton, IonList, IonItem, IonAvatar, IonLabel, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonMenuButton, IonSpinner } from '@ionic/react';
import styled from 'styled-components'

import { AppContext } from '../State';
import { AppConnect } from './AppConnect';
import { AppConnectOptions, DiscoveredService } from '../models';

import { Plugins } from '@capacitor/core';
import { Help } from './Help';
import { ActionTypes } from '../actions';

import wifiIcon from '../assets/wifi-icon.svg';
import networkIcon from '../assets/network-icon.svg';
import serveIcon from '../assets/serve-icon.svg';
import buildIcon from '../assets/build-icon.svg';
import enjoyIcon from '../assets/enjoy-icon.svg';

const renderServices = (services: DiscoveredService[], onSelect: (service: DiscoveredService) => void) => {
  return (
    <>
      <h4>Discovered</h4>
      <IonList>
        {services.map(service => {
          return (
            <IonItem onClick={() => onSelect(service)} key={service.id}>
              <IonAvatar>
                {service.name[0]}
              </IonAvatar>
              <IonLabel>
                <h2>{service.name}</h2>
                <p>{service.hostname} &middot; {service.address}</p>
              </IonLabel>
            </IonItem>
          );
        })}
      </IonList>
    </>
  );
}

export const AppChoosePage: React.SFC = () => {
  const { CapacitorView } = Plugins;

  const { state, dispatch } = React.useContext(AppContext);

  const [ showAppConnect, setShowAppConnect ] = useState(false);
  const [ showHelp, setShowHelp ] = useState(false);

  const connectToApp = useCallback((service: DiscoveredService) => {
    const url = `http://${service.hostname}:${service.port}`;
    CapacitorView.open({
      url: url
    });
  }, []);

  useEffect(() => {
    async function _getServices() {
      const services = await Plugins.UDPDiscovery.getServices();
      dispatch({
        type: ActionTypes.SET_SERVICES,
        services
      });
    }
    _getServices();
  }, [])

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
        <h1>Apps</h1>

        { state.services.length ?
            renderServices(state.services, (service: DiscoveredService) => {
              connectToApp(service);
            }) : null }

        <h4>Instructions</h4>
        <IonList>
          <IonItem>
            <IonAvatar>
              <img src={wifiIcon} alt="Wi-Fi" />
            </IonAvatar>
            <IonLabel>Enable &amp; connect to Wi-Fi</IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar>
              <img src={networkIcon} alt="Network" />
            </IonAvatar>
            <IonLabel>Connect computer to same network</IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar>
              <img src={serveIcon} alt="Serve" />
            </IonAvatar>
            <IonLabel>Run <code>ionic serve -c</code></IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar>
              <img src={buildIcon} alt="Build" />
            </IonAvatar>
            <IonLabel>Allow app to build</IonLabel>
          </IonItem>
          <IonItem>
            <IonAvatar>
              <img src={enjoyIcon} alt="Enjoy" />
            </IonAvatar>
            <IonLabel>Preview &amp; enjoy</IonLabel>
          </IonItem>
          <HavingTrouble>
            <a href="#" onClick={() => setShowHelp(true)}>Having trouble?</a>
          </HavingTrouble>
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
      <Help
        isOpen={showHelp}
        handleDismiss={() => setShowHelp(false)} />
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

const HavingTrouble = styled.div`
  text-align: center;
  padding: 15px;
`;