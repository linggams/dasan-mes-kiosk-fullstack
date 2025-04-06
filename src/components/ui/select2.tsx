"use client"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { useState } from "react"

type Option = {
    label: string
    value: string | number
}

type Props = {
    label?: string
    options: Option[]
    placeholder?: string
    value?: string | number
    onChange: (value: string | number) => void
}

export default function SearchableSelect({
                                             label,
                                             options,
                                             placeholder = "Select...",
                                             value,
                                             onChange,
                                         }: Props) {
    const [open, setOpen] = useState(false)
    const selected = options.find((option) => option.value === value)

    return (
        <div className="space-y-2 w-full">
            {label && <Label className="block">{label}</Label>}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-white"
                    >
                        {selected ? selected.label : <span className="text-gray-400">{placeholder}</span>}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white">
                    <Command>
                        <CommandInput placeholder="Search..." className="text-sm" />
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                            {options.length > 0 ? (
                                options.map((option) => (
                                    <CommandItem
                                        key={`option-${option.value}`}
                                        value={String(option.label)}
                                        onSelect={(selectedValue) => {
                                            const selectedOption = options.find(opt => String(opt.value) === selectedValue);
                                            if (selectedOption) {
                                                onChange(selectedOption.value);
                                            }
                                            setOpen(false);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                option.value === value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))
                            ) : (
                                <CommandEmpty>No option found.</CommandEmpty>
                            )}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
