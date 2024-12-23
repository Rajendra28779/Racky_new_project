import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';

@Component({
  selector: 'app-hospital-deactivation-process',
  templateUrl: './hospital-deactivation-process.component.html',
  styleUrls: ['./hospital-deactivation-process.component.scss']
})
export class HospitalDeactivationProcessComponent implements OnInit {
  stateList: any = [];
  hospitalList: any = [];
  districtList: any = [];
  stateCode: any="";
  distCode: any="";
  hosObj: any;
  selectedHosList: any = [];
  hosPlaceHolder: "Select Hospital";
  @ViewChild('multiSelect') multiSelect;
  public settingHospital: IDropdownSettings = {};
  selectedHospital: any = [];
  user:any;
  maxChars:any=500;
  fileToUpload:any='';
  adddoc1:any='';
  adddoc2:any='';
  status:any='';
  keyword2 = "hospitalName";
  hospital:any;
  showdetails:any=false;
  hosp:any;
  updatestatus:any=false;

  actiondata:any=[
    {
      id: 1,
      name: "Suspend",
      note: 'TMS Blocking Will be Blocked and CMS will Active.'
    },
    {
      id: 2,
      name: "De-Empanel",
      note: 'Both TMS and CMS Login will be Blocked.'
    }
  ]

  constructor(
    public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private qcadminServices: QcadminServicesService,
    private sessionService: SessionStorageService,
    private route:Router
  ) {
    this.hosp = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle("Hospital De-Empanel");
    this.user =  this.sessionService.decryptSessionData("user");
    if(this.hosp){
      console.log(this.hosp);
      this.stateCode=this.hosp.stateCode;
      this. onChangeState(this.stateCode);
      this.distCode=this.hosp.distCode;
      this. onChangeDistrict(this.distCode);
      this.hospitalId = this.hosp.hospitalCode;
      this.hospitalname = this.hosp.hospitalName;
      this.gethospitaldetails();
      this.updatestatus=true;
    }
    this.getStateList();
  }
  Reset() {
    window.location.reload();
  }

  getStateList() {
    this.stateList = [];
    this.districtList = [];
    this.hospitalList = [];
    this.snoService.getStateList().subscribe(
      (response: any) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    );
  }


  onChangeState(id) {
    this.stateCode = id;
    this.districtList = [];
    this.hospitalList = [];
    this.selectedHospital = [];
    this.showdetails=false;
    $('#districtId').val("");
    this.distCode="";
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response: any) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    );
  }

  onChangeDistrict(id) {
    this.distCode = id;
    this.hospitalList = [];
    this.selectedHospital = [];
    this.showdetails=false;
    this.snoService.getHospitalbyDistrictId(id, this.stateCode).subscribe(
      (response: any) => {
        this.hospitalList = response;
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
    for (const element of this.selectedHosList) {
      if (item.hospitalCode == element.hospitalCode) {
        let index = this.selectedHosList.indexOf(element);
        if (index !== -1) {
          this.selectedHosList.splice(index, 1);
        }
      }
    }
  }
  onSelectAllHos(list) {
    for (const element of list) {
      let item = element;
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

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  handleFileInput(event:any,no:any){
    let file = event.target.files[0];
    if (file != null || file != undefined) {
      let extension = file.name.split('.').pop();
      let allowedExtensions = /^(pdf|jpg|jpeg)$/i;
      if (!allowedExtensions.exec(extension)){
        this.swal("Warning", "Only .pdf, .jpg, .jpeg File Are Allowed!","warning");
        if(no==1){
          $('#document').val('');
        }else if(no==2){
          $('#document1').val('');
        }else if(no==3){
          $('#document2').val('');
        }
        return;
      }
      if (Math.round(file.size / 1024) >= 5120) {
        this.swal('Warning', ' Please Provide Document Size Less than 5MB', 'warning');
        if(no==1){
          $('#document').val('');
        }else if(no==2){
          $('#document1').val('');
        }else if(no==3){
          $('#document2').val('');
        }
        return;
      } else {
        if(no==1){
          this.fileToUpload = event.target.files[0];
        }else if(no==2){
          this.adddoc1 = event.target.files[0];
        }else if(no==3){
          this.adddoc2 = event.target.files[0];
        }else{
          this.swal('Warning', ' Please Try Again with Referesh the Page', 'warning');
        }
      }
    }
  }

  submit(){
    if(this.hospitalId==null || this.hospitalId==undefined || this.hospitalId==''){
      this.swal('Info', 'Please Select HospitalName', 'info');
      return;
    }
    this.status=$('#action').val();
    if(this.status==null || this.status==undefined || this.status==''){
      this.swal('Info', 'Please Select Action Type', 'info');
      return;
    }
    let remark=$('#remark').val().toString();
    if(remark==null || remark==undefined || remark==''){
      this.swal('Info', 'Please Fill Remark', 'info');
      return;
    }

    if( this.fileToUpload==null || this.fileToUpload==undefined || this.fileToUpload==''){
      this.swal('Info', 'Please Upload Document', 'info');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Save this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData: FormData = new FormData();
        // formData.append('hospitalCode', JSON.stringify(this.selectedHosList)) ;
        formData.append('hospitalCode', this.hospitalId) ;
        formData.append('file', this.fileToUpload) ;
        formData.append('adddoc1', this.adddoc1) ;
        formData.append('adddoc2', this.adddoc2) ;
        formData.append('remark', remark) ;
        formData.append('action', this.status) ;
        formData.append('actionBy', this.user.userId) ;

      this.qcadminServices.saveHospitalDeactivation(formData).subscribe(
        (response: any) => {
          if(response.status == 200){
            this.swal('Success', 'Action taken Successfully', 'success');
            this.showdetails=false;
            this.route.navigate(['/application/hospitaldeactivationprocessview']);
          }else {
            this.swal('Error', 'Something Went Wrong', 'error');
          }
        });
      }
    });
  }

  viewdoc(no:any){
    let filedoc:any="";
    if(no==1){
      filedoc=this.fileToUpload;
    }else if(no==2){
      filedoc=this.adddoc1;
    }else if(no==3){
      filedoc=this.adddoc2;
    }
    if (filedoc !="") {
      const file: File | null = filedoc;
      if (file) {
        let documentType = file.type;
        const blob = new Blob([file], { type: documentType });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    } else {
      this.swal('Info', 'Please Select File', 'info');
    }
  }

  hospitalId:any='';
  hospitalname:any='';
  selectEvent2(item) {
    this.hospitalId = item.hospitalCode;
    this.hospitalname = item.hospitalName;
    this.gethospitaldetails();
  }

  clearEvent2() {
    this.hospitalId = '';
    this.hospitalname = '';
    this.showdetails=false;
  }

  gethospitaldetails(){
    this.hospital='';
    this.qcadminServices.getHospitalDetailsfordeactive(this.hospitalId).subscribe(
      (response: any) => {
        if(response.status == 200){
          this.hospital = response;
            for(let element of this.actiondata){
              if(element.id==this.hospital.empanelDesc){
                this.hospital.empanelDesc=element.note;
                if(!this.updatestatus){
                  let index = this.actiondata.indexOf(element);
                  if (index !== -1) {
                    this.actiondata.splice(index, 1);
                  }
                }
              }
            }
          this.showdetails=true;
        }else {
          this.swal('Error', 'Something Went Wrong', 'error');
        }
      });
  }

  note:any='';
  onaction(id){
    this.note='';
    for(let element of this.actiondata){
      if(element.id==id){
        this.note=element.note;
      }
    }
  }

  Update(){
    if(this.hospitalId==null || this.hospitalId==undefined || this.hospitalId==''){
      this.swal('Info', 'Please Select HospitalName', 'info');
      return;
    }
    this.status=0;
    let remark=$('#remark').val().toString();
    if(remark==null || remark==undefined || remark==''){
      this.swal('Info', 'Please Fill Remark', 'info');
      return;
    }

    // if( this.fileToUpload==null || this.fileToUpload==undefined || this.fileToUpload==''){
    //   this.swal('Info', 'Please Upload Document', 'info');
    //   return;
    // }

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Save this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData: FormData = new FormData();
        formData.append('hospitalCode', this.hospitalId) ;
        formData.append('file', this.fileToUpload) ;
        formData.append('adddoc1', this.adddoc1) ;
        formData.append('adddoc2', this.adddoc2) ;
        formData.append('remark', remark) ;
        formData.append('action', this.status) ;
        formData.append('actionBy', this.user.userId) ;

      this.qcadminServices.saveHospitalDeactivation(formData).subscribe(
        (response: any) => {
          if(response.status == 200){
            this.swal('Success', 'Action taken Successfully', 'success');
            this.showdetails=false;
            this.route.navigate(['/application/hospitaldeactivationprocessview']);
          }else {
            this.swal('Error', 'Something Went Wrong', 'error');
          }
        });
      }
    });
  }

  Cancel(){
    this.route.navigate(['/application/hospitaldeactivationprocessview']);
  }

  showPreDoc1(text, index) {
    $('#proceduredescription' + index).text(text);
    $('#showMoreId6' + index).empty()
    $('#showMoreId7' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePreDoc1(text, index) {
    if (text.length > 30) {
      $('#proceduredescription' + index).text(text.substring(0, 30) + '...');
      $('#showMoreId7' + index).empty()
      $('#showMoreId6' + index).empty();
      $('#showMoreId6' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  downlordeempaneldoc(event:any,docpath:any){
    if (docpath != null && docpath != '' && docpath != undefined) {
      let img = this.qcadminServices.downlordeempaneldoc(docpath);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }
  }

}
