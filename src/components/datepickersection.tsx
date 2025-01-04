"use client";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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
