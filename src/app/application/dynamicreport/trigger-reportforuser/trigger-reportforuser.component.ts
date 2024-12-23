import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { HeaderService } from '../../header.service';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { CurrencyPipe, formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-trigger-reportforuser',
  templateUrl: './trigger-reportforuser.component.html',
  styleUrls: ['./trigger-reportforuser.component.scss']
})
export class TriggerReportforuserComponent implements OnInit {
  childmessage: any;
  user: any;
  flag: any;
  fromdate: any;
  report: any;
  todate: any;
  result: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  txtsearchDate: any;
  months: string;
  year: number;
  showdropdown: any;
  public snaDoctorList: any = [];
  trigger:any

  constructor(public route: Router,
    private service: DynamicreportService,
    public headerService: HeaderService,
    private jwtService: JwtService,
    private snoService: SnocreateserviceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Trigger Report');
    this.user =  this.sessionService.decryptSessionData("user");
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // maxDate: new Date(),
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
    let date2 = date.getDate();
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.months + '-' + this.year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    // this.getTriggerList();
    this.getStateList();
    this.getSNAList();
    this.getlist();
  }
  triggerList: any = [];
  getTriggerList() {
    this.service.findAllActiveTrigger().subscribe((data: any) => {
      this.triggerList = data;
    })
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

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  snadoctorname: any = "ALL";
  snadoctor: any = "";
  keyword: any = 'fullName';
  selectEvent(item) {
    this.snadoctor = item.userId;
    this.snadoctorname = item.fullName;
    // alert(this.snadoctor)
  }
  onReset1() {
    this.snadoctor = '';
    // this.date="";
    // this.hospitalName="";
  }

  ResetField() {
    window.location.reload();
  }
  requestData:any;
  getlist() {
    this.fromdate = $('#datepicker1').val();
    this.todate = $('#datepicker2').val();
    this.trigger=1;
    let snauserId = this.snaUserId;
    let statecode=this.stateId;
    let distCode = this.distId;
    let hospitalCode=this.hospitalId;
    if (this.fromdate == null || this.fromdate == "" || this.fromdate == undefined) {
      this.swal("Info", "Please Fill Form Date", 'info');
      return;
    }
    if (this.todate == null || this.todate == "" || this.todate == undefined) {
      this.swal("Info", "Please Fill To Date", 'info');
      return;
    }
    if (Date.parse(this.fromdate) > Date.parse(this.todate)) {
      this.swal('info', ' From Date should be less than To Date', 'info');
      return;
    }
    this.requestData={
      fromDate:this.fromdate,
      toDate:this.todate,
      triggerId:this.trigger,
      snaUserId:snauserId,
      stateCode:statecode,
      districtCode:distCode,
      hospitalCode:hospitalCode
    }
    console.log(this.requestData);
    this.service.getMeGrievancedetails(this.fromdate, this.todate, snauserId,this.trigger,statecode,distCode,hospitalCode).subscribe((data: any) => {
      this.list = data
      this.totalcount = this.list.length;
      if (this.totalcount > 0) {
        this.showPegi = true
        this.currentPage = 1
        this.pageElement = 100
      } else {
        this.showPegi = false
      }
    });
  }

  getSNAList() {
    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snaDoctorList = response;
      },
      (error) => console.log(error)
    );
  }

  getDetails(transactionId, claimId, urn) {

    let trnsId = transactionId;
    let clmId = claimId;
    if (clmId != null || clmId != undefined) {
      let state = {
        Urn: urn
      }
      localStorage.setItem("claimid", clmId);
      localStorage.setItem("trackingdetails", JSON.stringify(state));
      localStorage.setItem("token", this.jwtService.getJwtToken());
      this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });
    } else {
      let state = {
        txnid: transactionId,
        //  authcode:authorizedcode,
        //  hospitalcode:hospitalcode,
        urn: urn
      }
      localStorage.setItem("history", JSON.stringify(state));
      localStorage.setItem("token", this.jwtService.getJwtToken())
      this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/dischargelistHistoryHospital'); });
    }
  }
  report1: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    claimNo: "",
    caseNo: "",
    PatientName: "",
    HospitalName: "",
    hospitalcide: "",
    hospitaldistrictname: "",
    Packagecode: "",
    Packagename: "",
    ActualDateofAdmission: "",
    ActualDateofDischarge: "",
    snaname:"",
    ageremark:"",
    remark: "",
    action: "",
    trigger:"",
    HospitalClaimAmount: "",
  };
  heading = [["Sl No", "URN", "Claim No", "Case No", "Patient Name", "Hospital Name", "Hospital Code","Hospital District Name", "Package Code", "Package Name", "Actual Date of Admission", "Actual Date of Discharge", "SNA Name","Age Remark","M And E Remark", "M And E Action Taken Date", "Trigger Name","Hospital Claim Amount"]];

  downloadList(no: any) {
    this.report1 = [];
    let claim: any;
    for (var i = 0; i < this.list.length; i++) {
      claim = this.list[i];
      this.sno = [];
      this.sno.Slno = (i + 1).toString();
      this.sno.URN = claim.urn;
      this.sno.claimNo = claim.claimno;
      this.sno.caseNo = claim.caseno;
      this.sno.PatientName = claim.patientname;
      this.sno.HospitalName = claim.hospitalname;
      this.sno.hospitalcide = claim.hospitalcode;
      this.sno.hospitaldistrictname = claim.hospitaldistrictname;
      this.sno.Packagecode = claim.packagecode;
      this.sno.Packagename = claim.packagename;
      this.sno.ActualDateofAdmission = claim.actualdateofadmission;
      this.sno.ActualDateofDischarge = claim.actualdateofdischarge;
      this.sno.snaname = claim.snaName;
      this.sno.ageremark = claim.ageRemark;
      this.sno.remark = claim.remark;
      this.sno.action = claim.actionon;
      this.sno.trigger = claim.reportname;
      this.sno.HospitalClaimAmount = this.convertCurrency(claim.claimamount);
      this.report1.push(this.sno);
    }
    let triggername="No Of Mobile Duplicate During Blocking In Different URN";
    // for(let j=0; j < this.triggerList.length;j++){
    //   if(this.triggerList[j].slno==this.trigger){
    //     triggername=this.triggerList[j].reportname;
    //   }
    // }
    if (no == 1) {
      let filter = [];
      let stateName = 'All', districtName = 'All', hospitalName = 'All',snaName='All';
      for(const element of this.statelist) {
        if(this.requestData.stateCode==element.stateCode) {
          stateName=element.stateName;
        }
      }
      for(const element of this.distList) {
        if(this.requestData.districtCode==element.districtcode) {
          districtName=element.districtname;
        }
      }
      for(const element of this.hospitalList) {
        if(this.requestData.hospitalCode==element.hospitalCode) {
          hospitalName=element.hospitalName;
        }
      }
      for(const element of this.snaDoctorList) {
        if(this.requestData.snaUserId==element.userId) {
          snaName=element.fullName;
        }
      }
      filter.push([['Actual Date of Discharge From', this.requestData.fromDate]]);
      filter.push([['Actual Date of Discharge To', this.requestData.toDate]]);
      filter.push([['Trigger Name', triggername]]);
      filter.push([['Hospital State', stateName]]);
      filter.push([['Hospital District',districtName]]);
      filter.push([['Hospital Name', hospitalName]]);
      filter.push([['SNA Doctor Name', snaName]]);
      TableUtil.exportListToExcelWithFilter(this.report1, 'Trigger Report', this.heading, filter);
    } else {
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.user.fullName;
      let stateName = 'All', districtName = 'All', hospitalName = 'All',snaName='All';
      for(const element of this.statelist) {
        if(this.requestData.stateCode==element.stateCode) {
          stateName=element.stateName;
        }
      }
      for(const element of this.distList) {
        if(this.requestData.districtCode==element.districtcode) {
          districtName=element.districtname;
        }
      }
      for(const element of this.hospitalList) {
        if(this.requestData.hospitalCode==element.hospitalCode) {
          hospitalName=element.hospitalName;
        }
      }
      for(const element of this.snaDoctorList) {
        if(this.requestData.snaUserId==element.userId) {
          snaName=element.fullName;
        }
      }
      if (this.report1 == null || this.report1.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [365, 280]);
      doc.setFontSize(20);
      doc.text("Trigger Report", 140, 10);
      doc.setFontSize(15);
      doc.text('Actual Date of Discharge From:- ' + this.requestData.fromDate, 15, 20);
      doc.text('Actual Date of Discharge To:- ' + this.requestData.todate, 200, 20);
      doc.text('Trigger Name:- ' + triggername, 15, 30);
      doc.text('Hospital State :- ' + stateName, 15, 40);
      doc.text('Hospital District :- ' + districtName, 200, 40);
      doc.text('Hospital Name :- ' + hospitalName, 15, 50);
      doc.text('SNA Doctor Name :- ' + snaName, 200, 50);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 60);
      doc.text('GeneratedBy :- ' + generatedBy, 200, 60);
      var rows = [];
      for (var i = 0; i < this.report1.length; i++) {
        var clm = this.report1[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.URN;
        pdf[2] = clm.claimNo;
        pdf[3] = clm.caseNo;
        pdf[4] = clm.PatientName;
        pdf[5] = clm.HospitalName;
        pdf[6] = clm.hospitalcide;
        pdf[7] = clm.hospitaldistrictname;
        pdf[8] = clm.Packagecode;
        pdf[9] = clm.Packagename;
        pdf[10] = clm.ActualDateofAdmission;
        pdf[11] = clm.ActualDateofDischarge;
        pdf[12] = clm.snaname;
        pdf[13] = clm.ageremark;
        pdf[14] = clm.remark;
        pdf[15] = clm.action;
        pdf[16] = clm.trigger;
        pdf[17] = clm.HospitalClaimAmount;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 65,
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },

        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 15 },
          2: { cellWidth: 15 },
          3: { cellWidth: 15 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
          11: { cellWidth: 20 },
          12: { cellWidth: 20 },
          13: { cellWidth: 20 },
          14: { cellWidth: 20 },
          15: { cellWidth: 20 },
          16: { cellWidth: 20 },
          17: { cellWidth: 20 },

        },
      });
      doc.save('Trigger Report.pdf');
    }

  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
  stateData: any = [];
  statelist: Array<any> = [];
  stateCode: any;
  distList: any=[];
  hospitalList:any=[];
  getStateList() {
    this.snoService.getStateList().subscribe((data: any) => {
      this.stateData = data;
      this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
      for (const element of this.stateData) {
        if (element.stateCode == '21') {
          this.statelist.push(element);
        }
      }
      for (const element of this.stateData) {
        if (element.stateCode != '21') {
          this.statelist.push(element);
        }
      }
      console.log(this.statelist)
    })
  }
  stateId: any='';
  distId: any='';
  hospitalId: any='';
  snaUserId:any='';
  OnChangeState(event) {
    this.stateCode=event;
    this.distList=[];
    this.distId='';
    this.hospitalId='';
    this.hospitalList=[];
    this.snoService.getDistrictListByStateId(this.stateCode).subscribe((data) => {
      this.distList = data;
      this.distList.sort((a, b) => a.districtname.localeCompare(b.districtname));
      console.log(data)
    })
  }//OnChangeDistrict
  distCode:any;
  OnChangeDistrict(event) {
    this.distCode = event;
    this.hospitalId='';
    this.hospitalList=[];
    this.snoService.getHospitalbyDistrictId(this.distCode,this.stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
        console.log(response);
      },
      (error) => console.log(error)
    );
  }
}


