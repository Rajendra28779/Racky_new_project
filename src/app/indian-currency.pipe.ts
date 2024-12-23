import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrency'
})
export class IndianCurrencyPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value === null || value === undefined) return '';
    // Convert the value to a number
    let numericValue = typeof value === 'string' ? parseFloat(value) : value;
    // Format the value according to the Indian numbering system with two decimal places
    let formattedValue = numericValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return formattedValue;
}
}
