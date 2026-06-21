import React from 'react';
import { IonContent, IonPage, IonList } from '@ionic/react';
import TaskItem from '../components/TaskItem';
import useStore from '../store';

const Tasks: React.FC = () => {
  const tasks = useStore(state => state.tasks);

  return (
    <IonPage>
      <IonContent>
        <IonList>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tasks;