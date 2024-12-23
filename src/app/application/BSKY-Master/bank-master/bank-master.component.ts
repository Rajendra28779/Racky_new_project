import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BankMasterServiceService } from '../../Services/bank-master-service.service';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-bank-master',
  templateUrl: './bank-master.component.html',
  styleUrls: ['./bank-master.component.scss']
})
export class BankMasterComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;


  public taggedList: any = [];
  status: any;
  BankMaster!: FormGroup;
  user1: any;
  item: any;
  isSaveData: boolean = true;
  isUpdateData: boolean = false;
  submitted: boolean = false;

  updateBank = {
    bankId: "",
    bankName: "",
    createdBy: "",
    createdOn: "",
    statusFlag: 0,
    updatedBy: "",
    updatedOn: ""

  };
  bankUpdate: any;
  statusFlag: number;
  data: any;


  constructor(private bankMasterServiceService: BankMasterServiceService, public formBuilder: FormBuilder, private active: ActivatedRoute, private route: Router, private headerService: HeaderService,
    private sessionService: SessionStorageService) {
    this.item = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle("Add Bank Master");
    this.user1 = this.sessionService.decryptSessionData("user");
    this.BankMaster = this.formBuilder.group({
      typeId: new FormControl(''),
      bankName: new FormControl(''),
      createdBy: new FormControl('')
    });


    if (this.item) {
      this.isSaveData = false;
      this.isUpdateData = true;
      this.bankMasterServiceService.getbyId(this.item.bankId).subscribe(
        (result: any) => {
          this.bankUpdate = result;
          this.updateBank.bankName = this.bankUpdate.bankName;

          this.statusFlag = this.bankUpdate.statusFlag;

          // this.statusFlag = this.bankUpdate.statusflag;(original)



          this.isSaveData = false;
          this.isUpdateData = true;
        }

      )
    }
  }


  selectEvent(item) {
    // do something with selected item
    // this.authTaggingId = item.hospitalAuthTagging.tagHospitalCode;
    // this.bskyUserId = item.bskyUserId;
  }
  onReset1() {
    // this.authTaggingId="";
    // this.date="";
  }
  save() {
    let bankName = $("#bankName").val().toString();
    if (bankName == null || bankName == "" || bankName == undefined) {
      $("#bankName").focus();
      this.swal("Info", "Please Enter BankName", 'info');
      return;
    }
    // this.form.value.createdBy = this.user1.userId;
    Swal.fire({
      title: 'Are you sure want to save?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          bankName: bankName,
          createdBy: this.user1.userId.toString(),
        }
        this.bankMasterServiceService.saveBankMasterDate(object).subscribe(
          (result: any) => {
            this.data = result;
            if (this.data.status == "Success") {
              Swal.fire("Success", "Unprocess Saved Successfully!!", "success")
              this.route.navigate(['application/viewbankmaster']);
              this.submitted = false;
            } else if (this.data.status == "Failed") {
              this.swal('Success', this.data.message, 'error')
            } else {
              this.swal("Error", "Something went wrong", 'error');
            }
          },
          (err: any) => {

            console.log(err);
          }
        )
      }
    });
  }

  update(items: any) {
    let bankName = $("#bankName").val().toString();
    if (bankName == null || bankName == "" || bankName == undefined) {
      $("#bankName").focus();
      this.swal("Info", "Please Enter BankName", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure want to update ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateBank.updatedBy = this.user1.userId;
        this.updateBank.bankId = items.bankId;
        this.updateBank.bankName = bankName;
        this.updateBank.statusFlag = this.statusFlag;
        this.bankMasterServiceService.updateBankMasterData(this.updateBank).subscribe(
          (result: any) => {
            this.data = result;
            if (this.data.status == "Success") {
              this.swal('Success', this.data.message, 'success')
              this.route.navigate(['application/viewbankmaster']);
            } else if (this.data.status == "Failed") {
              this.swal('Success', this.data.message, 'error')
            } else {
              this.swal("Error", "Something went wrong", 'error');
            }
          }
        )
      }
    },
      (err: any) => {
        console.log(err);
        this.swal("some error occur", "Try later", 'error');
      }
    )
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  yes($event: any) {

    this.statusFlag = 0;
  }

  no($event: any) {

    this.statusFlag = 1;
  }
  Reset() {
    window.location.reload();
  }
  cencel1() {
    this.route.navigate(['/application/viewbankmaster']);
  }


}
