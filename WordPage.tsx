import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import WordCard from './WordCard';

const WordPage: React.FC<{ word: string; transcription: string; audioSrc: string; examples: string[]; }> = ({ word, transcription, audioSrc, examples }) => {
  return (
    <IonPage>
      <IonContent>
        <WordCard word={word} transcription={transcription} audioSrc={audioSrc} examples={examples} />
      </IonContent>
    </IonPage>
  );
};

export default WordPage;
