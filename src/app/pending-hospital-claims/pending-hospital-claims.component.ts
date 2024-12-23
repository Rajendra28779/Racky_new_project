import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {NotificationService} from "../application/Services/notification.service";
import {TableUtil} from "../application/util/TableUtil";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-pending-hospital-claims',
  templateUrl: './pending-hospital-claims.component.html',
  styleUrls: ['./pending-hospital-claims.component.scss']
})
export class PendingHospitalClaimsComponent implements OnInit {

  user:any;
  data: any;
  pageHeading: any;
  pendingHospitalClaims: any = [];
  showPagination: boolean;
  currentPage: any = 1;
  pageElement: any = 20;
  txtSearch: any;
  hospitalList: any = [];
  actionCode: any;
  totalClaimsCount: any;
  days: any;
  daysOptions: number[] = Array.from({ length: 60 }, (_, index) => index + 1);

  constructor(
    private notificationService: NotificationService,private sessionService: SessionStorageService
  ) { }
  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.data = this.sessionService.decryptSessionData('data');
    this.pageHeading = 'Pending Hospital Claims'

    this.getPendingHospitalClaims();
  }

  getPendingHospitalClaims() {
    let hospitalCode: any, userId: any;

    if (this.data) {
      hospitalCode = this.data.hospitalCode;
      userId = this.data.userId;
      this.actionCode = this.data.actionCode;
      this.days = this.data.days;
    } else {
      hospitalCode = null;
      userId = this.user.userId;
      this.actionCode = 2;
      this.days = 60;
    }

    this.notificationService.getPendingHospitalClaims(hospitalCode, userId, this.actionCode, this.days)
      .subscribe((response: any) => {
          if (response.statusCode === 200 && response.status === 'success') {
            this.pendingHospitalClaims = response.data;
            this.totalClaimsCount = response.data.length;
            this.showPagination = true;
            this.getHospitalListClaimsNotVerified(0, 60);
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getHospitalListClaimsNotVerified(actionCode: any, days: any) {
    this.notificationService.getHospitalListClaimsNotVerified(this.user.userId, actionCode, days).subscribe((response) => {
      if (response.statusCode == 200 && response.status == 'success') {
        this.hospitalList = response.data;
      }
    }, (error) => {
      console.log(error);
    });
  }
  pageItemChange(event: any) {
    this.pageElement = event.target.value;
  }

  convertDate(date) {
    const datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }

  downloadReport(type : any) {
    let SlNo = 1;
    let report = [];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let heading = [['Sl#', 'Claim No', 'Case No', 'URN', 'Hospital Name', 'Package Code', 'Actual Date Of Admission', 'Actual Date Of Discharge', 'Pending For']];
    if (type == 'excel') {
      let claim: any;
      this.pendingHospitalClaims.forEach(element => {
        claim = {
          "Sl#": SlNo,
          "Claim No": element.claimNo,
          "URN": element.urn,
          "Case No": element.caseNo,
          "Hospital Name": element.hospitalName,
          "Package Code": element.packageCode,
          "Actual Date Of Admission": this.convertDate(element.actualDateOfAdmission),
          "Actual Date Of Discharge": this.convertDate(element.actualDateOfDischarge),
          "Pending For": element.claimStatus
        }
        report.push(claim);
        SlNo++;
      });
      TableUtil.exportListToExcel(report, "Pending Hospital Claims Not Verified Since 7 Days", heading);
    } else if (type == 'pdf') {
      if (this.pendingHospitalClaims.length > 0) {
        this.pendingHospitalClaims.forEach(element => {
          let rowData = [];
          rowData.push(SlNo);
          rowData.push(element.claimNo);
          rowData.push(element.caseNo);
          rowData.push(element.urn);
          rowData.push(element.hospitalName);
          rowData.push(element.packageCode);
          rowData.push(this.convertDate(element.actualDateOfAdmission));
          rowData.push(this.convertDate(element.actualDateOfDischarge));
          rowData.push(element.claimStatus);
          report.push(rowData);
          SlNo++;
        });
        let doc = new jsPDF('p', 'pt');
        doc.setFontSize(20);
        doc.setTextColor(26, 99, 54);
        doc.setFont('helvetica', 'bold');
        doc.text('Pending Hospital Claims Not Verified Since 7 Days', 70, 30);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('Document Generate Date : ' + new Date().getDate() + ' ' + months[new Date().getMonth()] + ' ' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), 190, 50);

        autoTable(doc,
          {
            head: heading,
            body: report,
            startY: 60,
            theme: 'grid',
            styles: {overflow: 'linebreak', fontSize: 8, valign: 'middle', halign: 'left', font: 'helvetica'},
            headStyles: {fillColor: [26, 99, 54], textColor: 255, fontStyle: 'bold', fontSize: 8},
            bodyStyles: {textColor: 0, fontSize: 8, overflow: 'linebreak'}
          });

        doc.save('Pending Hospital Claims Not Verified Since 7 Days.pdf');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No Data Found!',
        });
      }
    }
  }

  getHospital(event: any) {
    this.notificationService.getPendingHospitalClaims(event.target.value, this.user.userId, 1, 60)
      .subscribe((response: any) => {
        if (response.statusCode == 200 && response.status == 'success') {
          this.pendingHospitalClaims = response.data;
          this.totalClaimsCount = response.data.length;
          this.showPagination = true;
        }
      });
  }

    searchFilter() {
    let hospitalCode: any, actionCode: any, days: any;

    hospitalCode = $('#hospitalCode').val();
    days = $('#days').val();

    if (hospitalCode == '' || hospitalCode == null) {
      actionCode = 2;
      this.getHospitalListClaimsNotVerified(0, days);
    }
    else
      actionCode = 1;

    this.notificationService.getPendingHospitalClaims(hospitalCode, this.user.userId, actionCode, this.days)
        .subscribe((response: any) => {
            if (response.statusCode === 200 && response.status === 'success') {
              console.log(response.data)
                this.pendingHospitalClaims = response.data;
                this.totalClaimsCount = response.data.length;
                this.showPagination = true;
            }
          }, (error) => {
          console.error(error);
        });
    }

  ResetField() {
    sessionStorage.removeItem('searchFilterParameters');
    window.location.reload();
  }
}
