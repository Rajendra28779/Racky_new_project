import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'filter'
})
export class FilterService  implements PipeTransform {
  transform(value: any, args?: any): any {

    if(!value)return null;
    if(!args)return value;

    args = args.toLowerCase();

    return value.filter(function(item:any){
        return JSON.stringify(item).toLowerCase().includes(args);
    });
}
}
