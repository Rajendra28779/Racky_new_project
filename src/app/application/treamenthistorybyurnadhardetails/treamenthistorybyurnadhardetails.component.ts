import { Component, OnInit } from '@angular/core';
import { MisreportService } from '../Services/misreport.service';
import { PreauthService } from '../Services/preauth.service';

@Component({
  selector: 'app-treamenthistorybyurnadhardetails',
  templateUrl: './treamenthistorybyurnadhardetails.component.html',
  styleUrls: ['./treamenthistorybyurnadhardetails.component.scss']
})
export class TreamenthistorybyurnadhardetailsComponent implements OnInit {
value='Rajendra';
trtmntid:any;
actioncode:any;
package:any;
result:any;
response:any;
highenddrug:any=[];
preauth:any=[];

  constructor(private misservice:MisreportService,public preauthService: PreauthService) { }

  ngOnInit(): void {
    this.trtmntid=localStorage.getItem('treatmentid');
    this.actioncode=localStorage.getItem('actiocode');
    this.package=localStorage.getItem('packageid');
    this.misservice.treatmenthistorydetails(this.trtmntid,this.actioncode,this.package).subscribe((data:any)=>{
      console.log(data);
      this.response=data;
      this.result=this.response.treatmenthistory;
      this.highenddrug=this.response.highEndDrugInfoList;
      this.preauth=this.response.preauth;
    },
    (error) => console.log(error)
    );
  }

  download(pdfName, dateOfAdm,hcode) {
    let hCode = hcode;
    let img = this.preauthService.downloadFileBySNA(pdfName, hCode, dateOfAdm);
    window.open(img, '_blank');
  }

}
