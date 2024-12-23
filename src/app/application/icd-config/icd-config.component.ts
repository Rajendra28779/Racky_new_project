import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as ECT from '@whoicd/icd11ect';
import { Subscription } from 'rxjs';
import { ICDSharedServices } from 'src/app/services/ICDSharedServices';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { MisreportService } from '../Services/misreport.service';
@Component({
  selector: 'app-icd-config',
  templateUrl: './icd-config.component.html',
  styleUrls: ['./icd-config.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IcdConfigComponent implements OnInit {
  user: any;
  icdTableData: any = [];
  iCDSubscription: Subscription;
  constructor(private msgService: ICDSharedServices, private sessionService: SessionStorageService,
    private misservice:MisreportService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");

    this.iCDSubscription = this.msgService.message$.subscribe((res) => {
      console.log(res);
      this.getIcdFilteredData(res);
    });

    const settings = {
      // the API located at the URL below should be used only for software development and testing
      apiServerUrl: 'https://icd11restapi-developer-test.azurewebsites.net',
      autoBind: false, // in Angular we recommend using the manual binding
    };
    const callbacks = {
      selectedEntityFunction: (selectedEntity) => {
        // shows an alert with the code selected by the user and then clears the search results
        // console.log(selectedEntity);
        this.icdData1(selectedEntity);
        if (selectedEntity != null || selectedEntity != undefined) {
          ECT.Handler.clear(selectedEntity.iNo);
        }
      },
    };
    ECT.Handler.configure(settings, callbacks);
    ECT.Handler.overwriteConfiguration('1', { popupMode: true });
    ECT.Handler.overwriteConfiguration('2', { popupMode: true });
  }
  icdData1(selectedEntity: any) {
    let pri=$('#primary').val();
    let sec=$('#secoundry').val();
    let searchkey = selectedEntity.iNo==1?pri:sec;

    let hasMatch = false;
    for (let index = 0; index < this.icdTableData.length; index++) {
      if (this.icdTableData[index].icdCode == selectedEntity.code) {
        hasMatch = true;
        break;
      }
    }
    if (hasMatch == true) {
      this.swal(
        '',
        'You have already selected this package,Please select another package!',
        'info'
      );
    } else {
      let bestMatchTextArray = selectedEntity.bestMatchText.split('/');
      let codeArray = selectedEntity.code.split('/');
      bestMatchTextArray = bestMatchTextArray.map((item) => item.trim());
      codeArray = codeArray.map((item) => item.trim());

      this.geticdlog(codeArray[codeArray.length - 1],bestMatchTextArray[bestMatchTextArray.length - 1],selectedEntity.iNo,searchkey)

      let subArry = [];
      for (let i = 0; i < bestMatchTextArray.length - 1; i++) {
        let newarray3 = {
          icdCode: codeArray[codeArray.length - 1],
          icdSubCode: codeArray[i],
          icdSubName: bestMatchTextArray[i],
        };
        subArry.push(newarray3);
      }
      let icdSelectedData = {
        icdCode: codeArray[codeArray.length - 1],
        icdName: bestMatchTextArray[bestMatchTextArray.length - 1],
        icdMode: selectedEntity.iNo,
        subList: subArry,
        isExpand: false,
        byGroupId: this.user.groupId,
        allIcdCodes: codeArray.join("/"),
        allIcdNames: bestMatchTextArray.join("/")
      };
      // this.ictDetailsArray.push(demoData);
      this.icdTableData.push(icdSelectedData);
      this.finalIcdObj = {
        flag: 1,
        icdFinalAry: this.icdTableData,
      };
      console.log(this.finalIcdObj);
      this.msgService.onFirstComponentButtonClick(this.finalIcdObj);
    }
  }

  geticdlog(icdcode:any,icdname:any,icdmode:any,searchkey:any){
    this.misservice.geticdlog(icdcode,icdname,icdmode,this.user.userId,searchkey).subscribe((data:any) =>{
    });
  }

  ngAfterContentInit() {
    // manual binding only after Angular has fully initialized all content
    ECT.Handler.bind('1');
    ECT.Handler.bind('2');
  }
  finalIcdObj: any;
  removeIcd(indexToRemove) {
    this.icdTableData.splice(indexToRemove, 1);
    this.finalIcdObj = {
      flag: 1,
      icdFinalAry: this.icdTableData,
    };
    console.log(this.finalIcdObj);
    this.msgService.onFirstComponentButtonClick(this.finalIcdObj);
  }
  getIcdFilteredData(data) {
    let ictDetailsArray = data.ictDetailsArray;
    let ictSubDetailsArray = data.ictSubDetailsArray;
    ictDetailsArray.forEach((element) => {
      let detailsIcd = [];
      ictSubDetailsArray.forEach((element1) => {
        if (element.icdInfoId == element1.icdInfoId) {
          let data = {
            icdCode: element.icdCode,
            icdSubCode: element1.icdSubCode,
            icdSubName: element1.icdSubName,
            icdInfoId: element1.icdInfoId,
          };
          detailsIcd.push(data);
        }
      });
      let data = {
        icdCode: element.icdCode,
        icdName: element.icdName,
        icdMode: element.icdMode,
        subList: detailsIcd,
        icdInfoId: element.icdInfoId,
        isExpand: false,
        byGroupId: element.byGroupId,
      };
      this.icdTableData.push(data);
    });
    this.finalIcdObj = {
      flag: 0,
      icdFinalAry: this.icdTableData,
    };
    console.log(this.finalIcdObj);
    // this.finalIcdObj = res;
    this.icdTableData = this.finalIcdObj.icdFinalAry;
    this.msgService.onFirstComponentButtonClick(this.finalIcdObj);
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}
