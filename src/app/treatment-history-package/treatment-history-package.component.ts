import { Component, OnInit } from '@angular/core';
import { TreatementhistoryService } from '../application/Services/treatementhistory.service';

@Component({
  selector: 'app-treatment-history-package',
  templateUrl: './treatment-history-package.component.html',
  styleUrls: ['./treatment-history-package.component.scss']
})
export class TreatmentHistoryPackageComponent implements OnInit {
  txnId: any;
  token: any;
  packagecode:any;
  treatmenthistory: any = [];

  constructor(private treatementhistory:TreatementhistoryService) { }

  ngOnInit(): void {
    this.txnId = localStorage.getItem("urn");
    this.packagecode = localStorage.getItem("packagecode");
    this.token = localStorage.getItem("token");
    this.getTreatMentHistory();
  }
  getTreatMentHistory() {
    this.treatementhistory.getserch2(this.txnId,this.packagecode,this.token).subscribe(data => {
      this.treatmenthistory = data;
      console.log(this.treatmenthistory)
      localStorage.removeItem("urn");
      localStorage.removeItem("packagecode");
      localStorage.removeItem("token");
    });
  }
}
