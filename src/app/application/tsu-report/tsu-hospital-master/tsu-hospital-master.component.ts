import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

import { HeaderService } from '../../header.service';
import { HospitalpipePipe } from '../../pipes/hospitalpipe.pipe';
import { HospitalService } from '../../Services/hospital.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-tsu-hospital-master',
  templateUrl: './tsu-hospital-master.component.html',
  styleUrls: ['./tsu-hospital-master.component.scss']
})
export class TsuHospitalMasterComponent implements OnInit {

  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  districtList: any;
  stateList: any;
  Filtered: any;
  stateId: any = '';
  districtId: any = '';
  cpdApprovalRequired: any = '';
  snoTagged: any = '';
  deleteDetails: any;
  hospitalData: any = [];
  SearchForm!: FormGroup;
  txtsearchDate:any;
  hospdetails: any;
  
  constructor(private headerService: HeaderService, private hospitalService: HospitalService, private route: Router,
    private snoService: SnocreateserviceService, private hospitalpipePipe: HospitalpipePipe, public fb: FormBuilder) { }

  ngOnInit(): void {
    this.headerService.setTitle("Hospital Details Report")
    this.currentPage = 1;
    this.pageElement = 100;
    this.getHospitalList();
    this.getStateList();
    this.SearchForm = this.fb.group({
      stateId: new FormControl(''),
      districtId: new FormControl(''),
      cpdAppReq: new FormControl(''),
      snoTagged: new FormControl('')
    });
  }
  
  getHospitalList() {
    this.hospitalService.getHospitalList(this.stateId, this.districtId, this.cpdApprovalRequired, this.snoTagged, '','').subscribe(
      (allData) => {
        this.hospitalData = allData;
        console.log(this.hospitalData);
        this.record = this.hospitalData.length;
        if(this.record > 0) {
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      }
    );
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  resetTable() {
    this.currentPage = 1;
    this.pageElement = 100;
    this.districtList = [];
    this.stateId = '';
    this.districtId = '';
    this.cpdApprovalRequired = '';
    $('#stateId').val("");
    $('#districtId').val("");
    $('#cpdAppReq').val("");
    $('#snoTagged').val("");
    this.SearchForm.value.stateId = "";
    this.SearchForm.value.districtId = "";
    this.SearchForm.value.cpdAppReq = "";
    this.SearchForm.value.snoTagged = "";
    this.getHospitalList();
  }

  view(item: any) {
    this.hospitalService.getHospitalDetails(item).subscribe(
      (data) => {
        console.log(data);
        this.hospdetails = data;
      }
    )
  }

  edit(item: any) {
    let navigateExtras: NavigationExtras = {
      state: {
        hospitalId: item
      }
    };
    this.route.navigate(['application/userhospital'], navigateExtras)
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $('#districtId').val("");
    this.SearchForm.value.districtId = "";
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }

  onChange() {    
    this.stateId = this.SearchForm.value.stateId;
    this.districtId = this.SearchForm.value.districtId;
    this.cpdApprovalRequired = this.SearchForm.value.cpdAppReq;
    this.snoTagged = this.SearchForm.value.snoTagged;
    
    this.hospitalData = [];
    this.currentPage = 1;
    this.pageElement = 100;
    this.hospitalService.getHospitalList(this.stateId, this.districtId, this.cpdApprovalRequired, this.snoTagged, '','').subscribe(
      (data) => {
        this.Filtered = data;
        if (this.Filtered.length != 0) {
          this.hospitalData = this.hospitalpipePipe.transform(this.hospitalData, this.Filtered);
          $('#htmlData').show();
        }
        else if (this.Filtered.length <= 0) {
          $('#htmlData').hide();
          Swal.fire("Info", "No Record Found !", 'info');
        }
      }
    );
  }

  report: any = [];
  hosp: any = {
    slNo: "",
    hospname: "",
    hospcode: "",
    state: "",
    district: "",
    cpdApproval: "",
    status: "",
  };  
  heading = [['Sl No', 'Hospital Name', 'Hospital Code', 'State', 'District', 'CPD Approval Required', 'Status']];

  downloadReport(type: any) {
    if(this.hospitalData == "" || this.hospitalData == undefined || this.hospitalData.length==0)
      {
        this.swal('Info','No Data Found', 'info');
        return;
      }
    //console.log(this.hospitalData);
    this.report = [];
    if(type == 'excel'){
    let item: any;
    for(var i=0;i<this.hospitalData.length;i++) {
      item = this.hospitalData[i];
      console.log(item);
      this.hosp = [];
      this.hosp.slNo = i+1;
      this.hosp.hospname = item.hospitalName;
      this.hosp.hospcode = item.hospitalCode;
      this.hosp.state = item.stateName;
      this.hosp.district = item.districtName;
      if(item.cpdApprovalRequired == '1') {
        this.hosp.cpdApproval = "No";
      } else if(item.cpdApprovalRequired == '0') {
        this.hosp.cpdApproval = "Yes";
      }
      if(item.status == '0') {
        this.hosp.status = "Active";
      } else if(item.status == '1') {
        this.hosp.status = "Inactive";
      }
      this.report.push(this.hosp);
      console.log(this.report);
      console.log(this.hosp);
    }
    TableUtil.exportListToExcel(this.report, "Hospital Details Report", this.heading);
  }else if(type == 'pdf'){
    if(this.hospitalData == "" || this.hospitalData == undefined || this.hospitalData.length==0)
      {
        this.swal('Info','No Data Found', 'info');
        return;
      }
      const doc = new jsPDF('p', 'mm', [240, 272]);
      doc.setFontSize(12);
      doc.text('Hospital Details',5,10);
      doc.setLineWidth(0.7);
      doc.line(5,11,35,11);
      let pdfRpt = [];
      for(var x=0;x<this.hospitalData.length;x++) {
        var flt = this.hospitalData[x];
        var pdf = [];
        pdf[0] = x+1;
        pdf[1] = flt.hospitalName!=null?flt.hospitalName:'-NA-';
        pdf[2] = flt.hospitalCode!=null?flt.hospitalCode:'-NA-';
        pdf[3] = flt.stateName!=null?flt.stateName:'-NA-';
        pdf[4] = flt.districtName!=null?flt.districtName:'-NA-';
       if(flt.cpdApprovalRequired == '1'){
        pdf[5]="No";
       }else if(flt.cpdApprovalRequired == '0')
        {
          pdf[5]="Yes"
        }
        if(flt.status=='0'){
          pdf[6] = "Active";
        }else if(flt.status == '1'){
          pdf[6] = "InActive";
        }
        pdfRpt.push(pdf);
      }
      console.log(pdfRpt);
      autoTable(doc, {
        head: this.heading,
        body: pdfRpt,
        startY:28,
        theme: 'grid',
        headStyles: {
          fillColor: [26, 99, 54]
        },
      
        columnStyles: {
          0: {cellWidth: 20},
          1: {cellWidth: 56},
          2: {cellWidth: 25},
          3: {cellWidth: 25},
          4: {cellWidth: 35},
          5: {cellWidth: 25},
          6: {cellWidth: 25},
          7: {cellWidth: 25},
          8: {cellWidth: 25},
          
        }          
      }); 
      doc.save('Hospital Details Report_'+'.pdf');  
      }

  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

}
