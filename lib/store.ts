import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Milestone, ConstraintWarning } from './types';
import { v4 as uuidv4 } from 'uuid';
import { checkConstraints } from './constraints';

interface PlannerState {
  tasks: Task[];
  milestones: Milestone[];
  warnings: ConstraintWarning[];
  view: 'day' | 'week' | 'month' | 'timeline';
  
  // Actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  
  setView: (view: 'day' | 'week' | 'month' | 'timeline') => void;
  
  importData: (data: { tasks: Task[], milestones: Milestone[] }) => void;
  exportData: () => { tasks: Task[], milestones: Milestone[] };
  
  dismissWarning: (taskId: string, type: string) => void;
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      tasks: [],
      milestones: [],
      warnings: [],
      view: 'week',
      
      addTask: (taskData) => {
        const task = { ...taskData, id: uuidv4() };
        set((state) => {
          const newTasks = [...state.tasks, task];
          return { 
            tasks: newTasks,
            warnings: checkConstraints(newTasks)
          };
        });
      },
      
      updateTask: (id, updates) => {
        set((state) => {
          const newTasks = state.tasks.map(task => 
            task.id === id ? { ...task, ...updates } : task
          );
          return { 
            tasks: newTasks,
            warnings: checkConstraints(newTasks)
          };
        });
      },
      
      deleteTask: (id) => {
        set((state) => {
          const newTasks = state.tasks.filter(task => task.id !== id);
          return { 
            tasks: newTasks,
            warnings: checkConstraints(newTasks)
          };
        });
      },
      
      addMilestone: (milestoneData) => {
        const milestone = { ...milestoneData, id: uuidv4() };
        set((state) => ({
          milestones: [...state.milestones, milestone]
        }));
      },
      
      updateMilestone: (id, updates) => {
        set((state) => ({
          milestones: state.milestones.map(milestone => 
            milestone.id === id ? { ...milestone, ...updates } : milestone
          )
        }));
      },
      
      deleteMilestone: (id) => {
        set((state) => ({
          milestones: state.milestones.filter(milestone => milestone.id !== id)
        }));
      },
      
      setView: (view) => {
        set({ view });
      },
      
      importData: (data) => {
        set({
          tasks: data.tasks,
          milestones: data.milestones,
          warnings: checkConstraints(data.tasks)
        });
      },
      
      exportData: () => {
        const { tasks, milestones } = get();
        return { tasks, milestones };
      },
      
      dismissWarning: (taskId, type) => {
        set((state) => ({
          warnings: state.warnings.filter(warning => 
            !(warning.task.id === taskId && warning.type === type)
          )
        }));
      }
    }),
    {
      name: 'podas-planner-storage',
      partialize: (state) => ({ 
        tasks: state.tasks,
        milestones: state.milestones,
        view: state.view
      }),
    }
  )
);
