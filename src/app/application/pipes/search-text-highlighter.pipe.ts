import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchTextHighlighter'
})
export class SearchTextHighlighterPipe implements PipeTransform {

    transform(value: string, args: string): any {
      if (args && value){
         var re = new RegExp(args, 'gi');
          return value.toString().replace(re,match => `<mark>${match}</mark>`);
      }
      return value; 
   }
}
