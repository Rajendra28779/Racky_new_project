import { Component, OnInit } from '@angular/core';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { HeaderService } from '../../header.service';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospital-civil-infra-view',
  templateUrl: './hospital-civil-infra-view.component.html',
  styleUrls: ['./hospital-civil-infra-view.component.scss']
})
export class HospitalCivilInfraViewComponent implements OnInit {
  user:any;
  hospitalId:any='';
  hospitalname:any;
  hospitalList:any=[];
  keyword2 = "hospitalName";
  saveorupdate="SAVE";
  stateList: any=[];
  districtList: any=[];
  groupType:any;
  userName:any;
  constructor(private snoService: SnocreateserviceService,public headerService: HeaderService,public route: Router,
    public qcadminserv: QcadminServicesService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('View');
    this.user = this.sessionService.decryptSessionData("user");
    this.groupType=this.user.groupId;
    this.userName=this.user.userName;
    console.log(this.user);
    if(this.groupType==5){
      this.getHospitalDetailsfromCode(this.userName);
      // this.getStateList();
      // this.getHospitalCivilInfraList();
    }else{
      this.getStateList();
      this.getHospitalList();
    }
  }
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        if(this.groupType==5){
          this.OnChangeState(this.stateId);
        }
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
    let state= this.stateId;
    let dist=this.districtId;
    this.qcadminserv.gettmasactivehospitallist(state,dist).subscribe(
      (response) => {
        this.hospitalList = response;
        console.log(response)
      },
      (error) => console.log(error)
    )
  }
  selectEvent2(item) {
    this.hospitalId = item.hospitalId;
    this.hospitalname = item.hospitalName;
  }
  clearEvent2() {
    this.hospitalId = '';
    this.hospitalname = '';
  }
  stateId:any='';
  districtId:any='';
  getHospitalDetailsfromCode(hospitalCode:any){
    this.qcadminserv.getHospitaldetailsFromCode(hospitalCode).subscribe(
      (response:any) => {
        console.log(response);
        debugger;
        let details=response;
        this.stateId=details[0].stateCode;
        this.districtId=details[0].districtCode;
        this.getStateList();
        this.hospitalId = details[0].hospitalId;
        this.hospitalname = details[0].hospitalName;
        this.getHospitalCivilInfraList();
        // this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
showPegi: boolean;
record: any;
currentPage: any;
pageElement: any;
civilInfraList:any;
  getHospitalCivilInfraList(){
    let stateId=this.stateId;
    let distId=this.districtId;
    let hospitalId=this.hospitalId;
    if (stateId == null || stateId == "" || stateId == undefined) {
      this.swal("Info", "Please Select State", 'info');
      return;
    }
    // if (distId == null || distId == "" || distId == undefined) {
    //   this.swal("Info", "Please Select District", 'info');
    //   return;
    // }
    this.qcadminserv.getEmphospitallist(stateId,distId,hospitalId,this.user.userId).subscribe(
      (data:any) => {
        console.log(data);
        this.civilInfraList=data.infraList;
        this.record = this.civilInfraList.length;
       if (this.record > 0) {
        this.showPegi = true;
        this.currentPage = 1;
        this.pageElement = 10;
      }
      else {
        this.showPegi = false;
        this.swal("Info", "No Record Found", 'info');
      }
      },
      (error) => console.log(error)
    );
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  resetField(){
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  heading1 = [
    [
      'Sl#',
      'Hospital Name',
      'State Name',
      'District Name',
      'Total Bed Strength',
      'No. Of InPatient Bed',
      'Fully Equiped Operation Theatre',
      'Total No Of Beds Fully Equiped Operation Theatre ',
      'OPD',
      'HDU',
      'No Of Bed HDU',
    ],
  ];
  SNALISt1: any = {
    slno: "",
    hospitalName:"",
    stateName:"",
    districtName:"",
    totalBedStrength: "",
    inPatientBedStrength:"",
    fullyOPTh: "",
    noFullyOpTh: "",
    opd: "",
    hdu: "",
    noOfBedHdu: ""
  };
  report:any=[];
  downloadReport() {
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.civilInfraList.length; i++) {
      sna = this.civilInfraList[i];
      this.SNALISt1 = [];
      this.SNALISt1.slno = i + 1;
      this.SNALISt1.hospitalName=sna.hospitalName;
      this.SNALISt1.stateName=sna.stateName;
      this.SNALISt1.districtName=sna.districtName;
      this.SNALISt1.totalBedStrength = sna.totalBedStrength;
      this.SNALISt1.inPatientBedStrength=sna.noOfInpatientBed;
      this.SNALISt1.fullyOPTh = sna.fully_equ_oprn_thtr;
      this.SNALISt1.noFullyOpTh = sna.total_no_beds_fully_equ_oprn_thtr;
      this.SNALISt1.opd = sna.opd;
      this.SNALISt1.hdu = sna.hdu;
      this.SNALISt1.noOfBedHdu= sna.total_bed_hdu;
      this.report.push(this.SNALISt1);
    }
    let stateName = 'All',hospitalName='All',districtName = 'All';
      for (var i = 0; i < this.stateList.length; i++) {
        if (this.stateId == this.stateList[i].stateCode) {
          stateName = this.stateList[i].stateName;
        }
      }
      for(var i=0;i<this.districtList.length;i++) {
        if(this.districtId==this.districtList[i].districtcode) {
          districtName=this.districtList[i].districtname;
        }
      }
      if(this.hospitalId!=null && this.hospitalId!='' && this.hospitalId!=undefined){
        hospitalName=this.hospitalname;
      }
      let filter =[];
      filter.push([['State Name', stateName]]);
      filter.push([['District Name', districtName]]);
      filter.push([['Hospital Name', hospitalName]]);
    TableUtil.exportListToExcelWithFilter(this.report, 'Hospital_Civil_Infrastructure_view', this.heading1, filter);
  }
  downloadPdf() {
    var doc = new jsPDF('l', 'mm', [280, 210]);
    doc.setFontSize(12);
    let stateName = 'All',hospitalName='All',districtName = 'All';
      for (var i = 0; i < this.stateList.length; i++) {
        if (this.stateId == this.stateList[i].stateCode) {
          stateName = this.stateList[i].stateName;
        }
      }
      for(var i=0;i<this.districtList.length;i++) {
        if(this.districtId==this.districtList[i].districtcode) {
          districtName=this.districtList[i].districtname;
        }
      }
      if(this.hospitalId!=null && this.hospitalId!='' && this.hospitalId!=undefined){
        hospitalName=this.hospitalname;
      }
      doc.text('State Name:'+stateName, 10, 10);
      doc.text('District Name:'+districtName, 90, 10);
      doc.text('Hospital Name:'+hospitalName, 180, 10);
      doc.text("Generated On: "+this.convertDate(new Date()), 10, 20);
      doc.text("Generated By: "+this.sessionService.decryptSessionData("user").fullName, 180, 20);
      doc.text("Hospital_Civil_Infrastructure_view", 110, 30);
    var col = this.heading1;
    var rows = [];
    var claim: any;
    for(var i=0;i<this.civilInfraList.length;i++) {
      claim = this.civilInfraList[i];
      var temp = [i+1, claim.hospitalName,claim.stateName, claim.districtName,claim.totalBedStrength, claim.noOfInpatientBed,claim.fully_equ_oprn_thtr,
      claim.total_no_beds_fully_equ_oprn_thtr,claim.opd,claim.hdu,claim.total_bed_hdu];
      rows.push(temp);
    }
    autoTable(doc, {
      head: col,
      body: rows,
      theme: 'grid',
      startY: 40,
      styles: {overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20},
      bodyStyles: {overflow: 'linebreak',cellWidth: 'wrap',lineWidth: 0.1, lineColor: 0, textColor: 20},
      headStyles: {overflow: 'linebreak',cellWidth: 'wrap',lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255],fillColor: [26, 99, 54]},
      columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 25},
          2: {cellWidth: 25},
          3: {cellWidth: 20},
          4: {cellWidth: 25},
          5: {cellWidth: 30},
          6: {cellWidth: 20},
          7: {cellWidth: 20},
          8: {cellWidth: 20},
          9: {cellWidth: 20},
          10:{cellWidth:20},
      }
    });
    doc.save('Hospital_Civil_Infrastructure_view.pdf');
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
  Details(civilInfraId){
    let state = {
      civilInfraId: civilInfraId,
    };
    localStorage.setItem('civilInfraData', JSON.stringify(state));
    // sessionStorage.setItem('currentPageNum', JSON.stringify(this.currentPage));
    this.route.navigate(['/application/hospitalciviinfraview/view']);
  }
}
