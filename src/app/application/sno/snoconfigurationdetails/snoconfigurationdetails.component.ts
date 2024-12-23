import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SnoconfigpipePipe } from '../../pipes/snoconfigpipe.pipe';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';
declare let $: any;

@Component({
  selector: 'app-snoconfigurationdetails',
  templateUrl: './snoconfigurationdetails.component.html',
  styleUrls: ['./snoconfigurationdetails.component.scss']
})

export class SnoconfigurationdetailsComponent implements OnInit {

  // record: any;
  // record1: any;
  // currentPage: any;
  // currentPage1: any;
  // pageElement: any;
  // pageElement1: any;
  // showPegi: boolean;
  // showPegi1: boolean;
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
    this.headerService.setTitle("View SNA Mapping");
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

  downloadReport() {
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
    TableUtil.exportListToExcel(this.report, this.header+" Mapping Details", this.heading);
  }

  list: any = [];
  cpd: any = {
    slNo: "",
    cpdname: "",
    count: ""
  };  
  heading1 = [['Sl No', 'SNA Doctor Name', 'Tagged Hospitals']];

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
    TableUtil.exportListToExcel(this.list, "SNA Mapping Details", this.heading1);
  }
  
  // onPageBoundsCorrection(number: number) {
  //   this.currentPage = number;
  // }

}
