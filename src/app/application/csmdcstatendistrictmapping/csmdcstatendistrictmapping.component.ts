import { Component, OnInit, ViewChild } from '@angular/core';
import { DcconfigurationService } from '../Services/dcconfiguration.service';
import { HeaderService } from '../header.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-csmdcstatendistrictmapping',
  templateUrl: './csmdcstatendistrictmapping.component.html',
  styleUrls: ['./csmdcstatendistrictmapping.component.scss']
})
export class CsmdcstatendistrictmappingComponent implements OnInit {
  public csmdcList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  placeHolder = "Select District";
  keyword: any = 'fullName';
  selectedItems: any = [];
  user: any;
  csmdcId: any;
  public settingdistrictcode: any;
  List: any = [];
  @ViewChild('multiSelect') multiSelect;
  @ViewChild('auto') auto;
  csmDcFormstatendistrict: FormGroup;
  constructor(private dcService: DcconfigurationService,
    private snoService: SnocreateserviceService, public headerService: HeaderService,
    private route: Router, private sessionService: SessionStorageService, private fb: FormBuilder) { this.csmdcId = this.route.getCurrentNavigation().extras.state; }

  ngOnInit(): void {
    this.headerService.setTitle('CSM-DC State And District Mapping');
    this.user = this.sessionService.decryptSessionData("user");
    this.getCSMDCList();
    this.getStateList();

    this.csmDcFormstatendistrict = this.fb.group({
      fullname: [''],
      stateCode: [''],
      districtcode: [[]],
    });
    this.settingdistrictcode = {
      singleSelection: false,
      idField: 'districtCode',
      textField: 'districtName',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    if (this.csmdcId) {
      this.getdetailsbyid(this.csmdcId.csmdcId);
    }
  }

  getCSMDCList() {
    this.dcService.getCSMDCDetails().subscribe(
      (response) => {
        this.csmdcList = response;
      },
      (error) => console.log(error)
    )
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id: string) {
    this.csmDcFormstatendistrict.get('districtcode')?.reset();
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response: any) => {
        this.districtList = response.map(item => ({
          districtCode: item.districtcode,
          districtName: item.districtname,
        }));
      },
      (error) => console.error('Error fetching district list:', error)
    );
  }

  hospObj: any;
  onItemSelect(item: any) {
    this.hospObj = {
      stateCode: "",
      stateName: "",
      districtCode: "",
      districtName: "",
      substatus: "0"
    };

    this.hospObj.stateCode = this.csmDcFormstatendistrict.get('stateCode')?.value;
    for (var i = 0; i < this.stateList.length; i++) {
      if (this.hospObj.stateCode == this.stateList[i].stateCode) {
        this.hospObj.stateName = this.stateList[i].stateName;
        break;
      }
    }

    this.hospObj.districtCode = item.districtCode;
    for (var i = 0; i < this.districtList.length; i++) {
      if (this.hospObj.districtCode == this.districtList[i].districtCode) {
        this.hospObj.districtName = this.districtList[i].districtName;
        break;
      }
    }

    var stat: boolean = false;
    for (const i of this.List) {
      if (i.districtCode == this.hospObj.districtCode) {
        stat = true;
        break;
      }
    }
    if (!stat) {
      this.List.push(this.hospObj);
    }
  }

  onItemDeSelect(item: any) {
    const index = this.List.findIndex(hosp => hosp.districtCode === item.districtCode);
    if (index !== -1) {
      // Update the substatus to "1" for deselected items
      this.List[index].substatus = "1";

      // Remove the item from the List if necessary
      this.List.splice(index, 1);
    }
  }


  onSelectAll(list: any) {
    for (let x = 0; x < list.length; x++) {
      let item = list[x];

      this.hospObj = {
        stateCode: "",
        stateName: "",
        districtCode: "",
        districtName: "",
        substatus: "0"
      };

      this.hospObj.stateCode = this.csmDcFormstatendistrict.get('stateCode')?.value;
      for (var i = 0; i < this.stateList.length; i++) {
        if (this.hospObj.stateCode == this.stateList[i].stateCode) {
          this.hospObj.stateName = this.stateList[i].stateName;
          break;
        }
      }

      this.hospObj.districtCode = item.districtCode
      for (var i = 0; i < this.districtList.length; i++) {
        if (this.hospObj.districtCode == this.districtList[i].districtCode) {
          this.hospObj.districtName = this.districtList[i].districtName;
          break;
        }
      }

      // Check if the hospital is already in hospList
      var stat: boolean = false;
      for (const i of this.List) {
        if (i.districtCode == this.hospObj.districtCode) {
          stat = true;
          break;
        }
      }
      if (!stat) {
        this.List.push(this.hospObj);
      }
    }
  }


  onDeSelectAll() {
    // Set substatus to "1" for all items
    this.List.forEach(item => {
      item.substatus = "1";
    });

    // Clear the list
    this.List = [];
  }
  dcId: any;
  setcsmdcstateanddistrict() {
    this.dcId = this.csmDcFormstatendistrict.get('fullname')?.value;
    let stateCode = this.csmDcFormstatendistrict.get('stateCode')?.value;
    if (this.dcId == null || this.dcId == "" || this.dcId == undefined) {
      this.swal("Info", "Please select CSM-DC Name ", 'info');
      return;
    }
    if (stateCode == null || stateCode == "" || stateCode == undefined) {
      this.swal("Info", "Please select State Name", 'info');
      return;
    }
    if (this.List.length == 0) {
      this.swal("Info", "Please select District Name", 'info');
      return;
    }
    console.log(this.List);
    let object = {
      csmdcId: this.dcId,
      stateCode: stateCode,
      list: this.List,
      userId: this.user.userId
    }
    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Save This Data!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Submit It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dcService.savecsmdcstateanddistrict(object).subscribe((response: any) => {
          if (response.status == 200) {
            Swal.fire({
              title: "Success",
              text: "CMS-DC Successfully Mapped",
              icon: "success"
            });
            this.onReset();
          } else {
            Swal.fire({
              title: "Error",
              text: "Something Went Wrong",
              icon: "error"
            });
          }
        });
      }
    });
  }

  onReset() {
    this.selectedItems = [];
    this.List = [];
    if (this.csmDcFormstatendistrict) {
      this.csmDcFormstatendistrict.reset();
      $('#districtcode').val('');
      $('#stateId').val('');
    }
    window.location.reload();
  }


  remove(item: any) {
    // Remove item from the List
    const index = this.List.findIndex(i => i.districtCode === item.districtCode);
    if (index !== -1) {
      this.List.splice(index, 1);  // Remove the item from the List
    }
    // Remove the item from the selectedItems array (for multi-select dropdown sync)
    this.selectedItems = this.selectedItems.filter(i => i.districtCode !== item.districtCode);
  }
  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  listbyid: any = [];
  getdetailsbyid(csmdcid: any) {
    let userid = this.user.userId;
    this.dcService.getdetailsbyid(csmdcid, userid, this.csmdcId.statecode).subscribe((response: any) => {
      if (response.status == 'success') {
        let details = JSON.parse(response.details);
        this.listbyid = details.data;
        this.csmDcFormstatendistrict.controls['fullname'].setValue(this.csmdcId.csmdcId);
        this.csmDcFormstatendistrict.controls['stateCode'].setValue(this.csmdcId.statecode);
        let statecode = this.csmDcFormstatendistrict.controls['stateCode'].value;
        this.OnChangeState(statecode.toString());
        const filteredData = details.data.filter((item: any) => item.status === '1');
        this.List = filteredData.map((item: any) => ({
          stateCode: item.statecode || "",
          stateName: item.statename || "",
          districtCode: item.districtcode || "",
          districtName: item.districtname || ""
        }));
      }
    })
  }
}
