'use client';

import { useState, useEffect } from 'react';
import { usePlannerStore } from '@/lib/store';
import { Task } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { format } from 'date-fns';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface TaskFormProps {
  task: Task | { id: string };
  onClose: () => void;
}

const availableTags = [
  'Physical BD',
  'Cold-call',
  'Marketing',
  'Build',
  'Admin',
  'Content',
  'Networking',
  'Tooling',
  'Referral',
  'Audit'
];

export function TaskForm({ task, onClose }: TaskFormProps) {
  const { addTask, updateTask, deleteTask } = usePlannerStore();
  const isNewTask = task.id === 'new';
  
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    title: '',
    assignee: 'Vincent',
    date: format(new Date(), 'yyyy-MM-dd'),
    start: '09:00',
    end: '10:00',
    tags: [],
    notes: '',
  });
  
  // Initialize form with task data if editing
  useEffect(() => {
    if (!isNewTask && 'title' in task) {
      setFormData({
        title: task.title,
        assignee: task.assignee,
        date: task.date,
        start: task.start,
        end: task.end,
        tags: task.tags,
        notes: task.notes || '',
        rrule: task.rrule,
      });
    }
  }, [task, isNewTask]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    }
  };
  
  const handleTagToggle = (tag: string) => {
    setFormData(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      
      return { ...prev, tags: newTags };
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNewTask) {
      addTask(formData);
    } else {
      updateTask(task.id, formData);
    }
    
    onClose();
  };
  
  const handleDelete = () => {
    if (!isNewTask) {
      deleteTask(task.id);
      onClose();
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isNewTask ? 'Add New Task' : 'Edit Task'}</DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="assignee" className="text-right">Assignee</Label>
          <Select
            value={formData.assignee}
            onValueChange={value => handleSelectChange('assignee', value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vincent">Vincent</SelectItem>
              <SelectItem value="Jannes">Jannes</SelectItem>
              <SelectItem value="Joy">Joy</SelectItem>
              <SelectItem value="Partners">Partners</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="col-span-3 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.date)}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="start" className="text-right">Start Time</Label>
          <Input
            id="start"
            name="start"
            type="time"
            value={formData.start}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="end" className="text-right">End Time</Label>
          <Input
            id="end"
            name="end"
            type="time"
            value={formData.end}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right pt-2">Tags</Label>
          <div className="col-span-3 flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={formData.tags.includes(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                />
                <label
                  htmlFor={`tag-${tag}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {tag}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="notes" className="text-right">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes || ''}
            onChange={handleInputChange}
            className="col-span-3"
            rows={3}
          />
        </div>
      </div>
      
      <DialogFooter>
        {!isNewTask && (
          <Button type="button" variant="destructive" onClick={handleDelete} className="mr-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#0C1F52] hover:bg-[#0C1F52]/80">
          {isNewTask ? 'Add Task' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </form>
  );
}
