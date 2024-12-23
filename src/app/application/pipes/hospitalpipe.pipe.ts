import { Pipe, PipeTransform } from '@angular/core';
import Swal from 'sweetalert2';

@Pipe({
  name: 'hospitalpipe'
})
export class HospitalpipePipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

  transform(value: any, filterData: any): any {

    if (!(filterData)) {
      //alert("Search Not Applied !!")
      this.swal("", "Search Not Applied  !! ", 'info');
      return value;
    }
    if (filterData.length == 0) {
      //alert("No Data Available For Search")
      //this.swal("", "Data Not Available !! ", 'info');
      return value;
    }
    return filterData;

  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
