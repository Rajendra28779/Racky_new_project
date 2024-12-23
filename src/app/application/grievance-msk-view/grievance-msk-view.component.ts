import { Component, OnInit } from '@angular/core';
import { HeaderService } from './../header.service';
import { MskgrivanceService } from '../Services/mskgrivance.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-grievance-msk-view',
  templateUrl: './grievance-msk-view.component.html',
  styleUrls: ['./grievance-msk-view.component.scss']
})
export class GrievanceMskViewComponent implements OnInit {
  user:any
  txtsearchDate:any;
  list:any=[];
  public districtList: any = [];
  public hospitalList: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  statename: any="All";
  distname: any="All";
  hospcode:any="";
  hospname:any="All";
  totalcount:any=0;
  keyword1: any = 'hospitalName';
  distcode: any;


  constructor(public headerService: HeaderService,private snoService: SnocreateserviceService,
    private mskservice: MskgrivanceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Mo Sarkar Grievance");
    this.user = this.sessionService.decryptSessionData("user");
    this.OnChangeState(21);
    this.Search();
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
    let stateCode = localStorage.getItem("stateCode");
this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
  (response) => {
    this.hospitalList = response;
  },
  (error) => console.log(error)
 );
}

selectEvent1(item) {
  this.hospcode = item.hospitalCode;
  this.hospname = item.hospitalName;
  }
onReset2() {
this.hospcode="";

}

Search(){
  let statecode=21;
  this.distcode=$('#districtId').val();
  this.mskservice.mskrecordview(statecode,this.distcode,this.hospcode).subscribe((data:any)=>{
    this.list=data;
    this.totalcount=this.list.length
    if(this.totalcount>0){
      this.showPegi=true;
      this.currentPage=1
      this.pageElement=100
    }else{
      this.showPegi=false;
    }
  },(error)=>console.log(error)
  );
}

reset(){
window.location.reload();
}

grivance:any;
doclist:any;
onaction(iten:any){
this.grivance=iten;
this.mskservice.docdetailsbyserviceid(iten.serviceid).subscribe((data:any)=>{
  console.log(data);
this.doclist=data;
},(error)=>console.log(error)
);
}

report: any = [];
  sno: any = {
    Slno: "",
    registration: "",
    grivtype: "",
    casetype: "",
    priority: "",
    benificiary: "",
    gender: "",
    dob: "",
    benificiarycnct: "",
    benificiarystate: "",
    benificiarydist: "",
    benificiaryblock: "",
    benificiaryemail: "",
    grivdesc: "",
    hospstate: "",
    hospdist: "",
    hosp: "",
    cityzen: "",
    grivon: ""
  };
  heading = [['Sl#', 'Registration No','Grievance Type','Case Type', 'Priority Type','Benificiary Name',
'Gender','Date Of Birth','Benificiary Contact No','Benificiary State Name','Benificiary District Name','Benificiary Block Name',
'Benificiary EmailId','Grievance Description','Hospital State Name','Hospital District Name','Hospital Name',
'Cityzen Feedback','grievance On']];

  downloadList(no:any){
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.registration=sna.applicationno;
      this.sno.grivtype=sna.grivtype;
      this.sno.casetype=sna.casetype;
      this.sno.priority=sna.priority;
      this.sno.benificiary=sna.benificiary;
      this.sno.gender=sna.gender;
      this.sno.dob=sna.dateofbirth;
      this.sno.benificiarycnct=sna.contactno;
      this.sno.benificiarystate=sna.state;
      this.sno.benificiarydist=sna.dist;
      this.sno.benificiaryblock=sna.block;
      this.sno.benificiaryemail=sna.email;
      this.sno.grivdesc=sna.grivdesc;
      this.sno.hospstate=sna.hospitalsate;
      this.sno.hospdist=sna.hospitaldist;
      this.sno.hosp=sna.hospitalname;
      this.sno.cityzen=sna.cityzen;
      this.sno.grivon=sna.createon;
      this.report.push(this.sno);
    }
    for(const element of this.districtList){
      if(element.districtcode==this.distcode){
        this.distname = element.districtname;
      }
    }
    let filter =[];
    filter.push([['State Name', 'Odisha']]);
    filter.push([['District Name', this.distname]]);
    filter.push([['Hospital Name', this.hospname]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Mo Sarkar Grievance List',
          this.heading,filter
        );
  }

  downlorddoc(fileName){
    if (fileName != null && fileName != '' && fileName != undefined) {
      let img = this.mskservice.downlorddoc(fileName);
      window.open(img, '_blank');
    }
  }

}
