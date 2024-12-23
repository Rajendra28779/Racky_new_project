import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { TreatmenthistoryperurnService } from '../application/Services/treatmenthistoryperurn.service';

@Component({
  selector: 'app-treatment-history-cpd',
  templateUrl: './treatment-history-cpd.component.html',
  styleUrls: ['./treatment-history-cpd.component.scss']
})
export class TreatmentHistoryCpdComponent implements OnInit {
  urn: any;
  trtData: any = [];
  token: any;
  constructor(private treatmenthistoryperurn: TreatmenthistoryperurnService, private route: Router) { }

  ngOnInit(): void {
    this.urn = localStorage.getItem("urn");
    this.token = localStorage.getItem("token");
    this.getTreatMentHistory();
  }


  getTreatMentHistory() {
    let urno = this.urn;
    console.log("urno--", urno);
    console.log("token--", this.token);
    this.treatmenthistoryperurn.searchbyUrn2(urno, this.token).subscribe(data => {
      this.trtData = data;
      console.log(this.trtData);
      // localStorage.removeItem("urn");
      // localStorage.removeItem("token");
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  getDetails(transactionId, claimId) {
    let trnsId = transactionId;
    let clmId = claimId;
    if (clmId != null || clmId != undefined) {
      localStorage.setItem("claimid", clmId);
      // localStorage.setItem("token",this.token);
      this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/trackingdetailscpd'); });
    } else {
      localStorage.setItem("trnsId", trnsId);
      this.route.navigate(['/treatmentinfo']);
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
