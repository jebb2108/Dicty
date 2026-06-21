import React from 'react';
import { IonItem } from '@ionic/react';

const TaskItem: React.FC<{task: {id: string; title: string}}> = ({task}) => {
  return (
    <IonItem>
      <h2>{task.title}</h2>
    </IonItem>
  );
};

export default TaskItem;