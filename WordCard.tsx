import React from 'react';
import { IonCard, IonCardHeader, IonCardContent, IonText, IonButton, IonList } from '@ionic/react';
import { useSpring, animated } from 'react-spring';

interface WordCardProps {
  word: string;
  transcription: string;
  audioSrc: string;
  examples: string[];
}

const WordCard: React.FC<WordCardProps> = ({ word, transcription, audioSrc, examples }) => {
  const fadeIn = useSpring({ from: { opacity: 0 }, to: { opacity: 1 } });

  return (
    <IonCard>
      <IonCardHeader>
        <IonText color="primary" style={{ fontSize: '24px', fontWeight: 'bold' }}>{word}</IonText>
        <IonText style={{ fontSize: '18px', fontStyle: 'italic' }}>{transcription}</IonText>
        <IonButton fill="clear" onClick={() => new Audio(audioSrc).play()}>
          🔊
        </IonButton>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <animated.div style={fadeIn}>
            {examples.map((example, index) => (
              <IonText key={index} color="medium">
                <li>{example}</li>
              </IonText>
            ))}
          </animated.div>
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default WordCard;
