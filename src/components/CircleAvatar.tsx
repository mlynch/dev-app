import React, { ReactChild } from 'react';
import { IonAvatar } from '@ionic/react';
import styled from 'styled-components';

interface Props {
  children: ReactChild;
  slot: string;
}

export const CircleAvatar: React.FC<Props> = ({ children, slot }) => 
  <UICircle slot={slot}>
    <IonAvatar>
      {children}
    </IonAvatar>
  </UICircle>

const UICircle = styled.div`
  z-index: 3;
  background-color: #27323F;
  padding: 3px;
  width: 28px;
  height: 28px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;

  ion-avatar {
    width: 18px;
    height: 18px;
  }

  img {
    height: auto;
  }
`;