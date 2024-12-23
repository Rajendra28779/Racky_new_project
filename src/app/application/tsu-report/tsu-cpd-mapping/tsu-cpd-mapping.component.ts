import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { CpdpipePipe } from '../../pipes/cpdpipe.pipe';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-tsu-cpd-mapping',
  templateUrl: './tsu-cpd-mapping.component.html',
  styleUrls: ['./tsu-cpd-mapping.component.scss']
})
export class TsuCpdMappingComponent implements OnInit {

  record: any;
  //record1: any;
  currentPage: any;
  //currentPage1: any;
  pageElement: any;
  //pageElement1: any;
  showPegi: boolean;
  //showPegi1: boolean;
  listOfCpdData: any = [];
  SearchForm1: FormGroup;
  Filtered: any;
  Filtered1: any;
  cpdId: any = '';
  stateId: any = '--';
  districtId: any = '--';
  viewList: any;
  txtsearchDate:any;
  txtsearch:any;
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
    this.headerService.setTitle("CPD Mapping");
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
      // for(var i=0;i<this.listOfCpdData.length;i++) {
      //   var conf = this.listOfCpdData[i];
      //   this.count = this.count + conf.count;
      // }
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

  view(item:any) {
    this.header=item.fullname;
    this.bskyUserId=item;
    this.stateId='';
    this.districtId='';
    $('#stateId').val("null");
    $('#districtId').val("null");
    this.SearchForm1.controls['stateId'].reset();
    this.OnChangeState(this.stateId);
    this.SearchForm1.controls['districtId'].reset();
    this.snoService.getCpdConfigurationDetails(item.cpdUserId,this.stateId,this.districtId).subscribe((alldata) => {
      this.detailData = alldata;
    });
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  // pageItemChange1() {
  //   this.pageElement1 = (<HTMLInputElement>document.getElementById("pageItem1")).value;
  // }

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
    // do something with selected item
    this.cpdId = item.bskyUserId;
  }

  clearEvent() {
    this.cpdId = '';
  }

  onChange() {
    if(this.cpdId==null||this.cpdId==""||this.cpdId==undefined) {
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
        // for(var i=0;i<this.listOfCpdData.length;i++) {
        //   var conf = this.listOfCpdData[i];
        //   this.count = this.count + conf.count;
        // }
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
      this.snoService.getCpdConfigurationDetails(this.bskyUserId.cpdUserId,this.stateId,this.districtId).subscribe((alldata) => {
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
    district: "",
    status: "",
  };
  heading = [['Sl No', 'Hospital Name', 'Hospital Code', 'State', 'District', 'Status']];

  downloadReport(exm:any) {
    this.report = [];
    let item: any;
    for(var i=0;i<this.detailData.length;i++) {
      item = this.detailData[i];
      this.sno = [];
      this.sno.slNo = i+1;
      this.sno.hospname = item.hospitalName;
      this.sno.hospcode = item.hospitalCode;
      this.sno.state = item.stateName;
      this.sno.district = item.districtName;
      if(item.status == '0') {
        this.sno.status = "Active";
      } else if(item.status == '1') {
        this.sno.status = "Inactive";
      }
      this.report.push(this.sno);
    }
    if(exm=="exl"){
      TableUtil.exportListToExcel(this.report, this.header+" Mapping Details", this.heading);
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm',[210,297 ]);
      doc.setFontSize(12);
      doc.text("Mapping Details", 8, 10);
      doc.text("CPD Name - "+this.header, 8, 15);
      doc.text("Restricted Hospitals", 8, 20);
      var rows = [];
      for(var i=0;i<this.report.length;i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.hospname;
        pdf[2] = clm.hospcode;
        pdf[3] = clm.state;
        pdf[4] = clm.district;
        pdf[5] = clm.status;

        rows.push(pdf);
      }
        autoTable(doc, {
          head: this.heading,
          body: rows,
          theme: 'grid',
          startY: 25,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: {cellWidth: 10},
            1: {cellWidth: 60},
            2: {cellWidth: 30},
            3: {cellWidth: 30},
            4: {cellWidth: 30},
            5: {cellWidth: 20},
          }
        });
        doc.save(this.header+'_Mapping Details.pdf');

    }
  }

  list: any = [];
  cpd: any = {
    slNo: "",
    cpdname: "",
    count: ""
  };
  heading1 = [['Sl No', 'CPD Doctor Name', 'Restricted Hospitals']];

  downloadList(exm:any) {
    this.list = [];
    let item: any;
    for(var i=0;i<this.listOfCpdData.length;i++) {
      item = this.listOfCpdData[i];
      this.cpd = [];
      this.cpd.slNo = i+1;
      this.cpd.cpdname = item.fullname;
      this.cpd.count = item.count;
      this.list.push(this.cpd);
    }
    if(exm=="exl"){
        TableUtil.exportListToExcel(this.list, "CPD Mapping Details", this.heading1);
    }else{
      if(this.list==null || this.list.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm',[210,297 ]);
      doc.setFontSize(12);
      doc.text("CPD Mapping Details", 8, 10);
      // doc.text("Date: "+date, 8, 15);
      var rows = [];
      for(var i=0;i<this.list.length;i++) {
        var clm = this.list[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.cpdname;
        pdf[2] = clm.count;

        rows.push(pdf);
      }
        autoTable(doc, {
          head: this.heading1,
          body: rows,
          theme: 'grid',
          startY: 25,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: {cellWidth: 10},
            1: {cellWidth: 90},
            2: {cellWidth: 80},
          }
        });
        doc.save('CPD Mapping Details.pdf');
    }

  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
}

}
