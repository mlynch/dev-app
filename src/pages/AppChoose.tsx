import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IonPage, IonButton, IonList, IonItem, IonLabel, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, IonMenuButton, IonSpinner, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';
import styled from 'styled-components'

import { AppContext } from '../State';
import { AppConnect } from './AppConnect';
import { DiscoveredService } from '../models';

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

const renderService = (service: DiscoveredService, onSelect: (service: DiscoveredService) => void) => {
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
}

const renderServices = (services: DiscoveredService[],
                        onSelect: (service: DiscoveredService) => void,
                        onRemove: (service: DiscoveredService) => void,
                        showOptions = false) => {
  return (
    <>
      <IonList>
        {services.map(service => {
          if (showOptions) {
            return (
              <IonItemSliding key={service.id}>
                <IonItemOptions side="end">
                  <IonItemOption onClick={() => onRemove(service)}>Remove</IonItemOption>
                </IonItemOptions>
                {renderService(service, onSelect)}
              </IonItemSliding>
            )
          } else {
            return renderService(service, onSelect);
          }
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
    CapacitorView.open({
      hostname: service.address,
      port: service.port,
      path: service.path
    });
  }, [CapacitorView]);

  const forgetService = useCallback((service: DiscoveredService) => {
    dispatch({
      type: ActionTypes.RemoveManualService,
      service
    });
  }, [dispatch]);

  const connectToManualApp = useCallback((service: DiscoveredService) => {
    dispatch({
      type: ActionTypes.SetManualServices,
      services: state.manualServices ? [...state.manualServices, service] : [service]
    });
    connectToApp(service);
  }, [dispatch]);

  useEffect(() => {
    async function _getServices() {
      const services = await Plugins.UDPDiscovery.getServices();
      dispatch({
        type: ActionTypes.SetServices,
        services: services ? services.services : []
      });
    }
    const searchInterval = setInterval(() => {
      _getServices();
    }, 10000);

    _getServices();

    return () => {
      clearInterval(searchInterval);
    }
  }, [dispatch])

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
              <UIAddIcon>
                <IonIcon name="add" />
              </UIAddIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <UIPadded>
          <h1>Apps</h1>
        </UIPadded>

        {renderNetworkStatus(state.networkStatus)}

        <UIPadded>
          <h4>Discovered</h4>
        </UIPadded>
        { state.services.length ?
            renderServices(state.services,
                           (service: DiscoveredService) => connectToApp(service),
                           (_: DiscoveredService) => {}) : null }

        { state.manualServices.length ? (
          <>
            <UIPadded>
              <h4>Manual</h4>
            </UIPadded>
            {renderServices(state.manualServices,
                            (service: DiscoveredService) => connectToApp(service),
                            (service: DiscoveredService) => forgetService(service),
                            true)}
          </>
        ) : null}

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
        </UIListWrapper>
        <UIHavingTrouble>
        </UIHavingTrouble>
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
        handleConnect={connectToManualApp}
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

const UIAddIcon = styled.div`
  font-size: 30px;
`