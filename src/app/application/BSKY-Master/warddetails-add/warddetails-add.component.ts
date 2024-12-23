import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WardMasterService } from '../../Services/ward-master.service';
import { WardDetailsMasterService } from '../../Services/ward-details-master.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-warddetails-add',
  templateUrl: './warddetails-add.component.html',
  styleUrls: ['./warddetails-add.component.scss']
})
export class WarddetailsAddComponent implements OnInit {
  Warddetailsfrom: FormGroup;
  isUpdateBtnInVisible: boolean = true;
  wardlist: any;
  currentUser: any;
  childmessage: any;
  Ward: any;
  hospitalCategory: any;
  constructor(public headerService: HeaderService,
    public wardMasterService: WardMasterService,
    public fb: FormBuilder,
    public router: Router,
    public packageDetailsMasterService: PackageDetailsMasterService,
    public wardDetailsMasterService: WardDetailsMasterService,
    private sessionService: SessionStorageService
  ) { }

  updateData = {
    wardMasterId: '',
    wardCode: "",
    hospitalCategoryId: "",
    packWardAmount: ""
  }

  ngOnInit(): void {

    this.headerService.setTitle('Ward Details Master');

    this.currentUser = this.sessionService.decryptSessionData("user");

    this.Warddetailsfrom = this.fb.group({
      wardmasterId: new FormControl(''),
      wardCode: new FormControl(''),
      hospitalCategoryId: new FormControl(''),
      packWardAmount: new FormControl(''),
      createdBy: this.currentUser.userId,
      updatedby: this.currentUser.userId,
    })
    this.getHospitalcategory();
    this.getAllwardCode();
    //   this.updateId = this.activeroute.snapshot.paramMap.get('wardMasterId');
    //  this.getbyWardId();
    //   this.updatebutton = false;
    //   this.submitbutton = true;
    // }

  }
  getAllwardCode() {
    this.wardMasterService.getalldata().subscribe((data: any) => {
      this.wardlist = data;
    })
  }
  SubmitCreate() {
    debugger
    this.wardDetailsMasterService.save(this.Warddetailsfrom.value).subscribe((data: any) => {
      this.Warddetailsfrom = data;
    })
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  selectWardMasterId(id) {
    localStorage.setItem("wardMasterId", id);
    this.wardMasterService.getalldata().subscribe((data: any) => {
      this.wardlist = data;
    })
  }
  getHospitalcategory() {
    this.packageDetailsMasterService.getAllHospitalCategory().subscribe((data: any) => {
      this.hospitalCategory = data;
    })
  }
}
