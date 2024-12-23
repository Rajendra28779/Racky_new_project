import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { HospitalService } from '../../Services/hospital.service';
import { MisreportService } from '../../Services/misreport.service';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitalbackdateconfig',
  templateUrl: './hospitalbackdateconfig.component.html',
  styleUrls: ['./hospitalbackdateconfig.component.scss']
})
export class HospitalbackdateconfigComponent implements OnInit {

  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  user:any;
  hospcode:any;
  hospname:any;
  distcode:any;
  distname:any;
  statecode:any;
  statename:any;
  keyword: any = 'hospitalName';
  keyword1: any = 'districtname';
  keyword2: any = 'stateName';
  backdateadd:any="";
  backdatedis:any="";

  constructor(private route:Router, public headerService: HeaderService,public qcadminserv: QcadminServicesService,private snoService: SnocreateserviceService,private hospitaService: HospitalService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Hospital BackDate Config");
    this.user = this.sessionService.decryptSessionData("user");
    this.getStateList();
  }
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $("#districtId").val("");
       localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;


      },
      (error) => console.log(error)
    )
  }


  OnChangeDistrict(id) {
        var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {

        this.hospitalList = response;


      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    this.hospcode = item.hospitalCode;
    this.hospname = item.hospitalName;
    this.qcadminserv.getDatabyhospitalCode(this.hospcode).subscribe(
      (data:any) => {
      this.backdateadd=data.backdateadmissiondate
      this.backdatedis=data.backdatedischargedate

    },
    (error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    }
  );
    }
onReset() {
  this.hospcode="";
}
  selectEvent2(item) {
    this.statecode = item.stateCode;
    this.statename = item.stateName;
    localStorage.setItem("stateCode", this.statecode);
    this.snoService.getDistrictListByStateId(this.statecode).subscribe(
      (response) => {
        this.districtList = response;


      },
      (error) => console.log(error)
    )
    }
onReset2() {
  this.statecode="";
}
  selectEvent1(item) {
    this.distcode = item.districtcode;
    this.distname = item.districtname;
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(this.distcode, stateCode).subscribe(
      (response) => {

        this.hospitalList = response;


      },
      (error) => console.log(error)
    )
    }
onReset1() {
  this.distcode="";
}
swal(title: any, text: any, icon: any) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text
  });
}

reset(){
  window.location.reload();
}

update(){

  let admission=$('#addmission').val();
  let discharge=$('#discharge').val();

  if (this.statecode==null || this.statecode== "" || this.statecode==undefined){
    this.swal("Info", "Please Fill State Name", 'info');
    return;
  }
  if (this.distcode==null || this.distcode== "" || this.distcode==undefined){
    this.swal("Info", "Please Fill District Name", 'info');
    return;
  }
  if (this.hospcode==null || this.hospcode== "" || this.hospcode==undefined){
    this.swal("Info", "Please Fill Hospital Name", 'info');
    return;
  }
  if (admission==null || admission== "" || admission==undefined){
    this.swal("Info", "Please Fill BackDate Admission Allower For", 'info');
    return;
  }
  if (admission>365){
    this.swal("Info", "Days cannot Be More then 365", 'info');
    return;
  }

  if (discharge==null || discharge== "" || discharge==undefined){
    this.swal("Info", "Please Fill BackDate Discharge Allower For", 'info');
    return;
  }
  if (discharge>365){
    this.swal("Info", "Days cannot Be More then 365", 'info');
    return;
  }

  this.hospitaService.updatebackdateconfig(admission,discharge,this.hospcode,this.user.userId).subscribe((data:any)=>{
    if(data.status==200){
      this.swal("Success", data.message, "success");
      this.route.navigate(['/application/hospitalbackdateconfigview']);
    }else{
      this.swal("Error", data.message, "error");
    }
  },
  (error) => {
    console.log(error);
    this.swal('', 'Something went wrong.', 'error');
  }
);

}

}
