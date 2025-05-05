import { Task, Milestone } from './types';

export async function loadInitialData(): Promise<{ tasks: Task[], milestones: Milestone[] }> {
  try {
    const response = await fetch('/initialData.json');
    if (!response.ok) {
      throw new Error('Failed to load initial data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading initial data:', error);
    return { tasks: [], milestones: [] };
  }
}
