'use client';

import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import { Task } from '@/lib/types';
import { usePlannerStore } from '@/lib/store';
import { TaskForm } from './task-form';
import { Dialog, DialogContent } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function CalendarView() {
  const { tasks, warnings, updateTask, dismissWarning, view, setView } = usePlannerStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const calendarRef = useRef<FullCalendar | null>(null);
  
  // Convert tasks to FullCalendar events
  const events = tasks.map(task => {
    const taskWarnings = warnings.filter(w => w.task.id === task.id);
    return {
      id: task.id,
      title: `${task.title} (${task.assignee})`,
      start: `${task.date}T${task.start}`,
      end: `${task.date}T${task.end}`,
      extendedProps: {
        ...task,
        hasWarnings: taskWarnings.length > 0
      }
    };
  });
  
  const handleEventClick = (info: any) => {
    const task = tasks.find(t => t.id === info.event.id);
    if (task) {
      setSelectedTask(task);
      setIsFormOpen(true);
    }
  };
  
  const handleDateSelect = (info: any) => {
    const defaultTask: Omit<Task, 'id'> = {
      title: 'New Task',
      assignee: 'Vincent',
      date: info.startStr.split('T')[0],
      start: info.startStr.includes('T') ? info.startStr.split('T')[1].substring(0, 5) : '09:00',
      end: info.endStr.includes('T') ? info.endStr.split('T')[1].substring(0, 5) : '10:00',
      tags: [],
    };
    
    setSelectedTask({ ...defaultTask, id: 'new' });
    setIsFormOpen(true);
  };
  
  const handleEventDrop = (info: any) => {
    const taskId = info.event.id;
    const newDate = info.event.startStr.split('T')[0];
    const newStart = info.event.startStr.split('T')[1]?.substring(0, 5) || '00:00';
    const newEnd = info.event.endStr.split('T')[1]?.substring(0, 5) || '23:59';
    
    updateTask(taskId, {
      date: newDate,
      start: newStart,
      end: newEnd
    });
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
  };
  
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      
      if (view === 'day') {
        calendarApi.changeView('timeGridDay');
      } else if (view === 'week') {
        calendarApi.changeView('timeGridWeek');
      } else if (view === 'month') {
        calendarApi.changeView('dayGridMonth');
      }
    }
  }, [view]);
  
  return (
    <div className="h-full flex flex-col">
      <AnimatePresence>
        {warnings.length > 0 && (
          <motion.div 
            className="mb-4 space-y-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {warnings.map((warning, index) => (
              <Alert key={`${warning.task.id}-${warning.type}-${index}`} className="bg-orange-50 border-orange-200">
                <AlertDescription className="flex justify-between items-center">
                  <span>{warning.message}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => dismissWarning(warning.task.id, warning.type)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-grow">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
          initialView={view === 'month' ? 'dayGridMonth' : view === 'day' ? 'timeGridDay' : 'timeGridWeek'}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={handleEventClick}
          selectable={true}
          select={handleDateSelect}
          editable={true}
          eventDrop={handleEventDrop}
          height="100%"
          firstDay={1} // Monday as first day
          eventContent={(eventInfo) => {
            const task = eventInfo.event.extendedProps as Task & { hasWarnings: boolean };
            
            return (
              <div className={`p-1 h-full overflow-hidden ${task.hasWarnings ? 'border-l-4 border-l-orange-500' : ''}`}>
                <div className="font-semibold text-xs truncate">{eventInfo.event.title}</div>
                <div className="text-xs opacity-80 truncate">
                  {task.tags.join(', ')}
                </div>
              </div>
            );
          }}
          eventClassNames={(info) => {
            const task = info.event.extendedProps as Task;
            let bgColor = '';
            
            if (task.assignee === 'Vincent') bgColor = 'bg-blue-100 border-blue-200';
            else if (task.assignee === 'Jannes') bgColor = 'bg-green-100 border-green-200';
            else if (task.assignee === 'Joy') bgColor = 'bg-purple-100 border-purple-200';
            else bgColor = 'bg-gray-100 border-gray-200';
            
            return `${bgColor} border`;
          }}
        />
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          {selectedTask && (
            <TaskForm task={selectedTask} onClose={closeForm} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
