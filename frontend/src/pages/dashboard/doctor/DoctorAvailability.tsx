import { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, Save } from 'lucide-react';

// Days of the week
const daysOfWeek = [
  { name: 'Dimanche', shortName: 'Dim', value: 0 },
  { name: 'Lundi', shortName: 'Lun', value: 1 },
  { name: 'Mardi', shortName: 'Mar', value: 2 },
  { name: 'Mercredi', shortName: 'Mer', value: 3 },
  { name: 'Jeudi', shortName: 'Jeu', value: 4 },
  { name: 'Vendredi', shortName: 'Ven', value: 5 },
  { name: 'Samedi', shortName: 'Sam', value: 6 },
];

// Time slots
const timeSlots = [
  { id: 1, start: '08:00', end: '08:30' },
  { id: 2, start: '08:30', end: '09:00' },
  { id: 3, start: '09:00', end: '09:30' },
  { id: 4, start: '09:30', end: '10:00' },
  { id: 5, start: '10:00', end: '10:30' },
  { id: 6, start: '10:30', end: '11:00' },
  { id: 7, start: '11:00', end: '11:30' },
  { id: 8, start: '11:30', end: '12:00' },
  { id: 9, start: '14:00', end: '14:30' },
  { id: 10, start: '14:30', end: '15:00' },
  { id: 11, start: '15:00', end: '15:30' },
  { id: 12, start: '15:30', end: '16:00' },
  { id: 13, start: '16:00', end: '16:30' },
  { id: 14, start: '16:30', end: '17:00' },
];

// Mock data for doctor working hours
const initialWorkingHours = {
  0: { isWorking: false, slots: [] }, // Sunday
  1: { isWorking: true, slots: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, // Monday
  2: { isWorking: true, slots: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, // Tuesday
  3: { isWorking: true, slots: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, // Wednesday
  4: { isWorking: true, slots: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, // Thursday
  5: { isWorking: true, slots: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, // Friday
  6: { isWorking: false, slots: [] }, // Saturday
};

// Mock data for exceptions (holidays, special days)
const initialExceptions = [
  { date: addDays(new Date(), 5), reason: 'Congé personnel' },
  { date: addDays(new Date(), 12), reason: 'Conférence médicale' },
];

const DoctorAvailability = () => {
  const [workingHours, setWorkingHours] = useState(initialWorkingHours);
  const [exceptions, setExceptions] = useState(initialExceptions);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [exceptionReason, setExceptionReason] = useState('');
  const [isExceptionDialogOpen, setIsExceptionDialogOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  
  const { toast } = useToast();

  // Toggle working day
  const toggleWorkingDay = (day: number) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        isWorking: !prev[day].isWorking,
        slots: prev[day].isWorking ? [] : timeSlots.map(slot => slot.id),
      },
    }));
  };

  // Toggle time slot
  const toggleTimeSlot = (day: number, slotId: number) => {
    setWorkingHours(prev => {
      const updatedSlots = prev[day].slots.includes(slotId)
        ? prev[day].slots.filter(id => id !== slotId)
        : [...prev[day].slots, slotId];
      
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: updatedSlots,
        },
      };
    });
  };

  // Add exception (day off)
  const addException = () => {
    if (selectedDate && exceptionReason) {
      setExceptions(prev => [
        ...prev,
        { date: selectedDate, reason: exceptionReason },
      ]);
      
      // Close dialog and reset form
      setIsExceptionDialogOpen(false);
      setSelectedDate(null);
      setExceptionReason('');
      
      // Show toast
      toast({
        title: "Jour d'exception ajouté",
        description: `Le ${format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })} a été marqué comme indisponible.`,
      });
    }
  };

  // Remove exception
  const removeException = (date: Date) => {
    setExceptions(prev => prev.filter(ex => !isSameDay(ex.date, date)));
    
    // Show toast
    toast({
      title: "Jour d'exception supprimé",
      description: `Le ${format(date, 'EEEE d MMMM yyyy', { locale: fr })} a été retiré des exceptions.`,
    });
  };

  // Save all changes
  const saveChanges = () => {
    // In a real app, this would send data to the backend
    toast({
      title: "Modifications enregistrées",
      description: "Vos disponibilités ont été mises à jour avec succès.",
    });
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, -1));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  // Get week dates for display
  const weekDates = daysOfWeek.map(day => addDays(currentWeekStart, day.value));

  // Check if a date is an exception
  const isException = (date: Date) => {
    return exceptions.some(ex => isSameDay(ex.date, date));
  };

  // Get exception reason
  const getExceptionReason = (date: Date) => {
    return exceptions.find(ex => isSameDay(ex.date, date))?.reason || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Gérer mes disponibilités</h1>
        
        <Button onClick={saveChanges} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>
      
      <Tabs defaultValue="weekly">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">Horaires hebdomadaires</TabsTrigger>
          <TabsTrigger value="exceptions">Jours d'exception</TabsTrigger>
        </TabsList>
        
        {/* Weekly Schedule Tab */}
        <TabsContent value="weekly" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Horaires hebdomadaires</CardTitle>
              <CardDescription>
                Définissez vos horaires de consultation habituels pour chaque jour de la semaine.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {daysOfWeek.map((day) => (
                  <div key={day.value} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">{day.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`day-${day.value}`}
                          checked={workingHours[day.value].isWorking}
                          onCheckedChange={() => toggleWorkingDay(day.value)}
                        />
                        <Label htmlFor={`day-${day.value}`}>
                          {workingHours[day.value].isWorking ? 'Disponible' : 'Indisponible'}
                        </Label>
                      </div>
                    </div>
                    
                    {workingHours[day.value].isWorking && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={workingHours[day.value].slots.includes(slot.id) ? "default" : "outline"}
                            className="py-1 px-2 h-auto text-sm justify-start"
                            onClick={() => toggleTimeSlot(day.value, slot.id)}
                          >
                            {slot.start} - {slot.end}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Exceptions Tab */}
        <TabsContent value="exceptions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Jours d'exception</CardTitle>
              <CardDescription>
                Gérez vos jours de congé, vacances ou autres jours d'indisponibilité.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setIsExceptionDialogOpen(true)}
                className="mb-6 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter un jour d'exception
              </Button>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Prochains jours d'exception</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Semaine du {format(currentWeekStart, 'd MMM', { locale: fr })}
                    </span>
                    <Button variant="outline" size="icon" onClick={goToNextWeek}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {weekDates.map((date, index) => (
                    <div
                      key={index}
                      className={`border rounded-md p-2 text-center ${
                        isException(date) ? 'bg-destructive/10 border-destructive/50' : ''
                      }`}
                    >
                      <p className="text-sm font-medium">{daysOfWeek[index].shortName}</p>
                      <p className="text-lg">{format(date, 'd')}</p>
                      {isException(date) ? (
                        <div className="mt-2">
                          <p className="text-xs text-destructive font-medium">Indisponible</p>
                          <p className="text-xs text-muted-foreground truncate">{getExceptionReason(date)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeException(date)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Disponible</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Liste des jours d'exception</h3>
                  
                  {exceptions.length > 0 ? (
                    <div className="space-y-2">
                      {exceptions
                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                        .map((exception, index) => (
                          <div key={index} className="flex items-center justify-between border-b pb-2">
                            <div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="font-medium">
                                  {format(exception.date, 'EEEE d MMMM yyyy', { locale: fr })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground ml-6">{exception.reason}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeException(exception.date)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aucun jour d'exception défini.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Exception Dialog */}
      <Dialog open={isExceptionDialogOpen} onOpenChange={setIsExceptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un jour d'exception</DialogTitle>
            <DialogDescription>
              Définissez un jour où vous ne serez pas disponible pour des rendez-vous.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="flex items-center border rounded-md p-2">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <input
                  type="date"
                  id="date"
                  className="flex-1 border-0 bg-transparent p-0 focus:outline-none"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Raison</Label>
              <input
                id="reason"
                className="w-full border rounded-md p-2"
                placeholder="Congé, vacances, formation..."
                value={exceptionReason}
                onChange={(e) => setExceptionReason(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExceptionDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={addException}
              disabled={!selectedDate || !exceptionReason}
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAvailability;