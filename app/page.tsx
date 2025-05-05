'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/calendar-view';
import { GanttView } from '@/components/gantt-view';
import { MilestonePanel } from '@/components/milestone-panel';
import { ThemeToggle } from '@/components/theme-toggle';
import { ConstraintsChecker } from '@/components/constraints-checker';
import { usePlannerStore } from '@/lib/store';
import { loadInitialData } from '@/lib/utils';
import { saveToJSON, saveToICS } from '@/lib/export';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarRange, Calendar as CalendarIcon, Gantt, Milestone } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const { tasks, milestones, view, setView, importData, exportData } = usePlannerStore();
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
    
    // Load initial data if store is empty
    const checkAndLoadInitialData = async () => {
      if (tasks.length === 0 && milestones.length === 0) {
        try {
          const data = await loadInitialData();
          importData(data);
        } catch (error) {
          console.error('Failed to load initial data:', error);
        }
      }
    };
    
    checkAndLoadInitialData();
  }, [importData, tasks.length, milestones.length]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'calendar') {
      setView('week');
    } else if (value === 'timeline') {
      setView('timeline');
    }
  };
  
  const handleExportICS = () => {
    saveToICS(tasks);
  };
  
  const handleExportJSON = () => {
    saveToJSON(exportData());
  };
  
  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            importData(data);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Failed to parse JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  
  if (!isClient) {
    return null; // Prevent hydration mismatch
  }
  
  return (
    <div className="min-h-screen bg-background">
      <ConstraintsChecker />
      
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <Image 
                src="/podas-logo.svg" 
                alt="PODAS Logo" 
                fill 
                priority
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#0C1F52]">
              <span>PODAS</span>
              <span className="text-[#F26E22] ml-1">Planner</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportICS}
              className="text-xs"
            >
              Export .ics
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              className="text-xs"
            >
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportJSON}
              className="text-xs"
            >
              Import JSON
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <Tabs
          defaultValue="calendar"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Gantt className="h-4 w-4" />
              <span>Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="milestones" className="flex items-center gap-2">
              <Milestone className="h-4 w-4" />
              <span>Milestones</span>
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="calendar" className="mt-0">
              <div className="h-[calc(100vh-12rem)] bg-card rounded-lg shadow-sm border p-4">
                <CalendarView />
              </div>
            </TabsContent>
            
            <TabsContent value="timeline" className="mt-0">
              <div className="min-h-[calc(100vh-12rem)] bg-card rounded-lg shadow-sm border">
                <GanttView />
              </div>
            </TabsContent>
            
            <TabsContent value="milestones" className="mt-0">
              <div className="min-h-[calc(100vh-12rem)] bg-card rounded-lg shadow-sm border">
                <MilestonePanel />
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>
    </div>
  );
}
