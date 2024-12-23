import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';

@Component({
  selector: 'app-temporary-override-code-view',
  templateUrl: './temporary-override-code-view.component.html',
  styleUrls: ['./temporary-override-code-view.component.scss'],
})
export class TemporaryOverrideCodeViewComponent implements OnInit {
  hosPlaceHolder: 'Select Hospital';
  @ViewChild('multiSelect') multiSelect;
  public settingHospital: IDropdownSettings = {};
  selectedHospital: any = [];
  temporaryOverrideList: any = [];
  showPegi: boolean = false;
  pageElement: any = 100;

  constructor(
    public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private qcadminServices: QcadminServicesService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Temporary Override Code View');

    this.settingHospital = {
      singleSelection: false,
      idField: 'hospitalCode',
      textField: 'hospitalName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
    this.getStateList();
  }
  reset() {
    this.temporaryOverrideList = [];
    this.selectedHospital = [];
    $('#stateId').val('');
    $('#districtId').val('');
    this.showPegi = false;
  }
  hospitalList: any = [];
  districtList: any = [];
  stateCode: any;
  stateList: any = [];
  getStateList() {
    this.stateList = [];
    this.districtList = [];
    this.hospitalList = [];
    this.snoService.getStateList().subscribe(
      (response: any) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    );
  }
  onChangeState(id) {
    this.stateCode = id;
    this.districtList = [];
    this.hospitalList = [];
    this.selectedHospital = [];
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response: any) => {
        this.districtList = response;
        console.log(this.districtList);
      },
      (error) => console.log(error)
    );
  }
  distCode: any;
  onChangeDistrict(id) {
    this.distCode = id;
    this.hospitalList = [];
    this.selectedHospital = [];
    this.snoService.getHospitalbyDistrictId(id, this.stateCode).subscribe(
      (response: any) => {
        this.hospitalList = response;
        console.log(this.hospitalList);
      },
      (error) => console.log(error)
    );
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  hosObj: any;
  selectedHosList: any = [];
  onHosSelect(item) {
    this.hosObj = {
      hospitalCode: '',
    };
    this.hosObj.hospitalCode = item.hospitalCode;

    let stat: boolean = false;
    for (const i of this.selectedHosList) {
      if (i.hospitalCode == this.hosObj.hospitalCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.selectedHosList.push(this.hosObj);
    }
  }
  onHosDeSelect(item) {
    for (let i = 0; i < this.selectedHosList.length; i++) {
      if (item.hospitalCode == this.selectedHosList[i].hospitalCode) {
        let index = this.selectedHosList.indexOf(this.selectedHosList[i]);
        if (index !== -1) {
          this.selectedHosList.splice(index, 1);
        }
      }
    }
  }
  onSelectAllHos(list) {
    for (let x = 0; x < list.length; x++) {
      let item = list[x];
      this.hosObj = {
        hospitalCode: '',
      };
      this.hosObj.hospitalCode = item.hospitalCode;
      let stat: boolean = false;
      for (const i of this.selectedHosList) {
        if (i.hospitalCode == this.hosObj.hospitalCode) {
          stat = true;
        }
      }
      if (stat == false) {
        this.selectedHosList.push(this.hosObj);
      }
    }
  }
  onDeSelectAllHos(list) {
    this.selectedHosList = [];
  }
  search() {
    if (
      this.stateCode == null ||
      this.stateCode == undefined ||
      this.stateCode == ''
    ) {
      this.swal('', 'Please Select State', 'info');
      return;
    }
    if (
      this.distCode == null ||
      this.distCode == undefined ||
      this.distCode == ''
    ) {
      this.swal('', 'Please Select District', 'info');
      return;
    }
    if (
      this.selectedHosList == null ||
      this.selectedHosList == undefined ||
      this.selectedHosList == ''
    ) {
      this.swal('', 'Please Select Hospital', 'info');
      return;
    }

    this.selectedHosList.forEach((element) => {
      this.hospitalList.forEach((element1) => {
        if (element.hospitalCode == element1.hospitalCode) {
          element.hospitalId = element1.hospitalId;
        }
      });
    });
    console.log(this.selectedHosList);
    let data = {
      stateCode: this.stateCode,
      distCode: this.distCode,
      hospitalList: this.selectedHosList,
    };
    console.log(data);
    this.qcadminServices
      .viewTemporyOverrideCode(data)
      .subscribe((response: any) => {
        console.log(response);
        if (response.status == 'success') {
          this.temporaryOverrideList = response.data;
          this.showPegi = this.temporaryOverrideList.length > 0;
        } else {
          this.swal('', 'Something went wrong', 'error');
        }
      });
  }
  currentPage: any = 1;
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  removeCode(data) {
    let hosAry = [];
    let hosObj = {
      hospitalCode: data.hospitalCode,
      hospitalId: data.hospitalId,
    };
    hosAry.push(hosObj);
    let reqData = {
      hospitalList: hosAry,
    };
    console.log(data);
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.qcadminServices
          .removeTemporyOverrideCode(reqData)
          .subscribe((response: any) => {
            console.log(response);
            if (response.status == 'success') {
              this.swal('','Inactive Successfully','Success');
              this.search();
            } else {
              this.swal('', 'Something went wrong', 'error');
            }
          });
      }
    });
  }
}
