import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { HospitalPackageMappingService } from '../Services/hospital-package-mapping.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../util/TableUtil';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;


@Component({
  selector: 'app-snaremarkwiseaction',
  templateUrl: './snaremarkwiseaction.component.html',
  styleUrls: ['./snaremarkwiseaction.component.scss']
})
export class SnaremarkwiseactionComponent implements OnInit {
  user: any;
  record: any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  month: any;
  year: any;
  snahide: boolean;
  snahtmlhide: boolean;
  adminhtmlhide: boolean;
  txtsearchDate:any
  public snoList: any = [];
  districtList: any = []
  selectedItems: any = [];
  state: any;
  dis: any;
  hospital: any;
  snolist: any;
  statenameAdmin: any = 'All';
  districtNameAdmin: any = 'All';
  hospitalnameAdmin: any = 'All';
  snoname: any;
  btn: boolean=false;
  totalClaimCount: any;
  dataRequest: any;
  stateId: any = "";
  fromDate: any;
  toDate: any;
  stateCode1: any;
  stateCode1sna: any;
  distCode1sna: any;
  hospitalCodesna: any;
  distCode1: any;
  hospitalCode: any;
  statelist: Array<any> = [];
  stateCode: any;
  userId: any;
  distList: Array<any> = [];
  distCode: any;
  hospitalList: Array<any> = [];
  snoUserId: any;
  keyword: any = 'fullName';

  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private jwtService: JwtService,
    private hospitalService: HospitalPackageMappingService,
    private snoServices: SnocreateserviceService,
    private sessionService: SessionStorageService
  ) { }
  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('SNA Remarkwise Action Report');
    this.currentPage = 1;
    this.pageElement = 20;
    this.getSNOList();
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
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
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let months: any = date.getMonth() - 1;
    if (months == -1) {
      this.month = 'Dec';
      this.year = year - 1;
    } else {
      this.month = this.getMonthFrom(months);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.month + '-' + this.year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    if (this.user.groupId == 4) {
      this.snahide = false;
      this.snahtmlhide = true;
      this.adminhtmlhide = false;
      this.getStateList();
    } else {
      this.adminhtmlhide = true;
      this.snahtmlhide = false;
      this.snahide = true;
      this.getStateList1();
    }
  }
  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    if (date1.toString().length === 1) {
      date1 = '0' + date1;
    }
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }
  getMonthFrom(month) {
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
    return month;
  }
  stateData: any = [];
  getStateList() {
    this.snoService.getStateList().subscribe((data: any) => {
      this.stateData = data;
      this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
      for (let j = 0; j < this.stateData.length; j++) {
        if (this.stateData[j].stateCode == '21') {
          this.statelist.push(this.stateData[j]);
        }
      }
      for (let i = 0; i < this.stateData.length; i++) {
        if (this.stateData[i].stateCode != '21') {
          this.statelist.push(this.stateData[i]);
        }
      }
      if (
        this.dataRequest == null ||
        this.dataRequest == undefined ||
        this.dataRequest == ''
      ) {
      } else {
        this.stateId = this.dataRequest.stateCode;
        this.getDistrict(this.stateId);
      }
      console.log(this.statelist);
    });
  }
  distId: any = '';
  getDistrict(code) {
    this.stateCode = code;
    this.userId = this.user.userId;
    this.snoService
      .getDistrictListByState(this.userId, this.stateCode)
      .subscribe((data: any) => {
        this.distList = data;
        console.log(data);
      });
  }
  hospitalId: any = '';
  getHospital(code) {
    this.distCode = code;
    this.userId = this.user.userId;
    this.snoService
      .getHospitalByDist(this.userId, this.stateCode, this.distCode)
      .subscribe((data: any) => {
        this.hospitalList = data;
        console.log(data);
      });
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoServices.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  hospitalList1: any = [];
  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoServices.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList1 = response;
      },
      (error) => console.log(error)
    )
  }
  getSNOList() {
    this.snoServices.getSNODetails().subscribe(
      (response) => {
        this.snoList = response;
        console.log(this.snoList);
      },
      (error) => console.log(error)
    )
  }
  stateList: any;
  getStateList1() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);

      },
      (error) => console.log(error)
    )
  }
  snaname: any
  selectEvent(item) {
    this.snoUserId = item.userId;
    this.snaname = item.fullName;
  }
  clearEvent() {
    this.snoUserId = '';
  }
  report: any = [];
  sno: any = {
    slno: "",
    Hospitaldetails: "",
    TotalDischarge: "",
    ClaimSubmitted: "",
    ClaimNotsubmitted: "",
    snaapproved: "",
    ActionBySNA: "",
    snaaction: "",
    percentageofRejection: "",
    total: "",
    RemarkWiseDetails: ""
  };
  heading = [['Sl#', 'Hospital Details', 'Total Discharge', 'Claim Submitted', 'Claim Not Submitted','SNA Approved', 'Action By SNA','SNA Action', 'Percentage of Action','Total']];
  stateName: any;
  districtName: any;
  hospitalName: any;
  statenamesna: any;
  districtsna: any;
  hospitalsna: any;
  downloadReport(type: any) {
    this.report = [];
    let filter = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.snaactiondata.length; i++) {
        claim = this.snaactiondata[i];
        this.sno = [];
        this.sno.slno = i + 1;
        this.sno.Hospitaldetails = claim.hospitalname + '(' + claim.Hospitalcode + ')';
        this.sno.TotalDischarge = claim.totaldischarge;
        this.sno.ClaimSubmitted = claim.claimsubmited;
        this.sno.ClaimNotsubmitted = claim.claimnotsubmitted;
        this.sno.snaapproved = claim.snaapproved;
        this.sno.ActionBySNA = claim.actionbysna;
        this.sno.snaaction = claim.snaaction;
        this.sno.percentageofRejection = claim.snaactionpercentage + "%";
        this.sno.total = claim.total;
        this.report.push(this.sno);
      }
      if (this.user.groupId == 4) {
        let stateName = 'All', districtName = 'All', hospitalName = 'All';
        for (var i = 0; i < this.statelist.length; i++) {
          if (this.stateCode == this.statelist[i].stateCode) {
            stateName = this.statelist[i].stateName;
            this.statenamesna = stateName;
          }
        }
        for (var i = 0; i < this.distList.length; i++) {
          if (this.distCode == this.distList[i].DISTRICTCODE) {
            districtName = this.distList[i].DISTRICTNAME;
            this.districtsna = districtName;
          }
        }
        for (var i = 0; i < this.hospitalList.length; i++) {
          if (this.hospitalCode == this.hospitalList[i].HOSPITALCODE) {
            hospitalName = this.hospitalList[i].HOSPITALNAME;
            this.hospitalsna = hospitalName
          }
        }
        filter.push([['Actual Date of Discharge From', this.fromDate]]);
        filter.push([['Actual Date of Discharge To', this.toDate]]);
        if (this.user.groupId == 4) {
          filter.push([['State Name', stateName]]);
          filter.push([['District Name', districtName]]);
          filter.push([['Hospital Name', hospitalName]]);
          filter.push([['SNA Doctor Name', this.user.fullName]]);
        }
      } else if (this.user.groupId == 1) {
        for (let i = 0; i < this.stateList.length; i++) {
          if (this.stateList[i].stateCode == this.state) {
            this.statenameAdmin = this.stateList[i].stateName
          }
        }
        for (let i = 0; i < this.districtList.length; i++) {
          if (this.districtList[i].districtcode == this.dis) {
            this.districtNameAdmin = this.districtList[i].districtname;
          }
        }
        for (let i = 0; i < this.hospitalList1.length; i++) {
          if (this.hospital == this.hospitalList1[i].hospitalCode) {
            this.hospitalnameAdmin = this.hospitalList1[i].hospitalName;
          }
        }
        for (let i = 0; i < this.snoList.length; i++) {
          if (this.snolist == this.snoList[i].userId) {
            this.snoname = this.snoList[i].fullName;
          }
        }
        filter.push([['Actual Date of Discharge From', this.fromDate]]);
        filter.push([['Actual Date of Discharge To', this.toDate]]);
        filter.push([['State Name', this.statenameAdmin]]);
        filter.push([['District Name', this.districtNameAdmin]]);
        filter.push([['Hospital Name', this.hospitalnameAdmin]]);
        filter.push([['SNA Doctor Name', this.snaname]]);
      }
      TableUtil.exportListToExcelWithFilter(this.report, 'SNA Action Report', this.heading, filter);
    } else if (type == 'pdf') {
      if (this.record.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let stateName = 'All', districtName = 'All', hospitalName = 'All';
      let SlNo = 1;
      this.record.forEach(element => {
        let rowData = [];
        rowData.push(SlNo);
        rowData.push(element.hospitalname + '(' + element.Hospitalcode + ')');
        rowData.push(element.totaldischarge);
        rowData.push(element.claimsubmited);
        rowData.push(element.claimnotsubmitted);
        rowData.push(element.snaapproved);
        rowData.push(element.actionbysna);
        rowData.push(element.snaaction);
        rowData.push(element.snaactionpercentage + "%");
        rowData.push(element.total);
        this.report.push(rowData);
        SlNo++;
      });
      let doc = new jsPDF('l', 'mm', [250, 270]);
      doc.setFontSize(10);
      if (this.user.groupId == 4) {
        doc.text('Actual Date of Discharge From :-' + this.fromDate, 5, 10);
        doc.text('Actual Date of Discharge To :-' + this.toDate, 5, 15);
        doc.text('State Name :-' + stateName, 5, 20);
        doc.text('District Name :-' + districtName, 5, 25);
        doc.text('Hospital Name :-' + hospitalName, 5, 30);
        doc.text('SNA Doctor Name :-' + this.user.fullName, 5, 35);
      } else if (this.user.groupId == 1) {
        doc.text('Actual Date of Discharge From :-' + this.fromDate, 5, 10);
        doc.text('Actual Date of Discharge To :-' + this.toDate, 5, 15);
        doc.text('State Name :-' + this.statenameAdmin, 5, 20);
        doc.text('District Name :-' + this.districtNameAdmin, 5, 25);
        doc.text('Hospital Name :-' + this.hospitalnameAdmin, 5, 30);
        doc.text('SNA Doctor Name :-' + this.snaname, 5, 35);
      }
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 40);
      doc.setLineWidth(0.7);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 42, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
        }
      })
      doc.save('SNA_Action_Report.pdf');
    }
  }
  sonid: any
  snaactiondata: any = [];
  length: any;
  stateAdmin: any;
  distAdmin: any;
  hospitalAdmin: any;
  getActionDetails() {
    this.stateAdmin = $('#stateId').val();
    this.distAdmin = $('#districtId').val();
    this.hospitalAdmin = $('#hospital').val();
    this.stateCode1sna = this.stateId != undefined ? this.stateId : '';
    this.distCode1sna = this.distId != undefined ? this.distId : '';
    this.hospitalCodesna = this.hospitalId != undefined ? this.hospitalId : '';
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    let userId = this.user.userId;
    this.sonid = this.snoUserId != undefined ? this.snoUserId : '';
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'From Date should be less than To Date', 'error');
      return;
    }
    if (this.user.groupId == 1) {
      if (this.sonid == '' || this.sonid == null || this.sonid == undefined) {
        this.swal('', 'Please select SNA Doctor Name', 'error');
        return;
      }
    }
    if (this.stateAdmin == null && this.stateAdmin == undefined) {
      this.stateAdmin = '';
    }
    if (this.distAdmin == null && this.distAdmin == undefined) {
      this.distAdmin = '';
    }
    if (this.hospitalAdmin == null && this.hospitalAdmin == undefined) {
      this.hospitalAdmin = '';
    }
    if (this.user.groupId == 4) {
      this.snoService.getActiondetails(this.user.groupId, this.stateCode1sna, this.distCode1sna, this.hospitalCodesna, this.fromDate
        , this.toDate, userId).subscribe((data: any) => {
          this.record = data;
          console.log(this.record);
          this.snaactiondata = this.record;
          this.length = this.snaactiondata.length;
          if (this.length > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        });
    } else {
      this.snoService.getActiondetails(this.user.groupId, this.stateAdmin, this.distAdmin, this.hospitalAdmin, this.fromDate
        , this.toDate, this.sonid).subscribe((data: any) => {
          this.record = data;
          console.log(this.record);
          this.snaactiondata = this.record;
          this.length = this.snaactiondata.length;
          if (this.length > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        }
        );
    }
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);
  }
  ResetField(){
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  gesnaactioncountdetails(hospitalname: any, hospitalcode: any, totaldischarge: any, claimsubmitted: any, claimnotsubmitted: any, 
    snaaction: any,actionbysna:any,snaction:any,snaactionpercentage: any, remarkwisedetails: any) {
      if (this.user.groupId == 4) {
        let stateName = 'All', districtName = 'All', hospitalName = 'All';
        for (var i = 0; i < this.statelist.length; i++) {
          if (this.stateCode == this.statelist[i].stateCode) {
            stateName = this.statelist[i].stateName;
            this.statenamesna = stateName;
          }
        }
        for (var i = 0; i < this.distList.length; i++) {
          if (this.distCode == this.distList[i].DISTRICTCODE) {
            districtName = this.distList[i].DISTRICTNAME;
            this.districtsna = districtName;
          }
        }
        for (var i = 0; i < this.hospitalList.length; i++) {
          if (this.hospitalCode == this.hospitalList[i].HOSPITALCODE) {
            hospitalName = this.hospitalList[i].HOSPITALNAME;
            this.hospitalsna = hospitalName
          }
        }
      }
      if (this.user.groupId == 1) {
        for (let i = 0; i < this.stateList.length; i++) {
          if (this.stateList[i].stateCode == this.state) {
            this.statenameAdmin = this.stateList[i].stateName
          }
        }
        for (let i = 0; i < this.districtList.length; i++) {
          if (this.districtList[i].districtcode == this.dis) {
            this.districtNameAdmin = this.districtList[i].districtname;
          }
        }
        for (let i = 0; i < this.hospitalList1.length; i++) {
          if (this.hospital == this.hospitalList1[i].hospitalCode) {
            this.hospitalnameAdmin = this.hospitalList1[i].hospitalName;
          }
        }
        for (let i = 0; i < this.snoList.length; i++) {
          if (this.snolist == this.snoList[i].userId) {
            this.snoname = this.snoList[i].fullName;
          }
        }
      }
    if (remarkwisedetails != 0) {
      if (this.user.groupId == 4) {
        let state = {
          fromdate: this.fromDate,
          todate: this.toDate,
          hospitalname: hospitalname,
          hospitalcode: hospitalcode,
          totaldischarge: totaldischarge,
          claimsubmitted: claimsubmitted,
          claimnotsubmitted: claimnotsubmitted,
          snaaction: snaaction,
          snaactionpercentage: snaactionpercentage,
          remarkwisedetails: remarkwisedetails,
          stateode: this.stateCode1sna,
          distcode: this.distCode1sna,
          hospitalcodesna: this.hospitalCodesna,
          snaid: this.user.userId,
          snaName: this.user.fullName,
          statename: this.statenamesna,
          districtname: this.districtsna,
          hospitalnamesna: this.hospitalsna,
          action: "SNA"
        }
        localStorage.setItem("snaction", JSON.stringify(state));
        localStorage.setItem("token", this.jwtService.getJwtToken());
        this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/SNARemarkwisedetails'); });
      } else if (this.user.groupId == 1) {
        let state = {
          fromdate: this.fromDate,
          todate: this.toDate,
          hospitalname: hospitalname,
          hospitalcode: hospitalcode,
          totaldischarge: totaldischarge,
          claimsubmitted: claimsubmitted,
          claimnotsubmitted: claimnotsubmitted,
          snaaction: snaaction,
          snaactionpercentage: snaactionpercentage,
          remarkwisedetails: remarkwisedetails,
          stateode: this.stateAdmin,
          distcode: this.distAdmin,
          hospitalcodesna: this.hospitalAdmin,
          snaid: this.sonid,
          snaName: this.snaname,
          statename: this.statenameAdmin,
          districtname: this.districtNameAdmin,
          hospitalnamesna: this.hospitalnameAdmin,
          action: "SNA"
        }
        localStorage.setItem("snaction", JSON.stringify(state));
        localStorage.setItem("token", this.jwtService.getJwtToken());
        this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/SNARemarkwisedetails'); });
      }
    }else{
      return;
    }
  }



}
