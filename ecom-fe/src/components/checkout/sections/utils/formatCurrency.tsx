// export const formatCurrency = (amount: number, currency?: string): string => {
//   const currencyCode = currency || 'INR'; 
//   return new Intl.NumberFormat(undefined, {
//     style: 'currency',
//     currency: currencyCode,
//   }).format(amount);
// };


// export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
//   if (typeof amount !== 'number' || isNaN(amount)) {
//     return '₹0.00'; // or return '' or throw an error
//   }

//   return new Intl.NumberFormat(undefined, {
//     style: 'currency',
//     currency,
//   }).format(amount);
// };


export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  // If amount is not a valid number, return blank
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '';
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(amount);
};
