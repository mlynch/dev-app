import React from 'react';
import { IonIcon, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel, IonMenuToggle } from '@ionic/react';
import { RouteComponentProps, withRouter } from 'react-router';
import { History } from 'history';

const routes = {
  pages: [
    { title: 'Recent', path: '/', icon: 'calendar' },
    { title: 'About', path: '/about', icon: 'information-circle' }
  ]
}

type Props = RouteComponentProps<{}>;


const Menu: React.FC<Props> = ({ history }) => {
  const renderlistItems = (list: any[]) => {
    return list
      .filter(route => !!route.path)
      .map((p) => (
        <IonMenuToggle key={p.title} auto-hide="false">
          <IonItem button onClick={() => history.push(p.path)}>
            <IonIcon slot="start" name={p.icon}></IonIcon>
            <IonLabel>
              {p.title}
            </IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }
  return (
    <IonMenu contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ionic DevApp</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="outer-content">
        <IonList>
          { renderlistItems(routes.pages) }
        </IonList>
      </IonContent>
    </IonMenu>
  );
}

export default withRouter(Menu);