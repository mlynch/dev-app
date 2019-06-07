import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IonPage, IonButton, IonList, IonItem, IonAvatar, IonLabel, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonMenuButton, IonSpinner } from '@ionic/react';
import styled from 'styled-components'

import { AppContext } from '../State';
import { AppConnect } from './AppConnect';
import { AppConnectOptions, DiscoveredService } from '../models';

import { Plugins, NetworkStatus } from '@capacitor/core';
import { Help } from './Help';
import { ActionTypes } from '../actions';

import wifiIcon from '../assets/wifi-icon.svg';
import networkIcon from '../assets/network-icon.svg';
import serveIcon from '../assets/serve-icon.svg';
import buildIcon from '../assets/build-icon.svg';
import enjoyIcon from '../assets/enjoy-icon.svg';
import { CircleAvatar } from '../components/CircleAvatar';
import { LetterAvatar } from '../components/LetterAvatar';

const renderNetworkStatus = (status: NetworkStatus) => {
  console.log('Network status', status);
  const isWifi = status && ['wifi', '4g'].indexOf(status.connectionType) >= 0;
  const color = status && status.connected && isWifi ? '#6FCF97' : '#cf6e6e';
  const type = isWifi ? 'Connected to Wi-Fi' : 'Not connected to Wi-Fi';

  return (
    <UINetworkStatus>
      <div className="status-dot" style={{ backgroundColor: color }}></div>
      {type}
    </UINetworkStatus>
  );
}

const renderServices = (services: DiscoveredService[], onSelect: (service: DiscoveredService) => void) => {
  return (
    <>
      <UIPadded>
        <h4>Discovered</h4>
      </UIPadded>
      <IonList>
        {services.map(service => {
          return (
            <IonItem onClick={() => onSelect(service)} key={service.id}>
              <LetterAvatar slot="start">
                {service.name[0]}
              </LetterAvatar>
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

  const { state, dispatch } = useContext(AppContext);

  const [ showAppConnect, setShowAppConnect ] = useState(false);
  const [ showHelp, setShowHelp ] = useState(false);

  const connectToApp = useCallback((service: DiscoveredService) => {
    const url = `http://${service.hostname}:${service.port}${service.path || ''}`;
    CapacitorView.open({
      url
    });
  }, []);

  useEffect(() => {
    async function _getServices() {
      const services = await Plugins.UDPDiscovery.getServices();
      dispatch({
        type: ActionTypes.SET_SERVICES,
        services: services && services.services || []
      });
    }
    const searchInterval = setInterval(() => {
      _getServices();
    }, 10000);

    _getServices();

    return () => {
      clearInterval(searchInterval);
    }
  }, [])

  console.log('Rendering services', state.services);

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
      <IonContent>
        <UIPadded>
          <h1>Apps</h1>
        </UIPadded>

        {renderNetworkStatus(state.networkStatus)}

        { state.services.length ?
            renderServices(state.services, (service: DiscoveredService) => {
              connectToApp(service);
            }) : null }

        <UIPadded>
          <h4>Instructions</h4>
        </UIPadded>
        <UIListWrapper>
          <IonList>
            <UISideLine />
            <IonItem>
              <CircleAvatar slot="start">
                <img src={wifiIcon} alt="Wi-Fi" />
              </CircleAvatar>
              <IonLabel>Enable &amp; connect to Wi-Fi</IonLabel>
            </IonItem>
            <IonItem>
              <CircleAvatar slot="start">
                <img src={networkIcon} alt="Network" />
              </CircleAvatar>
              <IonLabel>Connect computer to same network</IonLabel>
            </IonItem>
            <IonItem>
              <CircleAvatar slot="start">
                <img src={serveIcon} alt="Serve" />
              </CircleAvatar>
              <IonLabel>Run <code>ionic serve -c</code></IonLabel>
            </IonItem>
            <IonItem>
              <CircleAvatar slot="start">
                <img src={buildIcon} alt="Build" />
              </CircleAvatar>
              <IonLabel>Allow app to build</IonLabel>
            </IonItem>
            <IonItem>
              <CircleAvatar slot="start">
                <img src={enjoyIcon} alt="Enjoy" />
              </CircleAvatar>
              <IonLabel>Preview &amp; enjoy</IonLabel>
            </IonItem>
          </IonList>
          <UIHavingTrouble>
          </UIHavingTrouble>
        </UIListWrapper>
      </IonContent>
      <UIAppListening>
        <div>
          Listening for apps...
        </div>
        <a href="#" onClick={() => setShowHelp(true)}>Having trouble?</a>
        <IonSpinner name="lines" />
      </UIAppListening>
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

const UIListWrapper = styled.div`
  position: relative;
`;

const UISideLine = styled.div`
  position: absolute;
  left: 29px;
  background-color: #27323F;
  width: 2px;
  top: 24px;
  bottom: 12px;
  z-index: 2;
`;

const UIPadded = styled.div`
  padding: 16px;
`;

const UINetworkStatus = styled.div`
  padding: 6px 12px;
  display: flex;
  align-items: center;
  background-color: #1A232F;
  font-size: 13px;
  line-height: 16px;
  color: #D1D3D5;

  .status-dot {
    width: 10px;
    height: 10px;
    margin-right: 10px;
    border-radius: 10px;
  }
`;

const UIAppListening = styled.div`
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

  a {
    margin-right: 10px;
    color: #4D8DFF;
    text-decoration: none;
  }

  div {
    flex: 1;
  }
`;

const UIHavingTrouble = styled.div`
  text-align: center;
  padding: 15px;
`;