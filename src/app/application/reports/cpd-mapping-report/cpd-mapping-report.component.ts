import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { HeaderService } from '../../header.service';
import { CpdpipePipe } from '../../pipes/cpdpipe.pipe';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-cpd-mapping-report',
  templateUrl: './cpd-mapping-report.component.html',
  styleUrls: ['./cpd-mapping-report.component.scss']
})
export class CpdMappingReportComponent implements OnInit {
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  listOfCpdData: any = [];
  SearchForm1: FormGroup;
  Filtered: any;
  Filtered1: any;
  cpdId: any = '';
  stateId: any = '';
  districtId: any = '';
  viewList: any;
  txtsearchDate: any;
  txtsearch: any;
  public cpdList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  detailData: any = [];
  keyword: any = 'fullName';
  header: any;
  bskyUserId: any;
  count: number = 0;

  @ViewChild('auto') auto;
  constructor(private route: Router, public headerService: HeaderService, private snoService: SnocreateserviceService,
    private cpdpipePipe: CpdpipePipe) { }

  ngOnInit(): void {
    this.getStateList();
    this.headerService.setTitle("CPD Mapping Report");
    this.currentPage = 1;
    this.pageElement = 100;
    this.getCPDList();
    this.CpdConfigDetails();
    this.SearchForm1 = new FormGroup({
      'stateId': new FormControl(null, (Validators.required)),
      'districtId': new FormControl(null, (Validators.required))
    });
  }

  getCPDList() {
    this.snoService.getCPDList().subscribe(
      (response) => {
        this.cpdList = response;
      },
      (error) => console.log(error)
    )
  }

  CpdConfigDetails() {
    this.snoService.getCpdConfigurationList(this.cpdId).subscribe((alldata) => {
      this.listOfCpdData = alldata.confList;
      this.record = this.listOfCpdData.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
      this.count = alldata.count;
    });
  }

  resetTable() {
    this.currentPage = 1;
    this.pageElement = 100;
    this.auto.clear();
    this.cpdId = '';
    this.CpdConfigDetails();
  }

  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        cPDID: item
      }
    };
    this.route.navigate(['/application/cpdConfiguration'], objToSend);
  }

  view(item: any) {
    this.header = item.fullname;
    this.bskyUserId = item.cpdUserId;
    this.stateId = '';
    this.districtId = '';
    $('#stateId').val("null");
    $('#districtId').val("null");
    this.SearchForm1.controls['stateId'].reset();
    this.OnChangeState(this.stateId);
    this.SearchForm1.controls['districtId'].reset();
    this.snoService.getCpdConfigurationDetails(item.cpdUserId, this.stateId, this.districtId).subscribe((alldata) => {
      this.detailData = alldata;
    });
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
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
    this.SearchForm1.controls['districtId'].reset();
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    this.cpdId = item.bskyUserId;
  }

  clearEvent() {
    this.cpdId = '';
  }

  onChange() {
    if (this.cpdId == null || this.cpdId == "" || this.cpdId == undefined) {
      this.swal('Info', "Please select CPD Doctor Name", "info");
      return;
    }
    this.listOfCpdData = [];
    this.currentPage = 1;
    this.pageElement = 100;
    this.snoService.getCpdConfigurationList(this.cpdId).subscribe(
      (data) => {
        this.Filtered = data.confList;
        if (this.Filtered.length != 0) {
          this.listOfCpdData = this.cpdpipePipe.transform(this.listOfCpdData, this.Filtered);
        }
        else if (this.Filtered.length <= 0) {
          Swal.fire("Info", "No Record Found !", 'info');
        }
        this.count = data.count;
      }
    );
  }

  onChange1() {
    this.stateId = this.SearchForm1.controls['stateId'].value;
    this.districtId = this.SearchForm1.controls['districtId'].value;
    if ((this.stateId == null || this.stateId == "" || this.stateId == "null")) {
      Swal.fire("Info", "Please Select State Name!!", 'info');
    }
    else {
      this.detailData = [];
      this.snoService.getCpdConfigurationDetails(this.bskyUserId.cpdUserId, this.stateId, this.districtId).subscribe((alldata) => {
        this.Filtered1 = alldata;
        if (this.Filtered1.length != 0) {
          this.detailData = this.cpdpipePipe.transform(this.detailData, this.Filtered1);
        }
        else if (this.Filtered1.length <= 0) {
          Swal.fire("Info", "No Record Found !", 'info');
        }
      });
    }
  }

  resetTable1() {
    this.stateId = null;
    this.districtId = null;
    this.districtList = [];
    this.view(this.bskyUserId);
  }

  report: any = [];
  sno: any = {
    slNo: "",
    hospname: "",
    hospcode: "",
    state: "",
    districtName: "",
    status: "",
    periodFrom: "",
    periodTo: ""

  };
  heading = [['Sl No', 'Hospital Name', 'Hospital Code', 'State', 'District', 'Status', 'Period From', 'Period To']];
  downloadReport() {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.detailData.length; i++) {
      item = this.detailData[i];
      this.sno = [];
      this.sno.slNo = (i + 1).toString();
      this.sno.hospname = item.hospitalName;
      this.sno.hospcode = item.hospitalCode;
      this.sno.state = item.stateName;
      this.sno.district = item.districtName;
      if (item.status == '0') {
        this.sno.status = "Active";
      } else if (item.status == '1') {
        this.sno.status = "Inactive";
      }
      this.sno.periodFrom = item.periodFrom;
      if (item.periodTo != null) {
        this.sno.periodTo = this.convertDate(item.periodTo);
      } else if (item.periodTo == null) {
        this.sno.periodTo = "N/A";
      }
      this.report.push(this.sno);
    }
    TableUtil.exportListToExcel(this.report, this.header + " Mapping Report", this.heading);
  }
  convertDate(periodTo: any) {
    var datePipe = new DatePipe("en-US");
    periodTo = datePipe.transform(periodTo, 'dd-MMM-yyyy');
    return periodTo;
  }

  list: any = [];
  cpd: any = {
    slNo: "",
    cpdname: "",
    count: ""
  };
  heading1 = [['Sl No', 'CPD Doctor Name', 'Restricted Hospitals']];
  downloadList() {
    this.list = [];
    let item: any;
    for (var i = 0; i < this.listOfCpdData.length; i++) {
      item = this.listOfCpdData[i];
      this.cpd = [];
      this.cpd.slNo = (i + 1).toString();
      this.cpd.cpdname = item.fullname;
      this.cpd.count = item.count;
      this.list.push(this.cpd);
    }
    TableUtil.exportListToExcel(this.list, "CPD Mapping Report", this.heading1);
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

}
