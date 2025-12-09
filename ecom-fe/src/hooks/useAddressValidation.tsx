import { useState, useEffect } from 'react';
import apolloClient from '@/lib/apolloClient';
import { GET_ADDRESS_VALIDATION_RULES } from '@/graphql/checkout.queries';
import { CountryCode } from '@/data/countries';

interface CountryAreaChoice {
  verbose: string;
  raw: string;
}

interface AddressValidationRules {
  addressFormat: string;
  allowedFields: string[];
  requiredFields: string[];
  countryAreaType: string;
  postalCodeType: string;
  cityType: string;
  countryAreaChoices: CountryAreaChoice[];
}

interface AddressValidationResponse {
  addressValidationRules: AddressValidationRules;
}

export const useAddressValidation = (countryCode: CountryCode) => {
  const [countryAreaChoices, setCountryAreaChoices] = useState<CountryAreaChoice[]>([]);
  const [countryAreaType, setCountryAreaType] = useState<string>('state');
  const [postalCodeType, setPostalCodeType] = useState<string>('postal');
  const [cityType, setCityType] = useState<string>('city');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!countryCode) return;

    const fetchValidationRules = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await apolloClient.query<AddressValidationResponse>({
          query: GET_ADDRESS_VALIDATION_RULES,
          variables: { countryCode },
        });

        if (data?.addressValidationRules) {
          const rules = data.addressValidationRules;
          setCountryAreaChoices(rules.countryAreaChoices || []);
          setCountryAreaType(rules.countryAreaType || 'state');
          setPostalCodeType(rules.postalCodeType || 'postal');
          setCityType(rules.cityType || 'city');
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching address validation rules:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchValidationRules();
  }, [countryCode]);

  return {
    countryAreaChoices,
    countryAreaType,
    postalCodeType,
    cityType,
    loading,
    error,
  };
};
