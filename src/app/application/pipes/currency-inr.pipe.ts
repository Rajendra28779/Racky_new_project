import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyInr'
})
export class CurrencyInrPipe implements PipeTransform {

  transform(value: number | string): string {
    if (value === null || value === undefined) return '';
    let formattedValue = value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return formattedValue;
  }

}
