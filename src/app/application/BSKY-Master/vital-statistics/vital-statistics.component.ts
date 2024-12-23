import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VitalStatisticsService } from '../../Services/vital-statistics.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-vital-statistics',
  templateUrl: './vital-statistics.component.html',
  styleUrls: ['./vital-statistics.component.scss']
})
export class VitalStatisticsComponent implements OnInit {
  VitalStatisticsForm: FormGroup;
  updatebutton: boolean;
  submitbutton: boolean;
  submitted: boolean = false;
  dataa: any;
  updateId: any;
  isUpdateBtnInVisible: boolean = true;
  childmessage: any;
  currentUser: any;
  maxChars=200;
  constructor(public headerService: HeaderService,
    public vitalStatisticsService: VitalStatisticsService,
    public fb: FormBuilder,
    public router: Router,
    private activeroute: ActivatedRoute,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Vital Statistics');
    this.currentUser = this.sessionService.decryptSessionData("user");
    this.VitalStatisticsForm = this.fb.group({
      vitalstatisticsname:  new FormControl(''),
      vitalstatisticscode: new FormControl(''),
      vitalstatisticsdescription: new FormControl(''),
      createdBy: this.currentUser.userId,
      updatedby: this.currentUser.userId,
    })
    this.updateId = this.activeroute.snapshot.paramMap.get('vitalStatisticsId');
    this.getByvitalstatisticsId();
    this.updatebutton = false;
    this.submitbutton = true;

  }
  getByvitalstatisticsId() {
    if (!this.updateId) {
      return;
    }
    this.isUpdateBtnInVisible = false;
    this.vitalStatisticsService.getbyvitalstatistics(this.updateId).subscribe((res: any) => {
      this.updatebutton = true;
      this.submitbutton = false;
      const { vitalstatisticsname, vitalstatisticscode, vitalstatisticsdescription } = res;
      this.VitalStatisticsForm.patchValue({
        vitalstatisticsname: vitalstatisticsname,
        vitalstatisticscode: vitalstatisticscode,
        vitalstatisticsdescription: vitalstatisticsdescription

      })
    })
  }

  SubmitCreate() {
    

    if (this.VitalStatisticsForm.value.vitalstatisticsname == null || this.VitalStatisticsForm.value.vitalstatisticsname == "" || this.VitalStatisticsForm.value.vitalstatisticsname == undefined) {
      $("#vitalstatisticsname").focus();
      this.swal("Info", "Please Enter Vital Statistics Name", 'info');
      return;
    }
    if (this.VitalStatisticsForm.value.vitalstatisticscode == null || this.VitalStatisticsForm.value.vitalstatisticscode == "" || this.VitalStatisticsForm.value.vitalstatisticscode == undefined) {
      $("#vitalstatisticscode").focus();
      this.swal("Info", "Please Enter Vital Statistics Code", 'info');
      return;
    }
    if (this.VitalStatisticsForm.value.vitalstatisticsdescription == null || this.VitalStatisticsForm.value.vitalstatisticsdescription == "" || this.VitalStatisticsForm.value.vitalstatisticsdescription == undefined) {
      $("#vitalstatisticsdescription").focus();
      this.swal("Info", "Please Enter Vital Statistics Description", 'info');
      return;
    }
    this.vitalStatisticsService.checkDuplicateVitalStatisticsCode(this.VitalStatisticsForm.value.vitalstatisticscode).subscribe((data:any)=>{
      if (data.status == "Present") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Vital Statistics Code is already exist!'
        })
        return;
      }
    })
    this.vitalStatisticsService.checkDuplicateData(this.VitalStatisticsForm.value.vitalstatisticsname).subscribe((data:any)=>{
      if (data.status == "Present") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Vital Statistics Name is already exist!'
        })
        return;
      }
    })
    this.submitted = true;
    if (this.updateId) {
      Swal.fire({
        title: 'Are you sure to update?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
      this.vitalStatisticsService.updatevitalstatistics(this.VitalStatisticsForm.value, this.updateId).subscribe((data: any) => {
        this.dataa = data;
        if (this.dataa.status == "Success") {
          this.swal("Success", this.dataa.message, "success");
          this.router.navigate(['/application/vitalStatisticsView']);

        }
        else if (this.dataa.status == "Failed") {
          this.swal("Error", this.dataa.message, "error");
        }
      })
    }
  })
}
    else {
      Swal.fire({
        title: 'Are you sure  to save?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Save it!'
      }).then((result) => {
        if (result.isConfirmed) {
      this.vitalStatisticsService.save(this.VitalStatisticsForm.value).subscribe((data: any) => {
        this.dataa = data;
        this.VitalStatisticsForm = data.data

        if (this.dataa.status == "Success") {
          this.swal("Success", this.dataa.message, "success");
          this.router.navigate(['/application/vitalStatisticsView']);

        }
        else if (this.dataa.status == "Failed") {
          this.swal("Error", this.dataa.message, "error");
        }
      })
    }
  })
}
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });

  }
  ResetForm() {
    window.location.reload();
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  validateStcCode(){
    // let vitalstatisticscode = this.VitalStatisticsForm.value.vitalstatisticscode;
    // if (vitalstatisticscode.length <= 4) {
    //   $("#vitalstatisticscode").focus();
    //   this.swal("Info", "Vital Statistics code must be more than 5 character", 'info');
    //   return;
    // }
  }
  validateStcName(){
    // let vitalstatisticsname = this.VitalStatisticsForm.value.vitalstatisticsname;
    // if (vitalstatisticsname.length <= 4) {
    //   $("#vitalstatisticsname").focus();
    //   this.swal("Info", "Vital statistics name must be more than 5 character", 'info');
    //   return;
    // }
  }
  cancel(){
    this.router.navigate(['/application/vitalStatisticsView']);
  }
}
