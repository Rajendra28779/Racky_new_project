import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HeaderService } from '../../header.service';
import { HospitalService } from '../../Services/hospital.service';
import { Router } from '@angular/router';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { HospitalpipePipe } from '../../pipes/hospitalpipe.pipe';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-untagged-hospitals',
  templateUrl: './untagged-hospitals.component.html',
  styleUrls: ['./untagged-hospitals.component.scss']
})
export class UntaggedHospitalsComponent implements OnInit {

  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  districtList: any = [];
  stateList: any = [];
  hospitalData: any = [];
  Filtered: any;
  stateId: any = '';
  districtId: any = '';
  SearchForm!: FormGroup;
  txtsearchDate:any;
  
  constructor(private headerService: HeaderService, private hospitalService: HospitalService, private route: Router,
    private snoService: SnocreateserviceService, private hospitalpipePipe: HospitalpipePipe, public fb: FormBuilder) { }

  ngOnInit(): void {
    this.headerService.setTitle("SNA Untagged Hospital List")
    this.currentPage = 1;
    this.pageElement = 100;
    this.getHospitalList();
    this.getStateList();
    this.SearchForm = this.fb.group({
      stateId: new FormControl(''),
      districtId: new FormControl('')
    });
  }

  getHospitalList() {
    this.hospitalService.getHospitalList(this.stateId, this.districtId, '', 1, '','').subscribe(
      (allData) => {
        this.hospitalData = allData;
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
    $('#stateId').val("");
    $('#districtId').val("");
    this.SearchForm.controls['stateId'].setValue("");
    this.SearchForm.controls['districtId'].setValue("");
    this.getHospitalList();
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
    $('#districtId').val("");
    this.SearchForm.controls['districtId'].setValue("");
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  onChange() {    
    this.stateId = this.SearchForm.value.stateId;
    this.districtId = this.SearchForm.value.districtId;

    if(this.stateId==null || this.stateId=='' || this.stateId==undefined) {
      Swal.fire("Info", "Please Select State", 'info');
      return;
    }

    this.hospitalData = [];
    this.currentPage = 1;
    this.pageElement = 100;
    this.hospitalService.getHospitalList(this.stateId, this.districtId, '', 1, '','').subscribe(
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

  downloadReport() {
    this.report = [];
    let item: any;
    for(var i=0;i<this.hospitalData.length;i++) {
      item = this.hospitalData[i];
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
    }
    TableUtil.exportListToExcel(this.report, "Untagged Hospital List", this.heading);
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

}
