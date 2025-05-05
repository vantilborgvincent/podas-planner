import { Task, ConstraintWarning } from './types';
import { isSameWeek, parseISO, format } from 'date-fns';

export function checkConstraints(tasks: Task[]): ConstraintWarning[] {
  const warnings: ConstraintWarning[] = [];
  
  // Group tasks by week for weekly constraints
  const tasksByWeek = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const weekKey = format(parseISO(task.date), 'yyyy-ww');
    if (!acc[weekKey]) {
      acc[weekKey] = [];
    }
    acc[weekKey].push(task);
    return acc;
  }, {});
  
  // Check each week's constraints
  Object.values(tasksByWeek).forEach(weekTasks => {
    // 1. Vincent: >5 long work nights per week
    const vincentLateNights = weekTasks.filter(task => 
      task.assignee === 'Vincent' && 
      parseInt(task.end.split(':')[0]) >= 19
    );
    
    if (vincentLateNights.length > 5) {
      vincentLateNights.forEach(task => {
        warnings.push({
          message: 'Vincent has >5 long work nights this week (wants 2 evenings free)',
          task,
          type: 'vincent-evenings'
        });
      });
    }
    
    // 2. Jannes: >15 hours per week
    const jannesTasks = weekTasks.filter(task => task.assignee === 'Jannes');
    const jannesHours = jannesTasks.reduce((total, task) => {
      const startHour = parseInt(task.start.split(':')[0]);
      const startMin = parseInt(task.start.split(':')[1]);
      const endHour = parseInt(task.end.split(':')[0]);
      const endMin = parseInt(task.end.split(':')[1]);
      
      const hours = (endHour + endMin/60) - (startHour + startMin/60);
      return total + hours;
    }, 0);
    
    if (jannesHours > 15) {
      jannesTasks.forEach(task => {
        warnings.push({
          message: `Jannes is scheduled for ${jannesHours.toFixed(1)} hours this week (>15 hour limit)`,
          task,
          type: 'jannes-hours'
        });
      });
    }
    
    // 3. Jannes: weekday evenings after 21h
    const jannesLateEvenings = weekTasks.filter(task => {
      const date = parseISO(task.date);
      const dayOfWeek = date.getDay();
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
      const endHour = parseInt(task.end.split(':')[0]);
      
      return task.assignee === 'Jannes' && isWeekday && endHour >= 21;
    });
    
    jannesLateEvenings.forEach(task => {
      warnings.push({
        message: 'Jannes is scheduled after 21:00 on a weekday evening',
        task,
        type: 'jannes-late-evenings'
      });
    });
  });
  
  // 4. Physical BD on days other than Wednesday or Friday
  const physicalBDTasks = tasks.filter(task => 
    task.tags.includes('Physical BD')
  );
  
  physicalBDTasks.forEach(task => {
    const date = parseISO(task.date);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek !== 3 && dayOfWeek !== 5) { // 3 = Wednesday, 5 = Friday
      warnings.push({
        message: 'Physical-business-dev task scheduled on day other than Wednesday or Friday',
        task,
        type: 'physical-bd-days'
      });
    }
  });
  
  return warnings;
}
