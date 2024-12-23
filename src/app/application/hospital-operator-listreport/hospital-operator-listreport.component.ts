import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { UsercreateService } from './../Services/usercreate.service';
import { Router, NavigationExtras } from '@angular/router';
import { HeaderService } from './../header.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableUtil } from './../util/TableUtil';
import { SnopipePipe } from './../pipes/snopipe.pipe';
import { HospitaloperatorService } from './../Services/hospitaloperator.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '@angular/common';
import { dataList } from 'src/app/creategroup/creategroupservicde.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { QcadminServicesService } from '../Services/qcadmin-services.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospital-operator-listreport',
  templateUrl: './hospital-operator-listreport.component.html',
  styleUrls: ['./hospital-operator-listreport.component.scss']
})
export class HospitalOperatorListreportComponent implements OnInit {

  constructor(public qcadminserv: QcadminServicesService,
    private route: Router,
    public headerService: HeaderService,
    private hospoitalservice:HospitaloperatorService,
    private snoService: SnocreateserviceService,private sessionService: SessionStorageService
    ) { }

    @ViewChild('auto') auto;
    @ViewChild('autocopy') autocopy;
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate:any;
  userData:any=[];
  stateList:any=[];
  districtList:any=[];
  hospitalList:any=[];
  hospitalcode:any="";
  hospitalname:any="All";
  keyword2 = "hospitalName";
  state:any="";
  dist:any="";
  user:any;
  showfilter:Boolean=true;
  hospname:any;
  statename:any="All";
  distname:any="All"
  @ViewChild('closebutton') closebutton;

  ngOnInit(): void {
    this.headerService.setTitle("Hospital Operator Details");
    this.user=this.sessionService.decryptSessionData("user");
    if(this.user.groupId==4){this.showfilter=false;}
    this.getStateList();
  }

  search(){
    this.userData = [];
    let userid="";
    if(!this.showfilter){
      this.state = "";this.dist=""
      userid=this.user.userId
    }else{
      this.state= $('#stateId').val();
      this.dist=$('#districtId').val();
    }
        // it will give the hospital name and operator count count list
        //-----------------------------------------------------------
    // this.hospoitalservice.gethospwiseoperatorcount(this.state,this.dist,this.hospitalcode,userid).subscribe((data:any)=>{
    //   this.userData = data;
    //   this.record = this.userData.length;
    //   if (this.record > 0) {
    //     this.pageElement=100;
    //     this.currentPage=1
    //     this.showPegi = true;
    //   }
    //   else {
    //     this.showPegi = false;
    //   }
    // })
      //-----------------------------------------------------------
      // it will give the hospital name and operator count count list

      // it will give the hospital name and operator list
      //-----------------------------------------------------------
    this.hospoitalservice.gethospwiseoperatorlistreport(this.state,this.dist,this.hospitalcode,userid).subscribe((data:any)=>{
      this.userData = data;
      this.record = this.userData.length;
      if (this.record > 0) {
        this.pageElement=100;
        this.currentPage=1
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    });
    //-----------------------------------------------------------
    // it will give the hospital name and operator list
  }

  reset(){
    $('#stateId').val("");
    $('#districtId').val("");
    this.auto.clear();
    this.hospitalList = [];
    this.hospitalcode="";
    this.hospitalname="All";
    this.search();
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        this.search();
      },
      (error) => console.log(error)
    );
  }
  OnChangeState(id) {
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        this.getHospitalList();
      },
      (error) => console.log(error)
    )
  }
  getHospitalList() {
    let state= $('#stateId').val();
    let dist=$('#districtId').val();
    this.qcadminserv.gettmasactivehospitallist(state, dist).subscribe(
      (response) => {
        this.auto.clear();
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent2(item) {
    this.hospitalcode = item.hospitalCode;
    this.hospitalname = item.hospitalName;
  }

  clearEvent2() {
    this.hospitalcode = '';
    this.hospitalname = '';
  }

  hospitaloperalist:any=[];
  details(hospitalcode:any,hospitalname:any){
    this.hospname=hospitalname;
    let operaterlist=[];
    this.hospitaloperalist=[];
    this.hospoitalservice.getUserDetails(hospitalcode).subscribe((alldta:any) => {
      operaterlist=alldta;
        operaterlist.forEach((element) => {
          if(element.statusFlag==0){
            this.hospitaloperalist.push(element);
          }
        });
    });

  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  report: any = [];
  sna: any = {
    state: "",
    district: "",
    hospital: "",
    hospmobile: "",
    fullname: "",
    mobile: "",
  };
  heading = [['Sl No',  'Hospital State Name', 'Hospital District Name','Hospital Name','Hospital Mobile No', 'Operator Name', 'Operator Mobile No']];

  downloadReport(no:any) {
    this.report = [];
    let item: any;
    for(var i=0;i<this.userData.length;i++) {
      item = this.userData[i];
      this.sna = [];
      this.sna.slNo = i+1;
      this.sna.state = item.stateCode;
      this.sna.district = item.distCode;
      this.sna.hospital = item.hospitalname;
      this.sna.hospmobile = item.hospmobile;
      this.sna.fullname = item.fullName;
      this.sna.mobile = item.mobileNo;
      this.report.push(this.sna);
    }

    for(let j=0; j < this.stateList.length;j++){
      if(this.stateList[j].stateCode==this.state){
        this.statename=this.stateList[j].stateName;
      }
    }
    for(let j=0; j < this.districtList.length;j++){
      if(this.districtList[j].districtcode==this.dist){
        this.distname=this.districtList[j].districtname;
      }
    }
    if(no==1){
      let filter =[];
      if(this.showfilter){
        filter.push([["State name",this.statename]]);
        filter.push([["District name",this.distname]]);
        filter.push([["Hospital name",this.hospitalname]]);
      }
        TableUtil.exportListToExcelWithFilter(
          this.report,
          ' Hospital Operator List Report',
          this.heading,filter
        );
    }else{
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.user.fullName;
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("Hospital Operator List Report", 70, 15);
      doc.setFontSize(12);
      doc.text('GeneratedOn :- '+generatedOn,110,23);
      doc.text('GeneratedBy :- '+generatedBy,15,23);
      if(this.showfilter){
      doc.text('State Name :- '+this.statename,110,31);
      doc.text('District Name :- '+this.distname,15,31);
      doc.text('Hospital Name :- '+this.hospitalname,15,39);
      }
            var rows = [];
            for(var i=0;i<this.report.length;i++) {
              var clm = this.report[i];
              var pdf = [];
              pdf[0] = clm.slNo;
              pdf[1] = clm.state;
              pdf[2] = clm.district;
              pdf[3] = clm.hospital;
              pdf[4] = clm.hospmobile;
              pdf[5] = clm.fullname
              pdf[6] = clm.mobile;
              rows.push(pdf);
            }
            autoTable(doc, {
              head: this.heading,
              body: rows,
              theme: 'grid',
              startY: 45,
              headStyles: {
                fillColor: [26, 99, 54]
              },
              columnStyles: {
                0: {cellWidth: 10},
                // 1: {cellWidth: 42},
                // 2: {cellWidth: 42},
                // 3: {cellWidth: 42},
                // 4: {cellWidth: 42},

              }
            });
            doc.save(' Hospital Operator List Report.pdf');
    }
  }
  modalData:any;
  action(data){
    this.modalData = data;
  }
  maxChars = 500;
  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  submit(){
    let remarks = $("#remarks").val();
    if(this.status == 1){
      if (remarks == null || remarks == "" || remarks == undefined) {
        $("#remarks").focus();
        this.swal("Info", "Please Enter Remarks", 'info');
        return;
      }
    }
    let data = {
      uId: this.modalData.operatorId,
      status: this.status,
      remarks:remarks
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Update this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospoitalservice.actionOperatorUser(data).subscribe(data => {
          if (data == 1) {
            this.swal("Success", "User updated Successfully", "success");
            this.closebutton.nativeElement.click();
            this.search();
          }   else {
            this.swal("Error", "Some Error Occured", "error");
          }
        },
          (error: any) => {
            this.swal("Error", error, 'error');
          });
      }
    });
  }
  cancel(){

  }
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  yes($event: any) {
    this.status = 0;
  }
  status:any;
  no($event: any) {
    this.status = 1;
  }
}
