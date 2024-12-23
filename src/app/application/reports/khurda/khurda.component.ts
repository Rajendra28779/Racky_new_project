import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
// import { timer } from 'rxjs';
declare let $: any;

@Component({
  selector: 'app-khurda',
  templateUrl: './khurda.component.html',
  styleUrls: ['./khurda.component.scss']
})
export class KhurdaComponent implements OnInit {

  childmessage: any;


  constructor(public headerService: HeaderService) { }

  ngOnInit(): void {

    // Page title display
    this.headerService.setTitle('District Wise Discharge Report');

    // utility show
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);

    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      daysOfWeekDisabled: [0, 6],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: [0, 6],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: [0, 6],
    });


    
  }
  


  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

}
