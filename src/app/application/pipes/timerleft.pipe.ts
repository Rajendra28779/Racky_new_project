import { Pipe, PipeTransform } from '@angular/core';
declare let $: any;
@Pipe({
  name: 'formatTime',
})
export class TimerLeft implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
  if(minutes == -1){
      $('#aadhaarOtp').hide();
    }
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}
