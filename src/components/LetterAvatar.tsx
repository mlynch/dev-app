import React, { ReactChild } from 'react';
import { IonAvatar } from '@ionic/react';
import styled from 'styled-components';

interface Props {
  children: ReactChild;
  slot: string;
}

export const LetterAvatar: React.FC<Props> = ({ children, slot }) => 
  <UIRoundedRect slot={slot}>
    <IonAvatar>
      {children}
    </IonAvatar>
  </UIRoundedRect>

const UIRoundedRect = styled.div`
  background-color: #4D8DFF;
  padding: 5px;
  font-size: 15px;
  font-weight: 400;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  ion-avatar {
    width: 12px;
    height: 18px;
  }
`;