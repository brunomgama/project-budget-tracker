"use client";

/**
 * Import necessary components:
 * - `Calendar`: A calendar component for selecting dates.
 * - `Popover`, `PopoverContent`, `PopoverTrigger`: Components for displaying the calendar as a popover.
 * - `Button`: A button component for triggering the date picker.
 * - `format`: A utility function from `date-fns` for formatting dates.
 */
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

/**
 * `DatePickerSection` component:
 * Renders two date pickers for selecting a start and end date.
 * Props:
 * - `startDate`: The selected start date.
 * - `endDate`: The selected end date.
 * - `setStartDate`: Function to set the start date.
 * - `setEndDate`: Function to set the end date.
 */
export default function DatePickerSection({
                                              startDate,
                                              endDate,
                                              setStartDate,
                                              setEndDate,
                                          }: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    setStartDate: (date: Date | undefined) => void;
    setEndDate: (date: Date | undefined) => void;
}) {
    return (
        <div className="flex gap-4 mb-4">
            {/* Start Date Picker Section */}
            <div className="w-1/2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full mt-1 text-left">
                            {startDate ? format(startDate, "yyyy-MM-dd") : "Select Start Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => setStartDate(date ?? undefined)}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* End Date Picker Section */}
            <div className="w-1/2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full mt-1 text-left">
                            {endDate ? format(endDate, "yyyy-MM-dd") : "Select End Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => setEndDate(date ?? undefined)}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
