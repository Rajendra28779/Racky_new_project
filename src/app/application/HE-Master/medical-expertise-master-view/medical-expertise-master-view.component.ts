import { Component, OnInit } from '@angular/core';
// import { EmpanelmentmasterserviceService } from '../Services/empanelmentmasterservice.service';
// import { HeaderService } from '../header.service';
import { NavigationExtras, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import autoTable from 'jspdf-autotable';
// import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import { HeaderService } from '../../header.service';
import { EmpanelmentmasterserviceService } from '../../Services/empanelmentmasterservice.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-medical-expertise-master-view',
  templateUrl: './medical-expertise-master-view.component.html',
  styleUrls: ['./medical-expertise-master-view.component.scss'],
})
export class MedicalExpertiseMasterViewComponent implements OnInit {
  txtsearchDate: any;
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  user: any;
  packageData: any = [];
  constructor(
    private route: Router,
    public formBuilder: FormBuilder,
    public headerService: HeaderService,
    private empanelmentmasterservice: EmpanelmentmasterserviceService, private sessionService: SessionStorageService
  ) { }
  ngOnInit(): void {
    this.currentPage = 1;
    this.pageElement = 50;
    this.headerService.setTitle('View Medical Expertise');
    this.user = this.sessionService.decryptSessionData("user");
    this.getMedicalExpertiseDetails();
  }
  getMedicalExpertiseDetails() {
    this.empanelmentmasterservice.getlist().subscribe((allData: any) => {
      this.packageData = allData;
      this.record = this.packageData.length;
      console.log(allData);
      if (this.record > 0) {
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });
  }
  edit(id: any) {
    let navigateExtras: NavigationExtras = {
      state: {
        item: id,
      },
    };
    this.route.navigate(['application/medicalexpertise'], navigateExtras);
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  report: any = [];
  expertise: any = {
    Slno: '',
    Medexpertisename: '',
    fullname: "",
    createdate: "",
    statusFlag: '',
  };
  heading = [['Sl#', 'Medical Expertise', 'Created BY', 'Created On', 'Status']];
  downloadList(type) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.packageData.length; i++) {
      item = this.packageData[i];
      this.expertise = [];
      this.expertise.slNo = i + 1;
      this.expertise.Medexpertisename = item.medexpertisename;
      this.expertise.fullname = item.userdetails.fullname;
      this.expertise.createdate = this.convertDate(item.createdon);
      if (item.statusFlag == 0) {
        this.expertise.statusFlag = 'Active';
      } else {
        this.expertise.statusFlag = 'Inactive';
      }
      this.report.push(this.expertise);
      console.log(this.report);
    }
    if (type == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(
        this.report,
        ' Medical Expertise List',
        this.heading,
        filter
      );
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal('Info', 'No Record Found', 'info');
        return;
      }
      var doc = new jsPDF('l', 'mm', [260, 240]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(' Medical Expertise  List', 110, 10);
      doc.setFontSize(12);
      doc.text('Generated On: ' + this.convertDate(new Date()), 25, 33);
      doc.text(
        'Generated By: ' + this.user.fullName,
        140,
        33
      );
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.Medexpertisename;
        pdf[2] = clm.fullname;
        pdf[3] = clm.createdate;
        pdf[4] = clm.statusFlag;
        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54],
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 50 },
          2: { cellWidth: 50 },
          3: { cellWidth: 50 },

        },
      });
      doc.save('GJAY_ Medical Expertise List.pdf');
    }
  }
  convertDate(date) {
    var datePipe = new DatePipe('en-US');
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
}
