import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { HeaderService } from '../header.service';
import { WebcommonservicesService } from 'src/app/services/form-services/webcommonservices.service';
import { subscribeOn } from 'rxjs';
import { log } from 'console';
import { formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospempanelmentdownlordpdf',
  templateUrl: './hospempanelmentdownlordpdf.component.html',
  styleUrls: ['./hospempanelmentdownlordpdf.component.scss']
})
export class HospempanelmentdownlordpdfComponent implements OnInit {
  user1:any
  fclts: any;
  fcltsName: any;
 // VCH_FCLT_DTLS: any;
  VCH_LNHOUS_TIEUP: any;
  VCH_APPROVAL_NAME: any = [];
  VCH_APPROVAL_NAME1: any = [];
  VCH_APPROVAL_NAME2: any = [];
 // VCH_SPECIALITIES: any;
 VCH_SPECIALITIES: any = [];
 VCH_FCLT_DTLS: any =[];
  constructor(private route:Router, public headerService: HeaderService,private WebCommonService : WebcommonservicesService,private sessionService: SessionStorageService) {
    this.user1 = this.route.getCurrentNavigation().extras.state;
  }
  user:any
  sec1:any = []
  sec2:any= []
  sec3:any= []
  sec4:any= []
  sec5:any= []
  sec6:any= []
  sec7:any=[]
  sec8:any= []
  sec9:any= []
  sec51:any=[];
  sec52:any=[];
  sec53:any=[];
  show:any
  selecteddist:any
  selecteddistName:any
  processid:any
  onlineserviceid:any
  userforfullname:any;
  ngOnInit(): void {
    this.headerService.setTitle('Application Form');
    if(this.user1!=undefined){
    this.userforfullname = this.sessionService.decryptSessionData("user");
     this.user=this.user1.user
     this.processid=this.user1.processid
     this.onlineserviceid=this.user1.onlsid
     let dynSchmCtrlParms = {
      'intProcessId': this.processid,
      'intOnlineServiceId' :this.onlineserviceid,
      'sectionId'          :'',
      'profileId'          :''
    }

    dynSchmCtrlParms.sectionId=this.user.sec_1_480.sectionid;
    this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
      this.sec1=res.result.sec_1_480.dataValue
      if(this.sec1.JSONOPTIONTEXTDETAILS !=undefined && this.sec1.JSONOPTIONTEXTDETAILS !="" && this.sec1.JSONOPTIONTEXTDETAILS!=null){
      this.selecteddist = JSON.parse(this.sec1.JSONOPTIONTEXTDETAILS);
      console.log(this.selecteddist)
      }
    });
    dynSchmCtrlParms.sectionId=this.user.sec_2_192.sectionid;
    this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
      this.sec2=res.result.sec_2_192.dataValue
     
    });
    dynSchmCtrlParms.sectionId=this.user.sec_3_195.sectionid;
    this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
      this.sec3 = res.result.sec_3_195.addMoreValueDetails.ctrl_11212022114737.addMoreDataValue;

      this.sec3.forEach((item) => {
        const jsonOptTxtDetails = JSON.parse(item.jsonOptTxtDetails);
        this.VCH_SPECIALITIES.push(jsonOptTxtDetails.VCH_SPECIALITIES);
      });
    });
    // dynSchmCtrlParms.sectionId=this.user.sec_4_156.sectionid;
    // this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
    //   this.sec4=res.result.sec_4_156.dataValue
    // });
    // Mapping for 'Y' to 'YES' and 'N' to 'NO'
const valueName = {
  'N': 'NO',
  'Y': 'YES'
};

function convertToYesNo(value: string): string {
  return valueName[value] || value;
}

dynSchmCtrlParms.sectionId=this.user.sec_4_156.sectionid;
this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe((res) => {
  this.sec4 = res.result.sec_4_156.dataValue;

  const keysToConvert = [
    'VCH_DESIGN',
    'VCH_FIRE_FIGHT',
    'VCH_WASTEMGMT',
    'VCH_RAMP',
    'VCH_GENERAL',
    'VCH_OPD',
    'VCH_HDU_C',
    'VCH_TOTAL_ICU',
    'VCH_OPD_C',
    'VCH_CASUALTY',
    'VCH_LABOUR',
    'VCH_BLOOD_BANK',
    'VCH_MED_RECORDS',
    'VCH_AMBU_SERVICE',
    'VCH_DIAG_CENTER',
    'VCH_OXG_SUPPLY',
    'VCH_PIPE_SUC_MED_GAS',
    'VCH_EQP_MNT_BD_TEMP',
    'MANPOW_MONITOR',
    'VCH_ELECTRIC_SUPPLY',
    'VCH_ICU_OX_SUPPLY',
    'VCH_ICU_PIPE',
    'VCH_ICU_BODYTEMP',
    'VCH_ICU_MANPOW',
    'VCH_ICU_ELECTRIC_SUPPLY'
  ];

  keysToConvert.forEach((key) => {
    if (this.sec4[key] !== undefined) {
      this.sec4[key] = convertToYesNo(this.sec4[key]); 
    }
  });
});


    dynSchmCtrlParms.sectionId=this.user.sec_5_240.sectionid;
    this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
      // console.log(res);
      this.sec51=res.result.sec_5_240.addMoreValueDetails.ctrl_11222022061240.addMoreDataValue
      this.sec52=res.result.sec_5_240.addMoreValueDetails.ctrl_11222022063317.addMoreDataValue
      this.sec53=res.result.sec_5_240.addMoreValueDetails.ctrl_11222022070944.addMoreDataValue
      this.sec51.forEach((item) => {
        const jsonOptTxtDetails = JSON.parse(item.jsonOptTxtDetails);
        this.VCH_APPROVAL_NAME.push(jsonOptTxtDetails.VCH_APPROVAL_NAME); 
      console.log(this.VCH_APPROVAL_NAME);
      });

      this.sec52.forEach((item) => {
        const jsonOptTxtDetails = JSON.parse(item.jsonOptTxtDetails);
        this.VCH_APPROVAL_NAME1.push(jsonOptTxtDetails.VCH_APPROVAL_NAME1); 
      });

      this.sec53.forEach((item) => {
        const jsonOptTxtDetails = JSON.parse(item.jsonOptTxtDetails);
        this.VCH_APPROVAL_NAME2.push(jsonOptTxtDetails.VCH_APPROVAL_NAME2); 
      });

     });
    dynSchmCtrlParms.sectionId=this.user.sec_6_891.sectionid;
    this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
      this.sec6=res.result.sec_6_891.dataValue
    
    });
    dynSchmCtrlParms.sectionId=this.user.sec_7_193.sectionid;
const nameMapping = {
  '1': 'In-House Service',
  '2': 'Tie-Up Service'
};

this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
  this.sec7 = res.result.sec_7_193.addMoreValueDetails.ctrl_11212022055430.addMoreDataValue;
  
  this.sec7.forEach((item) => {
    const jsonOptTxtDetails = JSON.parse(item.jsonOptTxtDetails);
    this.VCH_FCLT_DTLS.push(jsonOptTxtDetails.VCH_FCLT_DTLS); 


    item.VCH_LNHOUS_TIEUP_NAME = nameMapping[item.VCH_LNHOUS_TIEUP] || 'Unknown Service'; 
  });
});
    dynSchmCtrlParms.sectionId=this.user.sec_8_121.sectionid;
    this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
        this.sec8=res.result.sec_8_121.dataValue
    });
    dynSchmCtrlParms.sectionId=this.user.sec_9_530.sectionid;
    this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
  
      this.sec9=res.result.sec_9_530.dataValue
 
      if(this.sec9!=undefined){
        this.show=1;
      }
    });
      this.show=2;
    }
  }

  public openPDF(): void {
    let DATA: any = document.getElementById('content');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 178;
      let pageheight=273;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      let heightleft = fileHeight;
      heightleft -= pageheight;
      const FILEURI = canvas.toDataURL('image/jpeg',1.0);
      let PDF = new jsPDF('p', 'mm');
      PDF.setFontSize(12);
      PDF.text("Hospital Empanelment Data", 10, 10);
      PDF.text("Generated By: "+this.userforfullname.fullName+"\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 10, 20);
      let position = 30;
      PDF.addImage(FILEURI, 'JPEG', 10, position, fileWidth, fileHeight,'',"FAST");
      while(heightleft >= 0){
        let position = (heightleft - fileHeight);
        PDF.addPage();
        PDF.addImage(FILEURI, 'JPEG', 10, position, fileWidth, fileHeight,'',"FAST");
        heightleft -= pageheight;
      }
      PDF.save('Hospital_Empanelment_Data.pdf');
    });

    

   
  }


  

 




}
