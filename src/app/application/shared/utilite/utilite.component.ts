import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderService } from '../../header.service';


@Component({
  selector: 'app-utilite',
  templateUrl: './utilite.component.html',
  styleUrls: ['./utilite.component.scss']
})
export class UtiliteComponent implements OnInit {

  isIndicate: boolean = true ;
  isPrint: boolean = true ;
  isDelete: boolean = true ;
  isDownload: boolean = true ;
  isBack: boolean = true ;

  @Output() receiveResponse = new EventEmitter;


  constructor(private previousLocation: Location, public headerService:HeaderService) { }

  ngOnInit(): void {


    this.headerService.indicateIcon.subscribe(indicateIcon => {
      this.isIndicate = indicateIcon;
    });
    this.headerService.printIcon.subscribe(printIcon => {
      this.isPrint = printIcon;
    });
    this.headerService.deleteIcon.subscribe(deleteIcon => {
      this.isDelete = deleteIcon;
    });
    this.headerService.downloadIcon.subscribe(downloadIcon => {
      this.isDownload = downloadIcon;
    });
    this.headerService.backIcon.subscribe(backIcon => {
      this.isBack = backIcon;
    });

  }


  // print
  printArea(data: any) {
    //this.receiveResponse.emit(data);
    window.print();
  }

  // Back
  backToPrevious() {
    this.previousLocation.back();
  }


}
