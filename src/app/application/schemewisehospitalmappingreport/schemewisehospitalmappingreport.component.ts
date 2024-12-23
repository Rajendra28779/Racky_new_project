import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { HospitalPackageMappingService } from '../Services/hospital-package-mapping.service';
import { PackageDetailsMasterService } from '../Services/package-details-master.service';
import { QcadminServicesService } from '../Services/qcadmin-services.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { TableUtil } from '../util/TableUtil';


@Component({
  selector: 'app-schemewisehospitalmappingreport',
  templateUrl: './schemewisehospitalmappingreport.component.html',
  styleUrls: ['./schemewisehospitalmappingreport.component.scss']
})
export class SchemewisehospitalmappingreportComponent implements OnInit {

  user:any;
  stateList:any=[];
  districtList:any=[];
  hospitalList:any=[];
  specialist:any;
  hospitalId: any="";
  hospitalname: any='All';
  packageHeaderItem:any=[] ;
  packageHeaderItembkp:any=[] ;
  keyword2 = 'hospitalName';
  state:any;
  dist:any;
  record:any=0;
  txtsearchDate:any
  list:any=[] ;
  showPegi: any;
  pageElement: any;
  currentPage: any;

  constructor(private hospitalService: HospitalPackageMappingService,
    private snoService: SnocreateserviceService,
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    public route: Router,
    public qcadminserv: QcadminServicesService,
    private encryptionService: EncryptionService,
    public packageDetailsMasterService: PackageDetailsMasterService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Scheme wise Hospital mapping');
    this.user = this.sessionService.decryptSessionData('user');
    this.getStateList();
    this.getSchemeDetails();
    this.search();
  }

  getStateList() {
    this.snoService.getStateList().subscribe((response) => {
      this.stateList = response;
    });
  }
  OnChangeState(id) {
    this.snoService.getDistrictListByStateId(id).subscribe((response) => {
      this.districtList = response;
    });
  }

  getHospitalList() {
    let state;
    let dist;
      state = $('#stateId').val();
      dist = $('#districtId').val();
    this.qcadminserv.gettmasactivehospitallist(state, dist).subscribe((response) => {
        this.hospitalList = response;
      });
  }

  selectEvent2(item) {
    this.hospitalId = item.hospitalCode;
    this.hospitalname = item.hospitalName;
    // this.getpackagelist();

  }


  schemecatagory: any=2;
  schemeList: any = [];
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.schemeList = resData.data;
      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  clearEvent2() {
    this.hospitalId = '';
    this.hospitalname = 'All';
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  onReset(){
    window.location.reload();
  }

  search(){
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    this.hospitalService.getschemehospitalmappingrpt(this.state,this.dist,this.schemecatagory,this.hospitalId,this.user.userId).subscribe((response:any) => {
      if(response.status == 200) {
        this.list = response.data;
        this.record = this.list.length;
        if (this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      }else{
        this.swal('Error',"Something Went Wrong","error");
      }
    });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'State Name', 'District Name', 'Hospital Name', 'Speciality', 'Scheme Category','Is Pre-Auth Required']];
  downloadReport(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.stateName);
      this.sno.push(sna.distName);
      this.sno.push(sna.hospitalname);
      this.sno.push(sna.packagename);
      this.sno.push(sna.scheme);
      this.sno.push(sna.preauth);
      this.report.push(this.sno);
    }
    let statename:any='All';
    for(let j=0; j < this.stateList.length;j++){
      if(this.stateList[j].stateCode==this.state){
        statename=this.stateList[j].stateName;
      }
    }
    let distname:any='All'
    for(let j=0; j < this.districtList.length;j++){
      if(this.districtList[j].districtcode==this.dist){
        distname=this.districtList[j].districtname;
      }
    }
    let schemename="All";
    for (const element of this.schemeList) {
      if (this.schemecatagory == element.schemeCategoryId) {
        schemename = element.categoryName;
      }
    }
    if (no == 1) {
      let filter = [];
      filter.push([['State Name:- ', statename]]);
      filter.push([['District Name:- ', distname]]);
      filter.push([['Hospital Name:- ', this.hospitalname]]);
      filter.push([['Scheme Category:- ', schemename]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Scheme wise Hospital Mapping Report',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(18);
      doc.text("Scheme wise Hospital Mapping Report", 50, 15);
      doc.setFontSize(11);
      doc.text('State Name :- ' + statename, 15, 25);
      doc.text('District Name :- ' + distname, 140, 25);
      doc.text('Hospital Name :- ' + this.hospitalname, 15, 32);
      doc.text('Scheme Category :- ' + schemename, 140, 32);
      doc.text('GeneratedOn :- ' + generatedOn, 130, 39);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 39);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 43,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Scheme_wise_Hospital_Mapping_Report.pdf');
    }
  }
}
