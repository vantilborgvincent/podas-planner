'use client';

import { useState, useEffect } from 'react';
import { usePlannerStore } from '@/lib/store';
import { Milestone } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { format } from 'date-fns';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface MilestoneFormProps {
  milestone: Milestone | { id: string };
  onClose: () => void;
}

export function MilestoneForm({ milestone, onClose }: MilestoneFormProps) {
  const { addMilestone, updateMilestone, deleteMilestone } = usePlannerStore();
  const isNewMilestone = milestone.id === 'new';
  
  const [formData, setFormData] = useState<Omit<Milestone, 'id'>>({
    title: '',
    targetDate: format(new Date(), 'yyyy-MM-dd'),
    kpi: '',
    description: '',
  });
  
  // Initialize form with milestone data if editing
  useEffect(() => {
    if (!isNewMilestone && 'title' in milestone) {
      setFormData({
        title: milestone.title,
        targetDate: milestone.targetDate,
        kpi: milestone.kpi,
        description: milestone.description,
      });
    }
  }, [milestone, isNewMilestone]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, targetDate: format(date, 'yyyy-MM-dd') }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNewMilestone) {
      addMilestone(formData);
    } else {
      updateMilestone(milestone.id, formData);
    }
    
    onClose();
  };
  
  const handleDelete = () => {
    if (!isNewMilestone) {
      deleteMilestone(milestone.id);
      onClose();
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isNewMilestone ? 'Add New Milestone' : 'Edit Milestone'}</DialogTitle>
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
          <Label className="text-right">Target Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="col-span-3 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.targetDate}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.targetDate)}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="kpi" className="text-right">KPI</Label>
          <Input
            id="kpi"
            name="kpi"
            value={formData.kpi}
            onChange={handleInputChange}
            className="col-span-3"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="col-span-3"
            rows={3}
            required
          />
        </div>
      </div>
      
      <DialogFooter>
        {!isNewMilestone && (
          <Button type="button" variant="destructive" onClick={handleDelete} className="mr-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#0C1F52] hover:bg-[#0C1F52]/80">
          {isNewMilestone ? 'Add Milestone' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </form>
  );
}
