import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import { PreauthService } from '../Services/preauth.service';
import { Router } from '@angular/router';
declare let $: any;

@Component({
  selector: 'app-hospital-speciality-request',
  templateUrl: './hospital-speciality-request.component.html',
  styleUrls: ['./hospital-speciality-request.component.scss'],
})
export class HospitalSpecialityRequestComponent implements OnInit {
  txtsearchDate: any;
  specialityRequestList: any = [];
  showPegi: boolean = false;
  constructor(
    public headerService: HeaderService,
    public preauthService: PreauthService,
    public route: Router,
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Speciality Request');
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
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
      flag:"A"
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
  details(data){
    localStorage.setItem('actionData', data.requestId);
    this.route.navigate(['/application/specialitydetails']);
  }
}
