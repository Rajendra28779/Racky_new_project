import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SnoconfigpipePipe } from '../../pipes/snoconfigpipe.pipe';
import { TableUtil } from '../../util/TableUtil';
import { DcconfigurationService } from '../../Services/dcconfiguration.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
declare let $: any;

@Component({
  selector: 'app-tsu-dc-mapping',
  templateUrl: './tsu-dc-mapping.component.html',
  styleUrls: ['./tsu-dc-mapping.component.scss']
})
export class TsuDcMappingComponent implements OnInit {
  updateGroup = new FormGroup({
    groupName: new FormControl(''),

  });
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
  stateId: any = null;
  districtId: any = null;
  public dcList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  viewList: any;
  txtsearchDate:any;
  txtsearch:any;
  detailData: any = [];
  keyword: any = 'fullName';
  header: any;
  userId: any;
  count: number;

  @ViewChild('auto') auto;
  constructor(private route: Router, public headerService: HeaderService, private snoService: SnocreateserviceService,
    private dcService: DcconfigurationService, private snoconfigpipePipe: SnoconfigpipePipe) { }

  groupData: any = [];

  ngOnInit(): void {
    this.headerService.setTitle("DC Mapping");
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
        console.log(this.dcList);
      },
      (error) => console.log(error)
    )
  }

  DcConfigDetails() {
    this.dcService.getDcConfigList(this.dcId,"","","").subscribe((alldata) => {
      this.listOfDcData = alldata;
      console.log(alldata);
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
      console.log(alldata);
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
        console.log(this.stateList);
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
        console.log(response);
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    // do something with selected item
    this.dcId = item.userId;
  }

  clearEvent() {
    this.dcId = '';
  }

  onChange() {
    if(this.dcId==null||this.dcId==""||this.dcId==undefined) {
      this.swal('Info', "Please select SNA Doctor Name", "info");
      return;
    }
    this.listOfDcData = [];
    this.currentPage = 1;
    this.pageElement = 100;
    this.dcService.getDcConfigList(this.dcId,"","","").subscribe(
      (data) => {
        this.Filtered = data;
        if (this.Filtered.length != 0) {
          this.listOfDcData = this.snoconfigpipePipe.transform(this.listOfDcData, this.Filtered);
        }
        else if (this.Filtered.length <= 0) {
          Swal.fire("Info", "No Record Found !", 'info');
        }
        this.count=0;
        for(var i=0;i<this.listOfDcData.length;i++) {
          var conf = this.listOfDcData[i];
          this.count = this.count + conf.count;
        }
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
      this.currentPage1 = 1;
      this.pageElement1 = 100;
      this.dcService.getDcConfigurationDetails(this.userId.dcUserId, this.stateId, this.districtId).subscribe(
        (data) => {
          console.log(data);
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

  downloadReport(exm:any) {
    //console.log(this.listOfSnoData);
    this.report = [];
    let item: any;
    for(var i=0;i<this.detailData.length;i++) {
      item = this.detailData[i];
      console.log(item);
      this.dc = [];
      this.dc.slNo = i+1;
      this.dc.hospname = item.hospitalName;
      this.dc.hospcode = item.hospitalCode;
      this.dc.state = item.stateName;
      this.dc.district = item.districtName;
      this.report.push(this.dc);
      console.log(this.report);
      console.log(this.dc);
    }

    // TableUtil.exportListToExcel(this.report, this.header+" Mapping Details", this.heading);

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
      doc.text("DC Name - "+this.header, 8, 15);
      doc.text("Assigned Hospitals", 8, 20);
      var rows = [];
      for(var i=0;i<this.report.length;i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.hospname;
        pdf[2] = clm.hospcode;
        pdf[3] = clm.state;
        pdf[4] = clm.district;
        // pdf[5] = clm.status;

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
            1: {cellWidth: 80},
            2: {cellWidth: 30},
            3: {cellWidth: 30},
            4: {cellWidth: 30},
            // 5: {cellWidth: 20},
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
  heading1 = [['Sl No', 'DC Name', 'Assigned Hospitals']];

  downloadList(exm:any) {
    this.list = [];
    let item: any;
    for(var i=0;i<this.listOfDcData.length;i++) {
      item = this.listOfDcData[i];
      console.log(item);
      this.cpd = [];
      this.cpd.slNo = i+1;
      this.cpd.cpdname = item.fullname;
      this.cpd.count = item.count;
      this.list.push(this.cpd);
      console.log(this.list);
      console.log(this.cpd);
    }
    // TableUtil.exportListToExcel(this.list, "DC Mapping Details", this.heading1);

    if(exm=="exl"){
      TableUtil.exportListToExcel(this.list, "DC Mapping Details", this.heading1);
  }else{
    if(this.list==null || this.list.length==0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    var doc = new jsPDF('p', 'mm',[210,297 ]);
    doc.setFontSize(12);
    doc.text("DC Mapping Details", 8, 10);
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
      doc.save('DC Mapping Details.pdf');
  }
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
}

}
