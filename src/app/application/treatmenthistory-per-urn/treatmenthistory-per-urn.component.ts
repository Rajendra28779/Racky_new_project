import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import { TreatmenthistoryperurnService } from '../Services/treatmenthistoryperurn.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-treatmenthistory-per-urn',
  templateUrl: './treatmenthistory-per-urn.component.html',
  styleUrls: ['./treatmenthistory-per-urn.component.scss']
})
export class TreatmenthistoryPerUrnComponent implements OnInit {
  form:FormGroup;
  trtData: any = [];
  submitted: boolean = false;
  isVisible: boolean = false;
  urnno:any;
  txnId:any;

  constructor(private treatmenthistoryperurn: TreatmenthistoryperurnService,public fb: FormBuilder,public headerService:HeaderService, private route: Router) {
    this.txnId =
      this.route.getCurrentNavigation().extras.state['transactionId'];
    console.log(this.txnId);

  }

  ngOnInit(): void {
    let urno=this.txnId;

    this.treatmenthistoryperurn.searchbyUrn1(urno).subscribe(data=>{
      console.log("Data Rec.")
      console.log(data);
      this.trtData=data;
      console.log(this.trtData);

    })
    this.headerService.setTitle("Treatment History As Per URN");
    this.searchHistory = this.fb.group({
      urnno: ['', Validators.required],

    });
    // this.getTreatmentHestory();

  }
  
  searchHistory=new FormGroup({
    urnno:new FormControl(''),

  });
  searchTreatmentData(){
    this.submitted = true;
        if (this.searchHistory.invalid) {
          Swal.fire("", "This field can't be blank !!", 'warning');
          return;
        }

    this.treatmenthistoryperurn.searchbyUrn(this.searchHistory.value).subscribe(data=>{
      console.log(data);
      this.trtData=data;
      console.log(this.trtData);

    })
    this.submitted = false;
    this.isVisible=true;

  }

  get f() {
    return this.searchHistory.controls;
  }
  // getTreatmentHestory(){
  //   this.treatmenthistoryperurn.treatmentHestory(this.urnno).subscribe(data => {
  //     alert("Data value : " + JSON.stringify(data))
  //     this.trtData = data;
  //     // this.record1 = this.rIBean.length;
  //     // if (this.record1 > 0) {
  //     //   this.showPegi = true;
  //     // }
  //     // else {
  //     //   this.showPegi = false;
  //     // }





  //   })


  //}


  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
