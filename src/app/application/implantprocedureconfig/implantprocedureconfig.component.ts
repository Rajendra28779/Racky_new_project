import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { HeaderService } from '../header.service';
import { HospitalPackageMappingService } from '../Services/hospital-package-mapping.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import Swal from 'sweetalert2';
import { ImplantMasterService } from '../Services/implant-master.service';

@Component({
  selector: 'app-implantprocedureconfig',
  templateUrl: './implantprocedureconfig.component.html',
  styleUrls: ['./implantprocedureconfig.component.scss']
})
export class ImplantprocedureconfigComponent implements OnInit {
  keyword: string = 'packageheadername';
  keyword1: string = 'procedureDescription';
  packageHeaderItem: any = [];
  packageList: any = [];
  packageheadercode: any;
  procedure: any;
  placeHolder = "Select Package Code";
  Obj:any
  user:any;
  icddata:any=[];
  showtable:any;
  txtsearchDate:any;
  @ViewChild('auto') auto;

  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private hospitalService: HospitalPackageMappingService,
    private sessionService: SessionStorageService,
    private implantmaster:ImplantMasterService) {}

  ngOnInit(): void {
    this.headerService.setTitle("Implant Procedure Mapping");
    this.user = this.sessionService.decryptSessionData("user");
    this.getPackageHeader();
  }

  getPackageHeader() {
    this.hospitalService.getallPackageHeaders().subscribe((data: any) => {
      this.packageHeaderItem = data;
    });
  }

  selectEvent(item) {
    this.packageheadercode = item.packageheadercode;
    this.getPackageName();
  }

  clearEvent() {
    this.packageheadercode = "";
    this.packageList=[];
    this.clearEvent1();
    this.auto.clear();
  }

  getPackageName() {
    this.snoService.getPackageName(this.packageheadercode).subscribe((response:any) => {
        if (response.status == 'success') {
          let data = JSON.parse(response.data);
          this.packageList = data.packageArray;
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
        }
      }
    );
  }

  selectEvent1(item) {
    this.procedure=item.procedureCode;
    this.geticddetails();
  }

  clearEvent1() {
    this.procedure="";
    this.icddata=[];
    this.showtable=false;
  }


  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  resetVal(){
    window.location.reload();
  }

  geticddetails(){
    this.implantmaster.getpackageicddetails(this.procedure).subscribe((response:any) => {
      if (response.status == 200) {
        this.icddata = response.data;
        this.showtable=true;
      } else {
        this.swal('Error', 'Something went wrong.', 'error');
      }
    });
  }

  dataIdArray:any[] = [];

  checkAllCheckBox(event: any) {
    this.dataIdArray = [];
    if (event.target.checked) {
      for (let i = 0; i < this.icddata.length; i++) {
        $('#' + this.icddata[i].implantcode).prop('checked', true);
        if(this.icddata[i].status==1){
          this.tdCheck(this.icddata[i]);
        }
      }
    } else {
      for (let i = 0; i < this.icddata.length; i++) {
        $('#' + this.icddata[i].implantcode).prop('checked', false);
        if(this.icddata[i].status==0){
          this.tdCheck(this.icddata[i]);
        }
      }
    }
  }

  tdCheck(implant:any) {
    let obj={
      implantcode:'',
      status:0,
      id:''
    }

    obj.implantcode = implant.implantcode;
    obj.id = implant.mappingid;
    obj.status = implant.status == 0 ? 1 : 0;

    let stat = false;
    for (const i of this.dataIdArray) {
      if (i.implantcode == obj.implantcode) {
        stat = true;
      }
    }

      if (stat == false) {
        this.dataIdArray.push(obj);
      } else {
        for (let i = 0; i < this.dataIdArray.length; i++) {
          if (implant.implantcode == this.dataIdArray[i].implantcode) {
            let index = this.dataIdArray.indexOf(this.dataIdArray[i]);
            if (index !== -1) {
              this.dataIdArray.splice(index, 1);
            }
          }
        }
      }
    }

  submit(){
    console.log(this.dataIdArray);
    if(this.packageheadercode==null || this.packageheadercode==""|| this.packageheadercode==undefined){
      this.swal('Info', 'Please Select Speciality Name !!', 'info');
      return ;
    }
    if(this.procedure==null || this.procedure==""|| this.procedure==undefined){
      this.swal('Info', 'Please Select Package Code !!', 'info');
      return ;
    }
    if(this.dataIdArray.length==0){
      this.swal('Info', 'Please Select Atleast One Implant Code !!', 'info');
      return ;
    }

    let object={
      procedure:this.procedure,
      selectlist:this.dataIdArray,
      createdby:this.user.userId,
    }
    this.implantmaster.saveimplantconfiguration(object).subscribe((response:any) => {
      if (response.status == 200) {
        this.dataIdArray=[];
        this.swal('Successful', 'Implant Procedure Mapped Successfully', 'success');
        this.geticddetails();
        this.auto.clear();
        this.route.navigate(['/application/implantprocedureconfigview']);
      } else {
        this.swal('Error', 'Something went wrong.', 'error');
      }
    });
  }

}
