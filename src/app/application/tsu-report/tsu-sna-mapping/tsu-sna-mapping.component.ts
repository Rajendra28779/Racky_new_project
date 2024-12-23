import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SnoconfigpipePipe } from '../../pipes/snoconfigpipe.pipe';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';
declare let $: any;

@Component({
  selector: 'app-tsu-sna-mapping',
  templateUrl: './tsu-sna-mapping.component.html',
  styleUrls: ['./tsu-sna-mapping.component.scss']
})
export class TsuSnaMappingComponent implements OnInit {

  listOfSnoData: any = [];
  SearchForm1: FormGroup;
  Filtered: any;
  Filtered1: any;
  snoId: any = '';
  stateId: any = null;
  districtId: any = null;
  public snoList: any = [];
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
  constructor(private route: Router, public headerService: HeaderService,
    private snoService: SnocreateserviceService, private snoconfigpipePipe: SnoconfigpipePipe) { }
  groupData: any = [];

  ngOnInit(): void {
    this.headerService.setTitle("SNA Doctor Mapping");
    // this.currentPage = 1;
    // this.pageElement = 100;
    this.getStateList();
    this.getSNOList();
    this.SnoConfigDetails();
    this.SearchForm1 = new FormGroup({

      'stateId': new FormControl(null, (Validators.required)),
      'districtId': new FormControl(null, (Validators.required))

    });
  }

  getSNOList() {

    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snoList = response;
        console.log(this.snoList);
      },
      (error) => console.log(error)
    )
  }

  SnoConfigDetails() {
    this.snoService.getSnoConfigurationList(this.snoId).subscribe((alldata) => {
      this.listOfSnoData = alldata;
      console.log(alldata);
      this.count=0;
      for(var i=0;i<this.listOfSnoData.length;i++) {
        var conf = this.listOfSnoData[i];
        this.count = this.count + conf.count;
      }
    });
  }

  resetTable() {
    this.auto.clear();
    this.snoId = '';
    this.SnoConfigDetails();
  }

  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        sNOId: item
      }
    };
    this.route.navigate(['/application/snaConfiguration'], objToSend);
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
    this.snoService.getSnoConfigurationDetails(item.snaUserId,this.stateId,this.districtId).subscribe((alldata) => {
      this.detailData = alldata;
      console.log(alldata);
    });
  }

  // pageItemChange() {
  //   this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  // }

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
    this.snoId = item.userId;
  }

  clearEvent() {
    this.snoId = '';
  }

  onChange() {
    if(this.snoId==null||this.snoId==""||this.snoId==undefined) {
      this.swal('Info', "Please select SNA Doctor Name", "info");
      return;
    }
    this.listOfSnoData = [];
    this.snoService.getSnoConfigurationList(this.snoId).subscribe(
      (data) => {
        this.Filtered = data;
        if (this.Filtered.length != 0) {
          this.listOfSnoData = this.snoconfigpipePipe.transform(this.listOfSnoData, this.Filtered);
        }
        else if (this.Filtered.length <= 0) {
          Swal.fire("Info", "No Record Found !", 'info');
        }
        this.count=0;
        for(var i=0;i<this.listOfSnoData.length;i++) {
          var conf = this.listOfSnoData[i];
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
      this.snoService.getSnoConfigurationDetails(this.userId.snaUserId,this.stateId, this.districtId).subscribe(
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
    this.stateId = null;
    this.districtId = null;
    this.districtList = [];
    this.view(this.userId);
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
    //console.log(this.listOfSnoData);
    this.report = [];
    let item: any;
    for(var i=0;i<this.detailData.length;i++) {
      item = this.detailData[i];
      console.log(item);
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
      console.log(this.report);
      console.log(this.sno);
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
      doc.text("SNA Doctor Name - "+this.header, 8, 15);
      doc.text("Tagged Hospitals", 8, 20);
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
  heading1 = [['Sl No', 'SNA Doctor Name', 'Tagged Hospitals']];

  downloadList(exm:any) {
    this.list = [];
    let item: any;
    for(var i=0;i<this.listOfSnoData.length;i++) {
      item = this.listOfSnoData[i];
      console.log(item);
      this.cpd = [];
      this.cpd.slNo = i+1;
      this.cpd.cpdname = item.fullname;
      this.cpd.count = item.count;
      this.list.push(this.cpd);
      console.log(this.list);
      console.log(this.cpd);
    }
    // TableUtil.exportListToExcel(this.list, "SNA Mapping Details", this.heading1);
    if(exm=="exl"){
      TableUtil.exportListToExcel(this.list, "SNA Doctor Mapping Details", this.heading1);
  }else{
    if(this.list==null || this.list.length==0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    var doc = new jsPDF('p', 'mm',[210,297 ]);
    doc.setFontSize(12);
    doc.text("SNA Doctor Mapping Details", 8, 10);
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
      doc.save('SNA Doctor Mapping Details.pdf');
  }
  }

  // onPageBoundsCorrection(number: number) {
  //   this.currentPage = number;
  // }

}
