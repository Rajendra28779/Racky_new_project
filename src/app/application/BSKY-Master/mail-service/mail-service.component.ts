import { Component, OnInit } from '@angular/core';
import {HeaderService} from "../../header.service";
import {MailCommunicationService} from "../../Services/mail-communication.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import Swal from "sweetalert2";
import {TableUtil} from "../../util/TableUtil";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'app-mail-service',
  templateUrl: './mail-service.component.html',
  styleUrls: ['./mail-service.component.scss']
})
export class MailServiceComponent implements OnInit {

  isSave: boolean = true;
  isVisible: boolean = true;
  mailServiceFormGroup : FormGroup;
  mailServiceList: any[] = [];
  showPagination: any;
  pageElement: any = 10;
  currentPage: any = 1;
  searchFilter: any;
  id: any;
  activeStatus: boolean = true;

  constructor(
    private headerService: HeaderService,
    private mailCommunicationService: MailCommunicationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle("Create Mail Service");

    this.mailServiceFormGroup = this.formBuilder.group({
      mailServiceName : new FormControl(''),
      mailServiceDesc : new FormControl(''),
    });
  }
  protected readonly Number = Number;

  getMailServiceList() {
    this.mailCommunicationService.getMailServiceList().subscribe((res: any) => {
      if (res.status == 'success' && res.statusCode == 200) {
        this.mailServiceList = res.data;
        this.showPagination = true;
      } else {
        this.mailServiceList = [];
        this.showPagination = false;
      }
    });
  }

  add() {
    this.isVisible = true;
    this.isSave = true;
    $('#add').addClass('active');
    $('#view').removeClass('active');
  }

  view() {
    this.isVisible = false;
    $('#view').addClass('active');
    $('#add').removeClass('active');
    $('#update').removeClass('active');
    this.getMailServiceList();
  }

  update() {
    this.isSave = false;
    this.isVisible = true;
    $('#update').addClass('active');
    $('#view').removeClass('active');
  }

  saveMailService() {
    if ( this.mailServiceFormGroup.value.mailServiceName == '' || this.mailServiceFormGroup.value.mailServiceName == undefined) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter Mail Service Name',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    } else if ( this.mailServiceFormGroup.value.mailServiceDesc == '' || this.mailServiceFormGroup.value.mailServiceDesc == undefined) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter Mail Service Description',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    } else {
      let mailServiceData = {
        "mailServiceName": this.mailServiceFormGroup.value.mailServiceName,
        "mailServiceDesc": this.mailServiceFormGroup.value.mailServiceDesc,
        "id": this.id,
        "activeStatus": this.activeStatus == true ? 0 : 1
      };

      this.mailCommunicationService.saveMailServiceData(mailServiceData).subscribe((res: any) => {
          if (res.status == 'success' && res.statusCode == 200) {
            Swal.fire({
              title: 'Success',
              text: res.message,
              icon: 'success',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                this.resetForm();
              }
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: res.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        },
        (err: any) => {
          Swal.fire({
            title: 'Error',
            text: err,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }

  editMailService(id : any) {
    this.mailCommunicationService.getMailServiceDataById(id).subscribe((res: any) => {
      if (res.status == 'success' && res.statusCode == 200) {
        this.mailServiceFormGroup.patchValue({
          mailServiceName : res.data.mailServiceName,
          mailServiceDesc : res.data.mailDescription,
        });
        this.id = res.data.id;
        this.activeStatus = res.data.statusFlag == 0 ? true : false;
        this.isSave = false;
        this.update();
      } else {
        Swal.fire({
          title: 'Error',
          text: res.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    })
  }

  setStatus(event : any) {
    this.activeStatus = !!event.target.checked;
  }

  formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();
    return day + '-' + months[month] + '-' + year;
  }

  createReportArray() {
    let report = [];
    let SlNo = 1;
    this.mailServiceList.forEach((element) => {
      report.push([
        SlNo,
        element.mailServiceName,
        element.mailDescription,
        this.formatDate(element.createdOn),
        element.createdBy,
        element.statusFlag == 0 ? 'Active' : 'Inactive'
      ]);
      SlNo++;
    });
    return report;
  }

  downloadReport(status) {
    if (this.mailServiceList.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'No Data Found',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const report = this.createReportArray();
    const heading = [['Sl#', 'Service Name', 'Mail Description', 'Created On', 'Created By', 'Status']];
    let currentDate = new Date();

    if (status === 'excel') {
      TableUtil.exportListToExcel(report, 'Mail Service Report', heading);
    } else {
      let doc = new jsPDF('p', 'pt');
      doc.setFontSize(20);
      doc.setTextColor(26, 99, 54);
      doc.setFont('helvetica', 'bold');
      doc.text('Mail Service Report', 220, 30);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Document Generate Date: ' + currentDate.getDate() + ' ' + months[new Date().getMonth()] + ' ' + currentDate.getFullYear() + ' ' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds(), 180, 50);

      autoTable(doc, {
        head: heading,
        body: report,
        startY: 70,
        theme: 'grid',
        styles: { overflow: 'linebreak', fontSize: 8, valign: 'middle', halign: 'left', font: 'helvetica' },
        headStyles: { fillColor: [26, 99, 54], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { textColor: 0, fontSize: 8, overflow: 'linebreak' }
      });

      doc.save('Mail Service Report.pdf');
    }
  }


  resetForm() {
    window.location.reload();
  }
}
