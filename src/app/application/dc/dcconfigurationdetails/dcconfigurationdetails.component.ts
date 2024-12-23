import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SnoconfigpipePipe } from '../../pipes/snoconfigpipe.pipe';
import { TableUtil } from '../../util/TableUtil';
import { DcconfigurationService } from '../../Services/dcconfiguration.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-dcconfigurationdetails',
  templateUrl: './dcconfigurationdetails.component.html',
  styleUrls: ['./dcconfigurationdetails.component.scss']
})
export class DcconfigurationdetailsComponent implements OnInit {
  record: any;
  record1: any;
  currentPage: any;
  currentPage1: any;
  pageElement: any;
  pageElement1: any;
  showPegi: boolean;
  showPegi1: boolean;
  listOfDcData: any = [];
  SearchForm1: FormGroup;
  Filtered: any;
  Filtered1: any;
  dcId: any = '';
  dcname: any = 'All';
  hospcode: any ='';
  hospname: any ='All';
  stateId: any = null;
  districtId: any = null;
  public dcList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  public hospitallist: any = [];
  viewList: any;
  txtsearchDate:any;
  txtsearch:any;
  detailData: any = [];
  keyword: any = 'fullName';
  keyword1: any = 'hospitalName';
  header: any;
  userId: any;
  count: number;
  state:any="";
  dist:any="";
  user:any;

  @ViewChild('auto') auto;
  constructor(private route: Router, public headerService: HeaderService, private snoService: SnocreateserviceService,
    private dcService: DcconfigurationService, private snoconfigpipePipe: SnoconfigpipePipe,
    private sessionService: SessionStorageService) { }

  groupData: any = [];

  ngOnInit(): void {
    this.headerService.setTitle("View DC Mapping");
    this.user =  this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;
    this.getStateList();
    this.getDCList();
    this.DcConfigDetails();
    this.SearchForm1 = new FormGroup({
      'stateId': new FormControl(null, (Validators.required)),
      'districtId': new FormControl(null, (Validators.required))
    });
  }

  getDCList() {
    this.dcService.getDCDetails().subscribe(
      (response) => {
        this.dcList = response;
      },
      (error) => console.log(error)
    )
  }

  DcConfigDetails() {
    this.state=$('#state').val();
    this.dist=$('#district').val();
    this.dcService.getDcConfigList(this.dcId,this.state,this.dist,this.hospcode).subscribe((alldata) => {
      this.listOfDcData = alldata;
      this.record = this.listOfDcData.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
      this.count=0;
      for(var i=0;i<this.listOfDcData.length;i++) {
        var conf = this.listOfDcData[i];
        this.count = this.count + conf.count;
      }
    });
  }

  resetTable() {
    this.currentPage = 1;
    this.pageElement = 100;
    this.auto.clear();
    this.dcId = '';
    this.DcConfigDetails();
  }

  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        dcId: item
      }
    };
    this.route.navigate(['/application/dcConfiguration'], objToSend);
  }

  view(item:any) {
    this.header=item.fullname;
    this.userId=item;
    this.stateId='';
    this.districtId='';
    $('#stateId').val("null");
    $('#districtId').val("null");
    this.SearchForm1.controls['stateId'].reset();
    this.OnChangeState(this.stateId);
    this.SearchForm1.controls['districtId'].reset();
    this.currentPage1 = 1;
    this.pageElement1 = 100;
    this.dcService.getDcConfigurationDetails(item.dcUserId,this.stateId,this.districtId).subscribe((alldata) => {
      this.detailData = alldata;
      this.record1 = this.detailData.length;
      if (this.record1 > 0) {
        this.showPegi1 = true;
      }
      else {
        this.showPegi1 = false;
      }
    });
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  pageItemChange1() {
    this.pageElement1 = (<HTMLInputElement>document.getElementById("pageItem1")).value;
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

  OnChangeDistrict(id) {
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitallist = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent1(item) {
    this.hospcode = item.hospitalCode;
    this.hospname = item.hospitalName;
  }

  clearEvent1() {
    this.hospcode = '';
    this.hospname = 'All';
  }

  selectEvent(item) {
    this.dcId = item.userId;
    this.dcname = item.fullName;
  }

  clearEvent() {
    this.dcId = '';
    this.dcname = '';
  }

  // onChange() {
  //   if(this.dcId==null||this.dcId==""||this.dcId==undefined) {
  //     this.swal('Info', "Please select DC Name", "info");
  //     return;
  //   }
  //   this.listOfDcData = [];
  //   this.currentPage = 1;
  //   this.pageElement = 100;
  //   this.dcService.getDcConfigList(this.dcId).subscribe(
  //     (data) => {
  //       this.Filtered = data;
  //       if (this.Filtered.length != 0) {
  //         this.listOfDcData = this.snoconfigpipePipe.transform(this.listOfDcData, this.Filtered);
  //       }
  //       else if (this.Filtered.length <= 0) {
  //         Swal.fire("Info", "No Record Found !", 'info');
  //       }
  //       this.count=0;
  //       for(var i=0;i<this.listOfDcData.length;i++) {
  //         var conf = this.listOfDcData[i];
  //         this.count = this.count + conf.count;
  //       }
  //     }
  //   );
  // }

  onChange1() {
    this.stateId = this.SearchForm1.controls['stateId'].value;
    this.districtId = this.SearchForm1.controls['districtId'].value;
    if ((this.stateId == null || this.stateId == "" || this.stateId == "null")) {
      Swal.fire("Info", "Please Select State Name!!", 'info');
    }
    else {
      this.detailData = [];
      this.currentPage1 = 1;
      this.pageElement1 = 100;
      this.dcService.getDcConfigurationDetails(this.userId.dcUserId, this.stateId, this.districtId).subscribe(
        (data) => {
          this.Filtered1 = data;
          if (this.Filtered1.length != 0) {
            this.detailData = this.snoconfigpipePipe.transform(this.detailData, this.Filtered1);
          }
          else if (this.Filtered1.length <= 0) {
            Swal.fire("Info", "No Record Found !", 'info');
          }
        }
      );
    }
  }

  resetTable1() {
    this.currentPage1 = 1;
    this.pageElement1 = 100;
    this.stateId = null;
    this.districtId = null;
    this.districtList = [];
    this.view(this.userId);
  }

  report: any = [];
  dc: any = {
    slNo: "",
    hospname: "",
    hospcode: "",
    state: "",
    district: "",
  };
  heading = [['Sl No', 'Hospital Name', 'Hospital Code', 'State', 'District']];

  downloadReport() {
    this.report = [];
    let item: any;
    for(var i=0;i<this.detailData.length;i++) {
      item = this.detailData[i];
      this.dc = [];
      this.dc.slNo = i+1;
      this.dc.hospname = item.hospitalName;
      this.dc.hospcode = item.hospitalCode;
      this.dc.state = item.stateName;
      this.dc.district = item.districtName;
      this.report.push(this.dc);
    }

    TableUtil.exportListToExcel(this.report, this.header+" Mapping Details", this.heading);
  }

  heading1 = [['Sl No', 'DC Name', 'Assigned Hospitals']];

  downloadList(no: any) {
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.user.fullName;
      this.report = [];
      let item: any;

      for (let i = 0; i < this.listOfDcData.length; i++) {
          item = this.listOfDcData[i];
          let row = [];
          row.push(i + 1);
          row.push(item.fullname);
          row.push(item.count);
          this.report.push(row);
      }

      let statename='All';
      let distname='All';

      for (let j = 0; j < this.stateList.length; j++) {
        if (this.stateList[j].stateCode == this.state) {
          statename  = this.stateList[j].stateName;
        }
      }
      for (let j = 0; j < this.districtList.length; j++) {
        if (this.districtList[j].districtcode == this.dist) {
          distname = this.districtList[j].districtname;
        }
      }

      if (no == 1) {
          let filter = [];
          filter.push([['State Name', statename]]);
          filter.push([['District Name', distname]]);
          filter.push([['Hospital Name', this.hospname]]);
          filter.push([['Dc Name', this.dcname]]);
          TableUtil.exportListToExcelWithFilter(this.report, 'DC Mapping Count Report', this.heading1, filter);
      } else {
          if (this.report == null || this.report.length == 0) {
              this.swal("Info", "No Record Found", "info");
              return;
          }
          let doc = new jsPDF('p', 'mm', [297, 210]);
          doc.setFontSize(20);
          doc.text("DC Mapping Count Report", 60, 15);
          doc.setFontSize(13);
          doc.text('State Name: ' + statename, 15, 25);
          doc.text('District Name: ' + distname, 15, 32);
          doc.text('Hospital Name: ' + this.hospname, 15, 39);
          doc.text('DC Name: ' + this.dcname, 15, 46);
          doc.text('Generated By: ' + generatedBy, 15, 53);
          doc.text('Generated On: ' + generatedOn, 15, 60);
          autoTable(doc, {
              head: this.heading1,
              body: this.report,
              theme: 'grid',
              startY: 65,
              headStyles: {
                  fillColor: [26, 99, 54]
              },
              columnStyles: {
                  0: { cellWidth: 10 },
              }
          });
          doc.save('DC_Mapping_Count_Report.pdf');
      }
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
}

}
