import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { HospitalmasterService } from '../../Services/hospitalmaster.service';
import { TableUtil } from '../../util/TableUtil';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { CpdpipePipe } from '../../pipes/cpdpipe.pipe';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-hospital-master-user-details',
  templateUrl: './hospital-master-user-details.component.html',
  styleUrls: ['./hospital-master-user-details.component.scss']
})
export class HospitalMasterUserDetailsComponent implements OnInit {
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  listOfData: any = [];
  public cpdList: any = [];
  Filtered: any;
  stateId: any;
  districtId: any;
  viewList: any;
  txtsearchDate: any;
  keyword = 'fullName';
  userId: any = '';
  fullname: any;
  @ViewChild('auto1') auto1;
  header: any;
  bskyUserId: any;
  SearchForm1: any;
  showPegi1: boolean;
  record1: any;
  detailData: any = [];
  pageElement1: number;
  currentPage1: number;
  public districtList: any = [];
  public stateList: any = [];
  Filtered1: any;
  txtsearch: any;
  updatelist: any;
  isUpdateBtnInVisible: boolean;
  cPDID: any;

  constructor(private route: Router, public headerService: HeaderService, public hospitalService: HospitalmasterService,
    private snoService: SnocreateserviceService, private cpdpipePipe: CpdpipePipe) {
  }

  ngOnInit(): void {
    this.headerService.setTitle("View Hospital Group Mapping");
    this.currentPage = 1;
    this.pageElement = 10;
    this.getAuthList();
    this.CpdConfigDetails();
  }

  getAuthList() {
    this.hospitalService.getHospitalAuthList().subscribe(
      (response) => {
        this.cpdList = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    this.userId = item.userId.userId;
    this.fullname = item.fullName;
  }

  onReset() {
    this.userId = "";
    this.fullname = "";
  }

  CpdConfigDetails() {
    // alert(this.userId)
    this.hospitalService.getAuthConfigurationList(this.userId).subscribe((alldata: any) => {
      this.listOfData = alldata;
      this.record = this.listOfData.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    })
  }

  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        PID: item
      }
    };
    this.route.navigate(['/application/hospitalgroupMapping'], objToSend);
  }

  list: any = [];
  cpd: any = {
    slNo: "",
    cpdname: "",
    count: ""
  };
  heading1 = [['Sl No', 'Hospital Authority Name', 'Tagged Hospital Count']];

  downloadList() {
    this.list = [];
    let item: any;
    for (var i = 0; i < this.listOfData.length; i++) {
      item = this.listOfData[i];
      this.cpd = [];
      this.cpd.slNo = i + 1;
      this.cpd.cpdname = item.fullname;
      this.cpd.count = item.count;
      this.list.push(this.cpd);
    }
    TableUtil.exportListToExcel(this.list, "Hospital Auth Config Details", this.heading1);
  }

  report: any = [];
  sno: any = {
    slNo: "",
    fullname: "",
    hospname: "",
    hospcode: "",
    state: "",
    district: "",
    status: "",
  };
  heading = [['Sl No', 'Authority Name', 'Hospital Name', 'Hospital Code', 'State', 'District', 'Status']];

  downloadReport() {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.listOfData.length; i++) {
      item = this.listOfData[i];
      this.sno = [];
      this.sno.slNo = i + 1;
      this.sno.fullname = item.authName;
      this.sno.hospname = item.hospitalName;
      this.sno.hospcode = item.hospitalCode;
      this.sno.state = item.stateName;
      this.sno.district = item.districtName;
      if (item.statusFlag == '0') {
        this.sno.status = "Active";
      } else if (item.statusFlag == '1') {
        this.sno.status = "Inactive";
      }
      this.report.push(this.sno);
    }
    TableUtil.exportListToExcel(this.report, "Hospital Auth Mapping Details", this.heading);
  }

  view(item: any) {
    this.header = item.fullname;
    this.hospitalService.getbyid(item.AuthUserId).subscribe((data: any) => {
      this.updatelist = data;
    });
  }

  sno1: any = {
    slNo: "",
    fullname: "",
    hospname: "",
    hospcode: "",
    status: ""
  };
  heading2 = [['Sl No', 'Authority Name', 'Hospital Name', 'Hospital Code', 'Status']];

  downloadHospReport() {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.updatelist.length; i++) {
      item = this.updatelist[i];
      this.sno1 = [];
      this.sno1.slNo = i + 1;
      this.sno1.fullname = item.fullname;
      this.sno1.hospname = item.hospitalName;
      this.sno1.hospcode = item.hospitalCode;
      // this.sno1.Status = item.status;
      if (item.status == '0') {
        this.sno1.status = "Active";
      } else if (item.status == '1') {
        this.sno1.status = "Inactive";
      }
      this.report.push(this.sno1);
    }
    TableUtil.exportListToExcel(this.report, "Authority Tagged Hospitals", this.heading2);
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

}
