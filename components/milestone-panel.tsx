'use client';

import { useState } from 'react';
import { usePlannerStore } from '@/lib/store';
import { Dialog, DialogContent } from './ui/dialog';
import { MilestoneForm } from './milestone-form';
import { Button } from './ui/button';
import { parseISO, format, isAfter } from 'date-fns';
import { Plus, Calendar, Flag, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function MilestonePanel() {
  const { milestones } = usePlannerStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  
  // Sort milestones by target date
  const sortedMilestones = [...milestones].sort((a, b) => {
    return parseISO(a.targetDate).getTime() - parseISO(b.targetDate).getTime();
  });
  
  const today = new Date();
  
  const openNewMilestoneForm = () => {
    setSelectedMilestone({ id: 'new' });
    setIsFormOpen(true);
  };
  
  const openEditMilestoneForm = (milestone: any) => {
    setSelectedMilestone(milestone);
    setIsFormOpen(true);
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedMilestone(null);
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Milestones</h2>
        <Button onClick={openNewMilestoneForm} className="bg-[#0C1F52] hover:bg-[#0C1F52]/80">
          <Plus className="mr-2 h-4 w-4" /> Add Milestone
        </Button>
      </div>
      
      <div className="space-y-4">
        {sortedMilestones.map((milestone, index) => {
          const targetDate = parseISO(milestone.targetDate);
          const isPast = isAfter(today, targetDate);
          
          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                isPast ? 'bg-gray-50' : 'bg-white'
              }`}
              onClick={() => openEditMilestoneForm(milestone)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{milestone.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {format(targetDate, 'dd MMM yyyy')}
                      {isPast && ' (past)'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-[#F26E22] text-white text-xs py-1 px-2 rounded-full flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    <span>Milestone</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <div className="font-medium text-[#0C1F52] flex items-center">
                    <Flag className="h-4 w-4 mr-1" />
                    KPI: {milestone.kpi}
                  </div>
                </div>
                
                <p className="text-sm mt-2 text-gray-700">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          );
        })}
        
        {milestones.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-500">No milestones yet. Add your first milestone!</p>
          </div>
        )}
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          {selectedMilestone && (
            <MilestoneForm milestone={selectedMilestone} onClose={closeForm} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
