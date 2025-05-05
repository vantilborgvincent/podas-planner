'use client';

import { useEffect } from 'react';
import { usePlannerStore } from '@/lib/store';
import { checkConstraints } from '@/lib/constraints';
import { toast } from '@/components/ui/use-toast';

export function ConstraintsChecker() {
  const { tasks, warnings } = usePlannerStore();
  
  useEffect(() => {
    // When warnings change, show toasts for any new warnings
    warnings.forEach(warning => {
      toast({
        title: 'Scheduling Constraint',
        description: warning.message,
        variant: 'warning',
      });
    });
  }, [warnings]);
  
  return null; // This is a non-visual component
}
