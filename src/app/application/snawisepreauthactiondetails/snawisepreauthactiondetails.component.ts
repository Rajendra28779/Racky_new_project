import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { SnaactiontakenlogserviceService } from '../Services/snaactiontakenlogservice.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-snawisepreauthactiondetails',
  templateUrl: './snawisepreauthactiondetails.component.html',
  styleUrls: ['./snawisepreauthactiondetails.component.scss']
})
export class SnawisepreauthactiondetailsComponent implements OnInit {

  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  public snaDoctorList: any = [];
  public list: any = [];
  totalcount: any = 0;
  txtsearchDate: any;
  snadoctorname: any;
  formdate: any;
  todate: any;
  type: any;
  typename: any;
  sna: any;
  user: any;

  constructor(private snaactionlog: SnaactiontakenlogserviceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    let state = JSON.parse(localStorage.getItem("snapreauth"));
    this.user =  this.sessionService.decryptSessionData("user");
    this.formdate = state.fromdate
    this.todate = state.todate
    this.snadoctorname = state.snadoctorname
    this.sna = state.snadoctor
    this.type = state.type
    this.typename = this.typeName(this.type);
    this.getlist()
  }
  getlist() {
    this.snaactionlog.getsnawisepreauthcountdetails(this.formdate, this.todate, this.sna, this.type).subscribe((data: any) => {
      if (data.status == 200) {
        this.list = data.data;
        this.totalcount = this.list.length;
        if (this.totalcount > 0) {
          this.showPegi = true;
          this.currentPage = 1;
          this.pageElement = 100;
        } else {
          this.showPegi = false
        }
      } else {
        this.swal("Error", "SomeThing Went Wrong", "error");
      }
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  typeName(type: any) {
    let name = "";
    if (type == 1) {
      name = "Total Requested";
    } else if (type == 2) {
      name = "Total Approved";
    } else if (type == 3) {
      name = "Total Auto Approved";
    } else if (type == 4) {
      name = "Total Rejected";
    } else if (type == 5) {
      name = "Total Auto Rejected";
    } else if (type == 6) {
      name = "Hospital Canceled";
    } else if (type == 7) {
      name = "Expired";
    } else if (type == 8) {
      name = "Total Pending Requested";
    } else {
      name = ""
    }
    return name;
  }

  report: any = [];
  sno: any = {
    Slno: "",
    hosp: "",
    patient: "",
    case: "",
    specility: "",
    packagecode: "",
    packagename: "",
    amount: "",
    date: "",
  };
  heading = [['Sl#',
    'Hospital Name ',
    'Patient Name',
    'Case No',
    'Speciality Name',
    'Procedure Code',
    'Package Name',
    'Request Amount',
    'Request On']];


  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.hosp = sna.hospitalName;
      this.sno.patient = sna.patientName;
      this.sno.case = sna.caseNo;
      this.sno.speciality = sna.specilityName;
      this.sno.packagecode = sna.procedureCode;
      this.sno.packagename = sna.packageName;
      this.sno.amount = sna.amount;
      this.sno.date = sna.rqstdate;
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Actual Date Of Discharge From', this.formdate]]);
      filter.push([['Actual Date Of Discharge To', this.todate]]);
      filter.push([['SNA Doctor Name', this.snadoctorname]]);
      filter.push([['Type', this.typename]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'SNA PreAuth Action Count Details',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("SNA PreAuth Action Count Details", 100, 15);
      doc.setFontSize(12);
      doc.text('Actual Date Of Discharge From :- ' + this.formdate, 15, 23);
      doc.text('Actual Date Of Discharge To :- ' + this.todate, 180, 23);
      doc.text('SNA Doctor Name :- ' + this.snadoctorname, 15, 31);
      doc.text('Type :- ' + this.typename, 180, 31);
      doc.text('GeneratedOn :- ' + generatedOn, 180, 39);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 39);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.hosp;
        pdf[2] = clm.patient;
        pdf[3] = clm.case;
        pdf[4] = clm.speciality;
        pdf[5] = clm.packagecode;
        pdf[6] = clm.packagename;
        pdf[7] = clm.amount;
        pdf[8] = clm.date;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 45,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('SNA_PreAuth_Action_Count_Details.pdf');
    }
  }

}
