import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAddressValidation } from '@/hooks/useAddressValidation';
import { CountryCode } from '@/data/countries';
import { Loader2 } from 'lucide-react';

interface StateSelectProps {
  countryCode: CountryCode;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
  required?: boolean;
}

export const StateSelect = ({
  countryCode,
  value,
  onChange,
  label = 'State',
  id = 'state',
  required = false,
}: StateSelectProps) => {
  const { countryAreaChoices, countryAreaType, loading } = useAddressValidation(countryCode);

  // Filter for English only entries
  const englishChoices = countryAreaChoices?.filter(choice => {
    // Check if choice is in English (you might need to adjust based on your actual data structure)
    return !choice.verbose.match(/[\u0900-\u097F]/); // Matches Devanagari script (Hindi)
  }) || [];

  // Get label based on country area type
  const getLabel = () => {
    switch (countryAreaType) {
      case 'state':
        return 'State';
      case 'province':
        return 'Province';
      case 'region':
        return 'Region';
      case 'county':
        return 'County';
      case 'department':
        return 'Department';
      case 'prefecture':
        return 'Prefecture';
      default:
        return label;
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>
          {getLabel()} {required && '*'}
        </Label>
        <div className="flex items-center justify-center h-10 border rounded-md bg-muted/50">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      </div>
    );
  }

  // If no English choices available, show a text input
  if (!englishChoices || englishChoices.length === 0) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>
          {getLabel()} {required && '*'}
        </Label>
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${getLabel().toLowerCase()}`}
          required={required}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {getLabel()} {required && '*'}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full bg-background">
          <SelectValue placeholder={`Select ${getLabel().toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="bg-background z-50 max-h-[300px]">
          {englishChoices.map((choice) => (
            <SelectItem key={choice.raw} value={choice.raw}>
              {choice.verbose}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};