import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { RuncpdscheduleserviceService } from '../Services/runcpdscheduleservice.service';

@Component({
  selector: 'app-run-cpd-schedule',
  templateUrl: './run-cpd-schedule.component.html',
  styleUrls: ['./run-cpd-schedule.component.scss']
})
export class RunCpdScheduleComponent implements OnInit {

  data: any;
  data2: any;
  constructor(public headerService: HeaderService, private runcdpsheduleserv: RuncpdscheduleserviceService) { }


  runcpdscdl = {
    data1: ""

  }

  ngOnInit(): void {
    this.headerService.setTitle("Run CPD Schedule");
    this.totalcasetobeassigndata();
  }
  SearchForm = new FormGroup({
    // stateName:new FormControl(''),
  });
  totalcasetobeassigndata() {
    this.runcdpsheduleserv.totalCaseTobeAssign().subscribe(
      (response) => {
        this.data = response;
        this.runcpdscdl.data1 = this.data;
      },
      (error) => console.log(error)
    )
  }
  runcpdscheduleFresh() {
    if (this.data == 0) {
      this.swal("Error", "There Is No Claim To Assign", 'error');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Assign!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'NO!!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.runcdpsheduleserv.runcpdscheduleFreshClaim().subscribe(
          (resp: any) => {
            this.swal("Success", "Successfully Run !!", 'success');
            this.totalcasetobeassigndata();
          },
          (err: any) => {
            this.swal("Error", "Something went wrong", 'error');
          }
        )
      }
    })
  }
  runcpdscheduleDishonor() {
    if (this.data == 0) {
      this.swal("Error", "There Is No Claim To Assign", 'error');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Assign!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'NO!!'
    }).then((result) => {
      if (result.isConfirmed) {
        //this.user1 = JSON.parse(sessionStorage.getItem("user"))
        // let createdBy = this.user1.userId;
        this.runcdpsheduleserv.runcpdscheduleDishonored().subscribe(
          (resp: any) => {
            this.swal("Success", "Successfully Run !!", 'success');
            this.totalcasetobeassigndata();
          },
          (err: any) => {
            this.swal("Error", "Something went wrong", 'error');
          }
        )
      }
    })
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
