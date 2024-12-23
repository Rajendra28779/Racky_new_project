import { Injectable } from '@angular/core';
import { CdkDrag, moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DropService {
  cttypeid:any;
  fields: string[] = [];
  currentDateTime:any;
  ctrlId:any;
ctrlitem:any;

  constructor() { }

  public drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      //  moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      
          let item:any = event.previousContainer.data[event.previousIndex];
           
         let copy:any = JSON.parse(JSON.stringify(item));
         let element:any = {};
        
        for(let attr in copy){
        
           element[attr] = copy[attr];
            this.cttypeid=element.ctrlTypeId;
       //  this.ctrlId='ctrl_'+this.datepipe.transform((new Date), 'MMddyyyyhhmmss')
        }
         this.fields.splice(event.currentIndex,0, element);
         this.ctrlitem=element;
//console.log( this.ctrlitem)
    }

    // console.log(event.container.data);
    // console.log(event.previousContainer.data);
  }

}
