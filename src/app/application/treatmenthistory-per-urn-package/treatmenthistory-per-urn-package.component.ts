import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {TreatementhistoryService} from 'src/app/application/Services/treatementhistory.service';
import { HeaderService } from '.././header.service';

@Component({
  selector: 'app-treatmenthistory-per-urn-package',
  templateUrl: './treatmenthistory-per-urn-package.component.html',
  styleUrls: ['./treatmenthistory-per-urn-package.component.scss']
})
export class TreatmenthistoryPerUrnPackageComponent implements OnInit {
  urnno:any;

  txnId:any;
  isClick:boolean = false;
  form:FormGroup;
  P:any;
  treatmenthistory: any;
  txnIdfor:any;
  UrnFor={
    urnno:"",
    package:""
  }
  constructor(private treatementhistory:TreatementhistoryService,public headerService:HeaderService,private route: Router) {
    this.txnIdfor =
    this.route.getCurrentNavigation().extras.state['transaction'];


  }

  ngOnInit(): void {

    //  let urno=this.txnId;
this.UrnFor.urnno=this.txnIdfor.urnNo;
this.UrnFor.package=this.txnIdfor.Packagecode;
    let packagecode=this.txnId;
   this.treatementhistory.getserch1(this.UrnFor.urnno, this.UrnFor.package).subscribe(data=>{
    this.treatmenthistory=data;
    console.log(this.treatmenthistory)
    console.log(this.treatmenthistory)

  });

    this.headerService.setTitle("Treatment List");
  }
  serch=new FormGroup({
    urnno:new FormControl(''),
    Packagecode:new FormControl('')
  });
  serchlist(){

    this.isClick=true;
    this.treatementhistory.getserch(this.serch.value).subscribe(data=>{
      this.treatmenthistory=data;
      console.log(this.treatmenthistory)
      console.log(this.treatmenthistory)

    });
  }

}
