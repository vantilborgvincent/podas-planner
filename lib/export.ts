import { Task, Milestone } from './types';
import { createEvents, EventAttributes } from 'ics';

export function exportToICS(tasks: Task[]): string {
  const events: EventAttributes[] = tasks.map(task => {
    const [year, month, day] = task.date.split('-').map(Number);
    const [startHour, startMinute] = task.start.split(':').map(Number);
    const [endHour, endMinute] = task.end.split(':').map(Number);
    
    return {
      title: task.title,
      description: `Assignee: ${task.assignee}\nTags: ${task.tags.join(', ')}\n${task.notes || ''}`,
      start: [year, month, day, startHour, startMinute],
      end: [year, month, day, endHour, endMinute],
      categories: task.tags,
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
    };
  });
  
  const { error, value } = createEvents(events);
  
  if (error) {
    console.error('Error generating ICS:', error);
    return '';
  }
  
  return value || '';
}

export function saveToJSON(data: { tasks: Task[], milestones: Milestone[] }): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'podas-planner-export.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function saveToICS(tasks: Task[]): void {
  const icsContent = exportToICS(tasks);
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'podas-planner-calendar.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
