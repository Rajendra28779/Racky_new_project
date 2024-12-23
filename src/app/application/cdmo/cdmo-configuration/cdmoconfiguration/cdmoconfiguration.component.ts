import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { Router } from '@angular/router';

import { CDMOconfigurationServiceService } from 'src/app/application/Services/cdmoconfiguration-service.service';

import { HeaderService } from 'src/app/application/header.service';

import { SnocreateserviceService } from 'src/app/application/Services/snocreateservice.service';

import { analyzeAndValidateNgModules } from '@angular/compiler';
import { SessionStorageService } from 'src/app/services/session-storage.service';

declare var $: any;



@Component({

  selector: 'app-cdmoconfiguration',

  templateUrl: './cdmoconfiguration.component.html',

  styleUrls: ['./cdmoconfiguration.component.scss']

})

export class CDMOConfigurationComponent implements OnInit {

  pageName: string = "CDMO Mapping";

  placeHolder = "Select Hospital";

  public dcList: any = [];

  public stateList: any = [];

  public districtList: any = [];

  public hospitalList: any = [];

  @ViewChild('multiSelect') multiSelect;

  @ViewChild('auto') auto;

  public submitted = false;

  isUpdateBtnInVisible: boolean;

  user: any;

  form: FormGroup;

  public settingDistrict = {};

  //public settingHospital = {};

  public settingHospital: any;

  dcId: any;

  isEditBtn: boolean;

  updatelist: any;

  sid: any;

  did: any;

  datas: any

  hospitalArray: any;

  hosp: any;

  selectedItems: any = [];

  dcUserId: any;

  keyword: any = 'fullName';

  hospObj: any;

  hospList: any = [];

  dcService: any;

  state :any;

  district :any;

  id: any;

  status: any;

  cdmoUserId: any;

  dist: any="";

  statecode: any="";

  constructor(public fb: FormBuilder, private cdmoService: CDMOconfigurationServiceService,private sessionService: SessionStorageService,

    private snoService: SnocreateserviceService, public headerService: HeaderService, private route: Router) {

      this.dcId = this.route.getCurrentNavigation().extras.state;

    }



  ngOnInit(): void {

    this.getCDMOList();

    this.getStateList();

    // this.user = JSON.parse(sessionStorage.getItem("user"))
    this.user = this.sessionService.decryptSessionData("user");

    this.form = this.fb.group({



      dcId: new FormControl(''),

      cdmoUserId: new FormControl(''),

      stateCode: new FormControl(''),

      districtCode: new FormControl(''),

      // hospitalCode: new FormControl(null, []),

      // hospList: new FormControl('', []),

      createdBy: new FormControl(this.user.userId),

      updatedBy: new FormControl(this.user.userId),



    })



    this.headerService.setTitle('CDMO Mapping');

    this.isUpdateBtnInVisible = true;

    this.isEditBtn = false;

    if (this.dcId) {


        this.id=this.dcId.id;

        this.status=this.dcId.status;

        this.cdmoUserId=this.dcId.cdmoid;

        this.statecode=this.dcId.state;

        this.dist=this.dcId.dist;

        this.OnChangeState(this.statecode);

        this.isEditBtn = true;

    }



    // this.settingHospital = {

    //   singleSelection: false,

    //   idField: 'hospitalCode',

    //   textField: 'hospitalName',

    //   selectAllText: 'Select All',

    //   unSelectAllText: 'UnSelect All',

    //   itemsShowLimit: 0,

    //   allowSearchFilter: true,

    // };



}



//Rajendra





//Rajendra









// onItemSelect(item) {

//   this.hospObj={

//     stateCode:"",

//     stateName:"",

//     districtCode:"",

//     districtName:"",

//     // hospitalCode:"",

//     // hospitalName:""

//   }

//   this.hospObj.stateCode = $('#stateId').val();

//   for(var i=0;i<this.stateList.length;i++) {

//     if(this.hospObj.stateCode==this.stateList[i].stateCode) {

//       this.hospObj.stateName = this.stateList[i].stateName;

//     }

//   }

//   this.hospObj.districtCode = $('#districtId').val();

//   for(var i=0;i<this.districtList.length;i++) {

//     if(this.hospObj.districtCode==this.districtList[i].districtcode) {

//       this.hospObj.districtName = this.districtList[i].districtname;

//     }

//   }

  // this.hospObj.hospitalCode = item.hospitalCode;

  // for(var i=0;i<this.hospitalList.length;i++) {

  //   if(this.hospObj.hospitalCode==this.hospitalList[i].hospitalCode) {

  //     this.hospObj.hospitalName = this.hospitalList[i].hospName;

  //   }

  // }



  // var stat:boolean = false;

  // for (const i of this.hospList) {

  //   // if(i.hospitalCode==this.hospObj.hospitalCode) {

  //   //   stat=true;

  //   // }

  // }

  // // if(stat==false) {

  // //   this.hospList.push(this.hospObj);

  // // }


//}



// onSelectAll(list) {


//   for(var x=0;x<list.length;x++) {

//     let item = list[x];

//     this.hospObj={

//       stateCode:"",

//       stateName:"",

//       districtCode:"",

//       districtName:"",

//       // hospitalCode:"",

//       // hospitalName:""

//     }

//     this.hospObj.stateCode = $('#stateId').val();

//     for(var i=0;i<this.stateList.length;i++) {

//       if(this.hospObj.stateCode==this.stateList[i].stateCode) {

//         this.hospObj.stateName = this.stateList[i].stateName;

//       }

//     }

//     this.hospObj.districtCode = $('#districtId').val();

//     for(var i=0;i<this.districtList.length;i++) {

//       if(this.hospObj.districtCode==this.districtList[i].districtcode) {

//         this.hospObj.districtName = this.districtList[i].districtname;

//       }

//     }

//     // this.hospObj.hospitalCode = item.hospitalCode;

//     // for(var i=0;i<this.hospitalList.length;i++) {

//     //   if(this.hospObj.hospitalCode==this.hospitalList[i].hospitalCode) {

//     //     this.hospObj.hospitalName = this.hospitalList[i].hospName;

//     //   }

//     // }



//     // var stat:boolean = false;

//     // for (const i of this.hospList) {

//     //   if(i.hospitalCode==this.hospObj.hospitalCode) {

//     //     stat=true;

//     //   }

//     // }

//     // if(stat==false) {

//     //   this.hospList.push(this.hospObj);

//     // }

//   }

// }



// onItemDeSelect(item) {

//   for(var i=0;i<this.hospList.length;i++) {

//     if(item.hospitalCode==this.hospList[i].hospitalCode) {

//       var index = this.hospList.indexOf(this.hospList[i]);

//       if (index !== -1) {

//         this.hospList.splice(index, 1);

//       }

//     }

//   }

// }



// onDeSelectAll(list) {

//   //this.onDeSelectAll.emit(this.emittedValue(this.selectedItems));


//   for(var x=0;x<list.length;x++) {

//     let item = list[x];

//     for(var i=0;i<this.hospList.length;i++) {

//       if(item.hospitalCode==this.hospList[i].hospitalCode) {

//         var index = this.hospList.indexOf(this.hospList[i]);

//         if (index !== -1) {

//           this.hospList.splice(index, 1);

//         }

//       }

//     }

//   }

// }



// remove(item) {

//   for(var i=0;i<this.hospList.length;i++) {

//     if(item.hospitalCode==this.hospList[i].hospitalCode) {

//       var index = this.hospList.indexOf(this.hospList[i]);

//       if (index !== -1) {

//         this.hospList.splice(index, 1);

//       }

//     }



//   }

// }

get f() {

  return this.form.controls;

}



getCDMOList() {

  this.cdmoService.getCDMODetails().subscribe(

    (response) => {

      this.dcList = response;


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



OnChangeState(id) {

  $("#districtId").val("");

  this.selectedItems = [];

  localStorage.setItem("stateCode", id);

  this.snoService.getDistrictListByStateId(id).subscribe(

    (response) => {

      this.districtList = response;


    },

    (error) => console.log(error)

  )

}





// OnChangeDistrict(id) {

//   this.selectedItems = [];

//   var stateCode = localStorage.getItem("stateCode");

//   this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(

//     (response) => {



//       this.hospitalList = response;


//     },


//   )

// }



selectEvent(item) {

  // do something with selected item

 //alert("user:" + JSON.stringify(item ))

  this.dcUserId = JSON.stringify(item.userId);

 // this.dcUName = item.userId;

}



clearEvent() {

  this.dcUserId = '';

}



setCDMOConfiguration() {

  this.submitted = true;

  let dcId = this.dcUserId;

  this.state =  $('#stateId').val()

  this.district = $('#districtId').val()

  this.form.value


  if (dcId == null || dcId == "" || dcId == undefined) {

    this.swal("Info", "Please select CDMO Name", 'info');

    return;

  }

  if (this.state == null || this.state == "" || this.state == undefined) {

    this.swal("Info", "Please select State Name", 'info');

    return;

  }

  if (this.district == null || this.district == "" || this.district == undefined) {

    this.swal("Info", "Please select District Name", 'info');

    return;

  }



  this.form.value.dcId = JSON.stringify(dcId);

  this.form.value.cdmoId = this.dcUserId;

  this.form.value.stateCode = this.state

  this.form.value.districtCode =  this.district

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


      this.cdmoService.saveCDMOConfiguration(this.form.value).subscribe(data => {

        if (data.status == "Success") {

          this.swal("Success", data.message, "success");


          this.route.navigate(['/application/cdmoConfigurationview']);

        } else if (data.status == "Failed") {

          this.swal("Info", data.message, "info");

        }

      })

    }

  });



}



swal(title, text, icon) {

  Swal.fire({

    icon: icon,

    title: title,

    text: text

  });

}

yes($event: any) {

  this.status = 0;

}



no($event: any) {

  this.status = 1;

}



data1:any;

updateDcDetails() {





  let object={

    cdmoMappingId:this.id,

    cdmoId:this.cdmoUserId,

    stateCode: this.statecode,

    districtCode:this.dist,

    status:this.status,

    updatedBy:this.user.userId

  }






  Swal.fire({

    title: 'Are You Sure?',

    text: "You Want To Update This Data!",

    icon: 'question',

    showCancelButton: true,

    confirmButtonColor: '#3085d6',

    cancelButtonColor: '#d33',

    confirmButtonText: 'Yes,Update It!'

  }).then((result) => {

    if (result.isConfirmed) {



      this.cdmoService.updateDCConfiguration(object).subscribe(data => {

        this.data1=data;





        if (this.data1.status == "Success") {

          this.swal("Success", "Record Updated Successfully", "success");

          this.form.reset();

          this.route.navigate(['/application/cdmoConfigurationview']);

          this.submitted = false;

        } else if (this.data1.status == "Failed") {

          this.swal("Info", this.data1.message, "info");

        }

      })

    }

  })

}



onReset() {

  this.auto.clear();

  $("#stateId").val("");

  this.OnChangeState("");

  $("#districtId").val("");

  // this.OnChangeDistrict("");

}



cancel() {

  this.route.navigate(['/application/cdmoConfigurationview']);

}



getDCByIds(id) {

  this.dcService.getDcById(id).subscribe(data => {

    this.updatelist = data;


    this.isUpdateBtnInVisible = false;

    this.isEditBtn = true;

    this.dcUserId = this.updatelist.dcId;

    this.form.controls['dcName'].setValue(this.updatelist.dcName);

    this.hospList = this.updatelist.hospList;


  });

}

}
