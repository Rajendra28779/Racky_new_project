import { Component, OnInit } from '@angular/core';
import {HeaderService} from "../../header.service";
import {SnocreateserviceService} from "../../Services/snocreateservice.service";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import Swal from "sweetalert2";
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-hospital-uid-auth-configuration-view',
  templateUrl: './hospital-uid-auth-configuration-view.component.html',
  styleUrls: ['./hospital-uid-auth-configuration-view.component.scss']
})
export class HospitalUidAuthConfigurationViewComponent implements OnInit {

  stateCode: any="";
  textSearch: any;
  districtCode: any="";
  hospitalCode: any="";
  stateList: any[] = [];
  districtList: any[] = [];
  hospitalList: any[] = [];
  allRecordsSize: any;
  showPegi: boolean=false;
  pageElement: any= 100;
  currentPage: any = 1;
  configList: any[] = [];
  user:any;

  constructor(
    public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private qcadminServices: QcadminServicesService,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital UID Auth Configuration');
    this.user = this.sessionService.decryptSessionData('user');
    this.getStateList();
    this.fetchDetails();
  }


  getStateList() {
    this.stateList = [];
    this.snoService.getStateList().subscribe(
      (response: any) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  onChangeState(id) {
    this.stateCode = id;
    $("#districtId").val("");
    this.hospitalList = [];
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response: any) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  onChangeDistrict(id) {
    this.districtCode = id;
    this.hospitalList = [];
    this.qcadminServices.gettmasactivehospitallist(this.stateCode,id).subscribe(
      (response: any) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  reset() {
    this.configList = [];
    $('#stateId').val('');
    $('#districtId').val('');
    $('#hosId').val('');
    this.showPegi=false;
  }

  fetchDetails() {
    this.hospitalCode=$('#hosId').val();
    let data = {
      stateCode: this.stateCode ?? '',
      districtCode: this.districtCode ?? '',
      hospitalCode: this.hospitalCode ?? ''
    };
    this.configList = [];
    this.qcadminServices.getMappedAuthDetailsview(data).subscribe((response: any) => {
      if(response.status==200){
          this.configList = response.data;
          this.allRecordsSize = this.configList.length;
          this.showPegi = this.allRecordsSize > 0;
        }else{
          Swal.fire({title: "Error",text: "Something Went Wrong",icon: "error"});
        }
    });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Hospital Name', 'Hospital Code', 'OTP', 'IRIS', 'POS', 'FACE']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.configList.length; i++) {
      sna = this.configList[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.hospitalName);
      this.sno.push(sna.hospitalCode);
      this.sno.push(sna.otp);
      this.sno.push(sna.iris);
      this.sno.push(sna.pos);
      this.sno.push(sna.face);
      this.report.push(this.sno);
    }
    let stateName:any='All';
    let distname:any='All';
    let hospitalname:any='All';

    for (let j = 0; j < this.stateList.length; j++) {
      if (this.stateList[j].stateCode == this.stateCode) {
        stateName  = this.stateList[j].stateName;
      }
    }
    for (let j = 0; j < this.districtList.length; j++) {
      if (this.districtList[j].districtcode == this.districtCode) {
        distname = this.districtList[j].districtname;
      }
    }
    for (let j = 0; j < this.hospitalList.length; j++) {
      if (this.hospitalList[j].hospitalCode == this.hospitalCode) {
        hospitalname = this.hospitalList[j].hospName;
      }
    }

    if (no == 1) {
      let filter = [];
      filter.push([['State Name', stateName]]);
      filter.push([['District Name', distname]]);
      filter.push([['Hospital Name', hospitalname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Hospital Authentication Mapping View',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        Swal.fire({title: "Info",text: "No Record Found",icon: "info"});
        return;
      }
      var doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Hospital Authentication Mapping View", 90, 15);
      doc.setFontSize(14);
      doc.text('State Name :- ' + stateName, 15, 25);
      doc.text('District Name :- ' + distname, 170, 25);
      doc.text('Hospital Name :- ' + hospitalname, 15, 32);
      doc.text('GeneratedOn :- ' + generatedOn, 170, 39);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 39);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 45,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Hospital_Authentication_Mapping_View.pdf');
    }
  }

  hospname:any;
  hospcode:any;
  loglist:any=[];
  log(item:any){
    this.hospcode=item.hospitalCode;
    this.hospname=item.hospitalName;
    this.qcadminServices.getMappedAuthDetailslog(this.hospcode).subscribe((response: any) => {
      if(response.status==200){
          this.loglist = response.data;
        }else{
          Swal.fire({title: "Error",text: "Something Went Wrong",icon: "error"});
        }
    });
  }

  heading1 = [['Sl#', 'Verification Mode', 'Allow Status', 'Updated By', 'Updated On']];
  downloadList1(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.loglist.length; i++) {
      sna = this.loglist[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.verificationMode);
      this.sno.push(sna.allowstatus);
      this.sno.push(sna.logcreatby);
      this.sno.push(sna.logcreatedon);
      this.report.push(this.sno);
    }

    if (no == 1) {
      let filter = [];
      filter.push([['Hospital Name', this.hospname + ' ('+this.hospcode+')']]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Hospital Authentication Mapping Log View',
        this.heading1, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        Swal.fire({title: "Info",text: "No Record Found",icon: "info"});
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Hospital Authentication Mapping Log View", 40, 15);
      doc.setFontSize(14);
      doc.text('Hospital Name :- ' + this.hospname + ' ('+this.hospcode+')', 15, 25);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 32);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 39);
      autoTable(doc, {
        head: this.heading1,
        body: this.report,
        theme: 'grid',
        startY: 45,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Hospital_Authentication_Mapping_Log_View.pdf');
    }
  }

}
