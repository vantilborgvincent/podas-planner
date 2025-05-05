'use client';

import { useEffect, useState } from 'react';
import { usePlannerStore } from '@/lib/store';
import { Task, Milestone } from '@/lib/types';
import { 
  Timeline, 
  TimelineItem, 
  TimelineSeparator, 
  TimelineConnector, 
  TimelineContent, 
  TimelineDot 
} from '@mui/lab';
import { parseISO, format, addMonths } from 'date-fns';
import { motion } from 'framer-motion';

export function GanttView() {
  const { tasks, milestones } = usePlannerStore();
  const [timelineItems, setTimelineItems] = useState<Array<{id: string, date: Date, type: 'task' | 'milestone', data: Task | Milestone}>>([]);

  useEffect(() => {
    // Combine tasks and milestones for timeline
    const items = [
      ...tasks.map(task => ({
        id: task.id,
        date: parseISO(task.date),
        type: 'task' as const,
        data: task
      })),
      ...milestones.map(milestone => ({
        id: milestone.id,
        date: parseISO(milestone.targetDate),
        type: 'milestone' as const,
        data: milestone
      }))
    ];
    
    // Sort by date
    items.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    setTimelineItems(items);
  }, [tasks, milestones]);

  // Group items by month
  const itemsByMonth: Record<string, typeof timelineItems> = {};
  
  timelineItems.forEach(item => {
    const monthKey = format(item.date, 'yyyy-MM');
    if (!itemsByMonth[monthKey]) {
      itemsByMonth[monthKey] = [];
    }
    itemsByMonth[monthKey].push(item);
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Timeline / Roadmap</h2>
      
      {Object.entries(itemsByMonth).map(([monthKey, items], monthIndex) => {
        const monthDate = parseISO(`${monthKey}-01`);
        
        return (
          <div key={monthKey} className="mb-8">
            <h3 className="text-xl font-semibold mb-3">
              {format(monthDate, 'MMMM yyyy')}
            </h3>
            
            <Timeline position="alternate">
              {items.map((item, itemIndex) => (
                <TimelineItem key={item.id}>
                  <TimelineSeparator>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: itemIndex * 0.1 }}
                    >
                      <TimelineDot 
                        color={item.type === 'milestone' ? 'primary' : 
                          (item.data as Task).assignee === 'Vincent' ? 'info' : 
                          (item.data as Task).assignee === 'Jannes' ? 'success' : 
                          (item.data as Task).assignee === 'Joy' ? 'secondary' : 'grey'
                        }
                        variant={item.type === 'milestone' ? 'filled' : 'outlined'}
                      />
                    </motion.div>
                    {itemIndex < items.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  
                  <TimelineContent>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: itemIndex * 0.1 + 0.1 }}
                      className="p-3 border rounded shadow-sm mb-4"
                    >
                      <p className="font-semibold">
                        {item.type === 'milestone' 
                          ? (item.data as Milestone).title
                          : (item.data as Task).title
                        }
                      </p>
                      
                      <p className="text-sm text-gray-600">
                        {format(item.date, 'dd MMM yyyy')}
                        {item.type === 'task' && ` (${(item.data as Task).start} - ${(item.data as Task).end})`}
                      </p>
                      
                      {item.type === 'task' && (
                        <p className="text-xs bg-gray-100 rounded px-2 py-1 mt-1 inline-block">
                          {(item.data as Task).assignee}
                        </p>
                      )}
                      
                      {item.type === 'milestone' && (
                        <p className="text-xs mt-1">
                          KPI: {(item.data as Milestone).kpi}
                        </p>
                      )}
                    </motion.div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        );
      })}
    </div>
  );
}
