import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import { PreauthService } from '../Services/preauth.service';
declare let $: any;
@Component({
  selector: 'app-view-speciality-request',
  templateUrl: './view-speciality-request.component.html',
  styleUrls: ['./view-speciality-request.component.scss']
})
export class ViewSpecialityRequestComponent implements OnInit {

  txtsearchDate: any;
  specialityRequestList: any = [];
  showPegi: boolean = false;
  constructor(
    public headerService: HeaderService,
    public preauthService: PreauthService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Action Taken');
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('#appealDisposal').hide();
    this.onClickSearch();
  }
  resDate: any;
  onClickSearch() {
    let status = $('#status').val();
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    let reqData = {
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      status: status,
      flag: "B"
    };
    this.preauthService.getSpecialityRequestList(reqData).subscribe(
      (data) => {
        this.resDate = data;
        console.log(this.resDate);
        if (this.resDate.status == 'success') {
          this.specialityRequestList = JSON.parse(this.resDate.data);
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  resetField() {}
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $('#appealDisposal').show();
  }
  modalClose() {
    $('#appealDisposal').hide();
  }
}
