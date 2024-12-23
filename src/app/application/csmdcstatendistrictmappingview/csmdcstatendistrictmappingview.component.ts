import { Component, OnInit } from '@angular/core';
import { DcconfigurationService } from '../Services/dcconfiguration.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { HeaderService } from '../header.service';
import { NavigationExtras, Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
declare let $: any;

@Component({
  selector: 'app-csmdcstatendistrictmappingview',
  templateUrl: './csmdcstatendistrictmappingview.component.html',
  styleUrls: ['./csmdcstatendistrictmappingview.component.scss']
})
export class CsmdcstatendistrictmappingviewComponent implements OnInit {
  user: any;
  currentPage: any;
  currentPage1: any;
  pageElement: any;
  pageElement1: any;
  txtsearchDate: any;
  csmdcList: any = [];
  list: any = [];
  loglist: any = [];
  showPegi: boolean = false;
  showPegi1: boolean = false;
  constructor(private dcService: DcconfigurationService,
    private snoService: SnocreateserviceService, public headerService: HeaderService,
    private route: Router, private sessionService: SessionStorageService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('CSM-DC State And District Mapping');
    this.currentPage = 1;
    this.currentPage1 = 1;
    this.pageElement = 10;
    this.pageElement1 = 10;
    this.getCSMDCList();
    this.view();

  }

  getCSMDCList() {
    this.dcService.getCSMDCDetails().subscribe(
      (response) => {
        this.csmdcList = response;
      },
      (error) => console.log(error)
    )
  }

  count: any
  count1: any
  view() {
    let dcId = $("#fullname").val()
    let userid = this.user.userId;
    if (dcId == null || dcId == undefined || dcId == "") {
      dcId = "";
    } else {
      dcId = dcId;
    }
    this.dcService.getviewlist(dcId, userid).subscribe((response: any) => {
      if (response.status == 'success') {
        let details = JSON.parse(response.details);
        this.list = details.data;
        this.count = this.list.length;
        if (this.count > 0) {
          this.showPegi = true
        } else {
          this.showPegi = false
        }
      }
    })
  }
  onReset() {
    window.location.reload()
  }
  report: any = [];
  sno: any = {
    Slno: "",
    assignedCSMDCName: "",
    stateName: "",
    districtName: "",
  };
  heading = [['Sl#', 'Assigned CSM-DC Name', 'State Name', 'District Name']];
  downloadReport(no: Number) {
    this.report = [];
    if (no === 1) {
      let claim: any;
      for (var i = 0; i < this.list.length; i++) {
        claim = this.list[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.assignedCSMDCName = claim.csmdcname;
        this.sno.stateName = claim.statename;
        this.sno.districtName = claim.districtname;
        this.report.push(this.sno);
      }
      let csmdcname = 'All';
      let csmdc = $("#fullname").val();
      let filter1 = [];
      if (csmdc != null || csmdc != undefined || csmdc != '') {
        const selectedUser = this.csmdcList.find(item => item.userId == csmdc);
        if (selectedUser) {
          csmdcname = selectedUser.fullName;
        } else {
          csmdcname = 'All';
        }
      } else {
        csmdcname = 'All';
      }
      filter1.push([['CSM-DC Name:-', csmdcname]]);
      TableUtil.exportListToExcelWithFilterforadmin(this.report, "CSM-DC State And District Mapping-View", this.heading, filter1);

    } else if (no === 2) {
      if (this.list.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let csmdcname = 'All';
      let csmdc = $("#fullname").val();
      if (csmdc != null || csmdc != undefined || csmdc != '') {
        const selectedUser = this.csmdcList.find(item => item.userId == csmdc);
        if (selectedUser) {
          csmdcname = selectedUser.fullName;
        } else {
          csmdcname = 'All';
        }
      } else {
        csmdcname = 'All';
      }
      let SlNo = 1;
      this.list.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.csmdcname);
        rowData.push(element.statename);
        rowData.push(element.districtname);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('CSM-DC Name :-' + csmdcname, 5, 5);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 10);
      doc.text('CSM-DC State And District Mapping-View', 100, 12);
      doc.setLineWidth(0.7);
      doc.line(100, 13, 142, 13);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 15, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 60 },
          2: { cellWidth: 60 },
          3: { cellWidth: 70 },
        }
      })
      doc.save('CSM-DC_State_And District_Mapping-View.pdf');
    }
  }


  toggleShowMore(row: any): void {
    row.showMore = !row.showMore;
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  log(csmdcuserid: any, statecode: any) {
    this.loglist = [];
    let userid = this.user.userId;
    this.dcService.getviewloglist(csmdcuserid, userid, statecode).subscribe((response: any) => {
      if (response.status == 'success') {
        let details = JSON.parse(response.details);
        this.loglist = details.data;
        this.count1 = this.loglist.length;
        if (this.count1 > 0) {
          const modalElement = document.getElementById('dataModal');
          if (modalElement) {
            modalElement.classList.add('show');
            modalElement.style.display = 'block';
          }
          this.showPegi1 = true
        } else {
          const modalElement = document.getElementById('dataModal');
          if (modalElement) {
            modalElement.classList.remove('show');
            modalElement.style.display = 'none';
          }
          this.showPegi1 = false
        }
      }
    })
  }
  edit(csmdcuserid: any, statecode: any) {
    let objToSend: NavigationExtras = {
      state: {
        csmdcId: csmdcuserid,
        statecode: statecode
      }
    };
    this.route.navigate(['/application/csmdcstateanddistrictmapping'], objToSend);
  }

  closeModal() {
    this.loglist = [];
    const modalElement = document.getElementById('dataModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
  }


  pageItemChange1() {
    this.pageElement1 = (<HTMLInputElement>document.getElementById("pageItem1")).value;
  }

  onPageBoundsCorrection1(number: number) {
    this.currentPage1 = number;
  }


}
