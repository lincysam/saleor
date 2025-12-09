import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { countryCodes, countryNames, CountryCode } from '@/data/countries';

interface CountrySelectProps {
  value: CountryCode;
  onChange: (value: CountryCode) => void;
  label?: string;
  id?: string;
  required?: boolean;
}

export const CountrySelect = ({
  value,
  onChange,
  label = 'Country',
  id = 'country',
  required = false,
}: CountrySelectProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id}>
          {label} {required && '*'}
        </Label>
      )}
      <Select value={value} onValueChange={(val) => onChange(val as CountryCode)}>
        <SelectTrigger id={id} className="w-full bg-background">
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent className="bg-background z-50 max-h-[300px]">
          {countryCodes.map((code) => (
            <SelectItem key={code} value={code}>
              {countryNames[code]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
