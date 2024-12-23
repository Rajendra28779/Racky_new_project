import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
declare let $: any;

@Component({
  selector: 'app-temporary-override-code',
  templateUrl: './temporary-override-code.component.html',
  styleUrls: ['./temporary-override-code.component.scss'],
})
export class TemporaryOverrideCodeComponent implements OnInit {
  overrideCode: any;
  hosPlaceHolder: "Select Hospital";
  @ViewChild('multiSelect') multiSelect;
  public settingHospital: IDropdownSettings = {};
  selectedHospital: any = [];

  constructor(
    public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private qcadminServices: QcadminServicesService,
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Temporary Override Code');
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      // endDate: '0d',
      minDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
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
    window.location.reload();
  }
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
  formdate: any;
  todate: any;
  submit() {
    this.formdate = $('#datepicker1').val();
    this.todate = $('#datepicker2').val();
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
    if (
      this.overrideCode == null ||
      this.overrideCode == undefined ||
      this.overrideCode == ''
    ) {
      this.swal('', 'Please Generate Override Code', 'info');
      return;
    }
    if (Date.parse(this.formdate) > Date.parse(this.todate)) {
      this.swal('', 'From Date Should Be Less Than To Date', 'info');
      return;
    }
    this.selectedHosList.forEach(element => {
      this.hospitalList.forEach(element1 => {
          if (element.hospitalCode == element1.hospitalCode) {
            element.hospitalId = element1.hospitalId;
          }
      });
    });
    console.log(this.selectedHosList);
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!',
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          stateCode: this.stateCode,
          distCode: this.distCode,
          // hospitalCode: this.hospitalCode,
          overrideCode: this.overrideCode,
          fromDate: new Date(this.formdate),
          toDate: new Date(this.todate),
          hospitalList: this.selectedHosList,
        };
        console.log(data);
        this.qcadminServices
          .submitTemporyOverrideCode(data)
          .subscribe((response: any) => {
            if (response.status == "success") {
              Swal.fire({
                title: 'success',
                text: 'Data Submitted Successfully!',
                icon: 'success',
              });
              this.ngOnInit();
              $('#stateId').val('');
              this.overrideCode = null;
              this.selectedHospital = [];
            }else if(response.status == "duplicate"){
              Swal.fire({
                title: 'Ingo',
                text: response.message,
                icon: 'info',
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Something Went Wrong',
                icon: 'error',
              });
            }
          });
      }
    });
  }
  hospitalList: any = [];
  districtList: any = [];
  stateCode: any;
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
  hospitalCode: any;
  hospitallId: any;
  onChangeHospital(hospitalCode: any) {
    this.hospitalCode = hospitalCode;
    this.hospitalList.forEach((element) => {
      if (element.hospitalCode == hospitalCode) {
        this.hospitallId = element.hospitalId;
      }
    });
  }
  generateRandomNumber(): void {
    let code = Math.floor(10000 + Math.random() * 90000);
    this.overrideCode = 'H' + code;
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
      hospitalCode: "",
    }
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
        hospitalCode: "",
      }
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
}
