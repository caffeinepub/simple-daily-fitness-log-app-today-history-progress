import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { formatDateForDisplay, parseDateFromYYYYMMDD, formatDateToYYYYMMDD, addDays } from '../utils/date';

interface DateSelectorProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

export default function DateSelector({ selectedDate, onSelectDate }: DateSelectorProps) {
  const handlePrevDay = () => {
    onSelectDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    onSelectDate(addDays(selectedDate, 1));
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onSelectDate(formatDateToYYYYMMDD(date));
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 bg-card border rounded-lg p-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevDay}
        className="h-9 w-9"
        aria-label="Previous day"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex-1 gap-2 font-medium">
            <CalendarIcon className="h-4 w-4" />
            {formatDateForDisplay(selectedDate)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={parseDateFromYYYYMMDD(selectedDate)}
            onSelect={handleCalendarSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextDay}
        className="h-9 w-9"
        aria-label="Next day"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
