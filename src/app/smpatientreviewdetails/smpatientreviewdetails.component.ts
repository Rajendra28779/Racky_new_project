import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../services/session-storage.service';
import { HeaderService } from '../application/header.service';
import { TreatmenthistoryperurnService } from '../application/Services/treatmenthistoryperurn.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';
declare let $: any;

@Component({
  selector: 'app-smpatientreviewdetails',
  templateUrl: './smpatientreviewdetails.component.html',
  styleUrls: ['./smpatientreviewdetails.component.scss']
})
export class SmpatientreviewdetailsComponent implements OnInit {
  user: any;
  currentPage: any;
  pageElement: any;
  transactiondetailsid: any;
  constructor(private sessionService: SessionStorageService, 
    public headerService: HeaderService, private treatmenthistoryperurnService: TreatmenthistoryperurnService,public snoService: SnoCLaimDetailsService,
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('SwasthyaMitra-Patient Review Details');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData('user');
    this.currentPage = 1;
    this.pageElement = 100;
    this.transactiondetailsid = this.sessionService.decryptSessionData('transactionid');
    this.getswasthyamitrapatientreviewdtls();
  }
  reviewdtls: any = [];
  getswasthyamitrapatientreviewdtls() {
    this.reviewdtls = [];
    // let transactionid = this.transactiondetailsid;
    let transactionid = '1850630';
    this.treatmenthistoryperurnService.getswasthyamitrapatientreviewdtls(transactionid).subscribe((data: any) => {
      this.reviewdtls = data.detailslist;
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  downloadAction(event: any, filename: any, hospitalCode: any, dateOfAdmission: any) {
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (filename != null) {
        this.snoService.downloadFiles(filename, hospitalCode, this.Dateconvert(dateOfAdmission)).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }

  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd MMM yyyy');
  }
}
