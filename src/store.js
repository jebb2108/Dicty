import create from 'zustand';

const useStore = create((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter(task => task.id !== id) })),
  updateTask: (updatedTask) => set((state) => ({
    tasks: state.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
  })),
}));

export default useStore;