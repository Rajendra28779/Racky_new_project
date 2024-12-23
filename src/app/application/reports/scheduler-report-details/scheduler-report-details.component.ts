import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HeaderService} from "../../header.service";
import {SchedulerServiceService} from "../../Services/scheduler-service.service";
import Swal from "sweetalert2";
import {TableUtil} from "../../util/TableUtil";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  selector: 'app-scheduler-report-details',
  templateUrl: './scheduler-report-details.component.html',
  styleUrls: ['./scheduler-report-details.component.scss']
})
export class SchedulerReportDetailsComponent implements OnInit {

  showPagination: any;
  pageElement: any = 25;
  currentPage: any = 1;
  reportData: any;
  inputData: any;
  outputData: any = [];
  headerData: any = [];
  reportId: any;
  apiId: any;
  dataStatus: any;
  oldData: any;
  searchFilter: any;

  constructor(
    private router: Router,
    public headerService: HeaderService,
    private schedulerService : SchedulerServiceService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Scheduler Report Details');
    this.reportId = localStorage.getItem('reportId');
    this.apiId = localStorage.getItem('apiId');
    this.dataStatus = localStorage.getItem('dataStatus');

    this.getReportDetails();
  }

  getReportDetails() {
    this.schedulerService.getReportDetails(this.reportId, this.apiId, this.dataStatus).subscribe((data: any) => {
      if (data.statusCode == 200 && data.status == 'Success') {
        this.reportData = data.data;
        this.inputData = JSON.parse(JSON.stringify(this.reportData.inputData));
        this.outputData = JSON.parse(JSON.stringify(this.reportData.outputData));
        this.headerData = JSON.parse(JSON.stringify(this.reportData.headerData));
        console.log("Header Data");
        console.log(this.headerData);
        console.log("Output Data");
        console.log(this.outputData);
        this.showPagination = true;
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.message,
          icon: 'error',
        })
      }
    });
  }

  openModal(serviceName : any, oldDataId : any) {
    this.schedulerService.getOldDataDetails(serviceName, oldDataId).subscribe((data: any) => {
      if (data.statusCode == 200 && data.status == 'Success') {
        this.oldData = data.data;
        console.log("Old Data");
        console.log(this.oldData)
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.message,
          icon: 'error',
        })
      }
    });
    $("#modal").show();
    $(".report-class").css("filter", "blur(8px)");
  }

  closeModal() {
    $("#modal").hide();
    $(".report-class").css("filter", "blur(0px)");
  }

  convertToTitleCase(value: string): string {
    const words = value.split(/(?=[A-Z])|_/);
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');//Camel Case
    // return words.map(word => word.toUpperCase()).join('');//Upper Case
  }

  downloadReport(type : any) {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (this.outputData.length == 0) {
      Swal.fire({
        title: 'Error!',
        text: 'No data found to download',
        icon: 'error',
      })
      return;
    } else {
      let report = [];
      let heading = [['Sl#', ...this.headerData]]
      if (type == 'excel') {
        let reportData: any;
        let slNo = 1;
        this.outputData.forEach(element => {
          reportData = {
            "Sl#": slNo
          };
          this.headerData.forEach(header => {
            reportData[header] = element[header];
          });
          report.push(reportData);
          slNo++;
        });
        TableUtil.exportListToExcel(report, this.reportData.apiName + " Report", heading);
      } else if (type == 'pdf') {
        if (this.outputData.length > 0) {
          let slNo = 1;
          this.outputData.forEach(element => {
            let reportData = [];
            reportData.push(slNo);
            this.headerData.forEach(header => {
              reportData.push(element[header])
            });
            report.push(reportData);
            slNo++;
          });

          const doc = new jsPDF('p', 'pt');
          doc.setFontSize(18);
          doc.setTextColor(26, 99, 54);
          doc.setFont('helvetica', 'bold');
          doc.text(this.reportData.apiName + " Service Report", this.apiId == 1 ? 80 : this.apiId == 2 ? 160 : this.apiId == 3 ? 180 : this.apiId == 4 ? 150 : this.apiId == 5 ? 160 : this.apiId == 6 ? 220 : this.apiId == 7 ? 200 : this.apiId == 8 ? 200 : 160, 30);
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.text('Document Generate Date : ' + new Date().getDate() + ' ' + months[new Date().getMonth()] + ' ' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), 180, 50);

          autoTable(doc,
            {
              head: heading,
              body: report,
              startY: 80,
              theme: 'grid',
              styles: {overflow: 'linebreak', fontSize: 8, valign: 'middle', halign: 'left', font: 'helvetica'},
              headStyles: {fillColor: [26, 99, 54], textColor: 255, fontStyle: 'bold', fontSize: 8},
              bodyStyles: {textColor: 0, fontSize: 8, overflow: 'linebreak'}
            });
          doc.save(this.reportData.apiName + "Service Details Report.pdf");
        }
      }
    }
  }

  pageItemChange(event : any) {
    this.pageElement = event.target.value;
  }
  protected readonly console = console;
}
