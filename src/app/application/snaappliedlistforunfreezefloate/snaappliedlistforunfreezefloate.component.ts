import {  formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { SnafloatgenerationserviceService } from '../snafloatgenerationservice.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { Router } from '@angular/router';
declare let $: any;

@Component({
  selector: 'app-snaappliedlistforunfreezefloate',
  templateUrl: './snaappliedlistforunfreezefloate.component.html',
  styleUrls: ['./snaappliedlistforunfreezefloate.component.scss']
})
export class SnaappliedlistforunfreezefloateComponent implements OnInit {
  countfloate: any;
  childmessage: any;
  txtsearchDate: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  floate: any;
  user: any;
  snaDoctorList:any=[];
  keyword: any = 'fullName';
  stateList: any = [];
  districtList: any = [];
  hospitalList: any = [];

  constructor(private route: Router, public headerService: HeaderService,
    public snafloatgenerationservice: SnafloatgenerationserviceService,
    private sessionService: SessionStorageService,private snoService: SnocreateserviceService,) { }

  ngOnInit(): void {
    this.headerService.setTitle('Float UnFreeze');
    this.user = this.sessionService.decryptSessionData("user");
    this.showPegi = false;
    this.getSNAList();

    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    let date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let date2 = date.getDate();
    let month: any = date.getMonth();
    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    let frstDay = date1 + "-" + month + "-" + year;
    let secoundDay = date2 + "-" + month + "-" + year;

    //Date input placeholder
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");

    $('input[name="toDate"]').val(secoundDay);
    $('input[name="toDate"]').attr("placeholder", "To Date *");

    this.floatedetails();
    this.getStateList();
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    );
  }

  OnChangeState(id) {
    $("#districtId").val("");
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

        this.hospitalList = response;
      },
      (error) => console.log(error)
    )

  }

  getSNAList() {
    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snaDoctorList = response;
      },
      (error) => console.log(error)
    );
  }
  snadoctorname: any='All';
  snadoctor:any=0;
  selectEvent(item) {
    this.snadoctor = item.userId;
    this.snadoctorname = item.fullName;
  }
  onReset1() {
    this.snadoctor = 0;
    this.snadoctorname = 'All';
  }

  reset() {
    this.ngOnInit();
    this.floatedetails();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  formdate:any;
  toDate:any;
  state:any;
  dist:any;
  hospital:any;
  floatedetails() {
    this.formdate = $('#datepicker1').val().toString().trim();
    this.toDate = $('#datepicker2').val().toString().trim();
    if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    this.hospital = $('#hospital').val();
    this.snafloatgenerationservice.getsnafreezelistforapprove(this.formdate,this.toDate,this.snadoctor,this.state,this.dist,this.hospital).subscribe((data: any) => {
      if (data.status == 200) {
        this.floate = data.data;
        this.countfloate = this.floate.length;
        if (this.countfloate > 0) {
          this.currentPage = 1;
          this.pageElement = 50;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      } else {
        this.swal('', ' SomeThing Went Wrong', 'error');
      }
    });
  }


  report: any = [];
  heading = [['Sl#',
    'Claim No',
    'Case No',
    'Hospital Name',
    'Actual Date Of Admission',
    'Actual Date Of Discharge',
    'CPD Approved Amount',
    'CPD Action Date',
    'SNA Approved Amount',
    'Remarks'
  ]];
  sno: any = {
    Slno: "",
    urn: "",
    clm: "",
    case: "",
    hosp: "",
    adadm: "",
    addis: "",
    cpdapprvdate: "",
    snaapprvdate: "",
    remark: "",
  };

  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.floate.length; i++) {
      sna = this.floate[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.urn = sna.claimNo;
      this.sno.clm = sna.claimNo;
      this.sno.case = sna.caseno;
      this.sno.hosp = sna.hospitalName;
      this.sno.adadm = sna.actualDateAdm;
      this.sno.addis = sna.actualDischarge;
      this.sno.cpdapprvdate = sna.actionBy;
      this.sno.snaapprvdate = sna.actionOn;
      this.sno.remark = sna.remark;
      this.report.push(this.sno);
    }

    let statename='All';
    let distname='All';
    let hospname='All';
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
    for (let j = 0; j < this.hospitalList.length; j++) {
      if (this.hospitalList[j].hospitalCode == this.hospital) {
        hospname = this.hospitalList[j].hospName;
      }
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Actual Date Of Discharge From', this.formdate]]);
      filter.push([['Actual Date Of Discharge To', this.toDate]]);
      filter.push([['SNA Doctor Name', this.snadoctorname]]);
      filter.push([['State Name', statename]]);
      filter.push([['District Name', distname]]);
      filter.push([['Hospital Name', hospname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Float_Revert_List',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Float_Revert_List", 120, 15);
      doc.setFontSize(12);
      doc.text('Actual Date Of Discharge From :- ' + this.formdate, 15, 25);
      doc.text('Actual Date Of Discharge To :- ' + this.toDate, 180, 25);
      doc.text('State Name :- ' + statename, 15, 33);
      doc.text('District Name :- ' + distname, 180, 33);
      doc.text('Hospital Name :- ' + hospname, 15, 41);
      doc.text('SNA Doctor Name :- ' + this.snadoctorname, 15, 49);
      doc.text('GeneratedOn :- ' + generatedOn, 180, 57);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 57);
      let rows = [];
      for (let i = 0; i < this.report.length; i++) {
        let clm = this.report[i];
        let pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.clm;
        pdf[2] = clm.case;
        pdf[3] = clm.hosp;
        pdf[4] = clm.adadm;
        pdf[5] = clm.addis;
        pdf[6] = clm.cpdapprvdate;
        pdf[7] = clm.cpdactiondate;
        pdf[8] = clm.snaapprvdate;
        pdf[9] = clm.remark;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 65,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          3: { cellWidth: 40 }
        }
      });
      doc.save('Float_Revert_List.pdf');
    }
  }

  dataIdArray: any = [];
  show: any = false;
  checkAllCheckBox(event: any) {
    // Angular 13
    if (event.target.checked) {
      for (const element of this.floate) {
        $('#' + element.claimid).prop('checked', true);
        this.dataIdArray.push(element.claimid);
      }
    } else {
      for (const element of this.floate) {
        $('#' + element.claimid).prop('checked', false);
        this.dataIdArray = [];
      }
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
    if (this.dataIdArray.length > 0) {
      this.show = true;
    } else {
      this.show = false;
    }
  }
  tdCheck(event: any, claimId) {
    if (event.target.checked) {
      this.dataIdArray.push(claimId);
    } else {
      for (let i = 0; i < this.dataIdArray.length; i++) {
        if (this.dataIdArray[i] == claimId) {
          this.dataIdArray.splice(i, 1);
        }
      }
    }
    if (this.dataIdArray.length == this.floate.length) {
      $('#allCheck').prop('checked', true);
    } else {
      $('#allCheck').prop('checked', false);
    }
    if (this.dataIdArray.length > 0) {
      this.show = true;
    } else {
      this.show = false;
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
  }

  arrtostring(array: any) {
    let s = "";
    for (let i = 0; i < array.length; i++) { s = s + array[i] + ","; }
    return s;
  }

  revert() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You Want Approve For UnFreeze !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve it!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.dataIdArray.length == 0) {
          this.swal("Info", "Please Select at least One Record For Unfreeze !", "info");
          return;
        }
        let claimid = this.arrtostring(this.dataIdArray);
        this.snafloatgenerationservice.approveforunfreeze(this.user.userId, claimid).subscribe((data: any) => {
          if (data.status == 200) {
            this.swal('Success', ' Approved Successfully', 'success');
            this.dataIdArray = [];
            this.show = false;
            this.floatedetails();
          } else {
            this.swal('Error', ' SomeThing Went Wrong', 'error');
          }
        });
      }
    });
  }


}
