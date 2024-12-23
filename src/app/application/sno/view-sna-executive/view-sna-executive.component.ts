import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SnoconfigpipePipe } from '../../pipes/snoconfigpipe.pipe';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-view-sna-executive',
  templateUrl: './view-sna-executive.component.html',
  styleUrls: ['./view-sna-executive.component.scss']
})
export class ViewSnaExecutiveComponent implements OnInit {

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
    this.headerService.setTitle("View SNA Executive Mapping");
    // this.currentPage = 1;
    // this.pageElement = 100;
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
      },
      (error) => console.log(error)
    )
  }

  SnoConfigDetails() {
    this.snoService.getSnaExecConfigurationList(this.snoId).subscribe((alldata) => {
      this.listOfSnoData = alldata;
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
    this.route.navigate(['/application/snaExecutiveMapping'], objToSend);
  }

  view(item:any) {
    this.header=item.fullname;
    this.userId=item;
    this.snoService.getSNAExecutiveDetails(item.snaUserId).subscribe((alldata) => {
      this.detailData = alldata;
    });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }


  selectEvent(item) {
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
    this.snoService.getSnaExecConfigurationList(this.snoId).subscribe(
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

  

  report: any = [];
  sno: any = {
    slNo: "",
    execname: "",
    status: "",
  };
  heading = [['Sl No','SNA Executive Name','Status']];

  downloadReport() {
    this.report = [];
    let item: any;
    for(var i=0;i<this.detailData.length;i++) {
      item = this.detailData[i];
      this.sno = [];
      this.sno.slNo = i+1;
      this.sno.execname = item.executive_name;
      if(item.status == '0') {
        this.sno.status = "Active";
      } else if(item.status == '1') {
        this.sno.status = "Inactive";
      }
      this.report.push(this.sno);
    }
    TableUtil.exportListToExcel(this.report, this.header+" Executive Details", this.heading);
  }

  list: any = [];
  cpd: any = {
    slNo: "",
    cpdname: "",
    count: ""
  };  
  heading1 = [['Sl No', 'SNA Doctor Name', 'Tagged Executive']];

  downloadList() {
    this.list = [];
    let item: any;
    for(var i=0;i<this.listOfSnoData.length;i++) {
      item = this.listOfSnoData[i];
      this.cpd = [];
      this.cpd.slNo = i+1;
      this.cpd.cpdname = item.fullname;
      this.cpd.count = item.count;
      this.list.push(this.cpd);
    }
    TableUtil.exportListToExcel(this.list, "SNA Executive Details", this.heading1);
  }
  

}
