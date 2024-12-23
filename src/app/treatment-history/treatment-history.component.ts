import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TreatmenthistoryperurnService } from '../application/Services/treatmenthistoryperurn.service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-treatment-history',
  templateUrl: './treatment-history.component.html',
  styleUrls: ['./treatment-history.component.scss']
})
export class TreatmentHistoryComponent implements OnInit {
  urn: any;
  trtData: any = [];
  token: any;
  constructor(private treatmenthistoryperurn: TreatmenthistoryperurnService, private route: Router) {
    // this.txnId =
    //   this.route.getCurrentNavigation().extras.state['transactionId'];
    // this.token = this.route.getCurrentNavigation().extras.state['token'];
    // console.log(this.txnId);
  }

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
      this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/trackingdetails'); });
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
