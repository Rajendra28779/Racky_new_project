import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../application/header.service';
import { CreategroupservicdeService } from './creategroupservicde.service';


// export class GroupDetails {
//   groupName!:String
// }

@Component({
  selector: 'app-creategroup',
  templateUrl: './creategroup.component.html',
  styleUrls: ['./creategroup.component.scss']
})
export class CreategroupComponent implements OnInit {

  FormObject: any;
  private defaultSelected = 0
  choice!: string;
  childmessage: any;
  selectedValue = "Value 1";
  groupName: any;
  parentGroupId: any;
  cardReversalBeanList: any;
  isUpdateBtnInVisible: boolean = true;

  inputGroupName: any = "";
  public submitted = false;
  form: FormGroup;
  selectParentGroup: true;

  // GroupDetails = new  GroupDetails();
  items = [
    { groupName: 'groupA', value: 'Value 1' },
    { groupName: 'groupA', value: 'Value 2' },
    { groupName: 'groupA', value: 'Value 3' },
  ];
  subgroupedChoices: string[] = ['Yes', 'No'];
  groupDetails: any
  namePattern = "[a-zA-Z ]*";


  constructor(public headerService: HeaderService, public fb: FormBuilder,
    private creategroupservice: CreategroupservicdeService, private router: Router) { }

  ngOnInit() {


    this.form = new FormGroup({
      inputGroupName: new FormControl(null, [Validators.required, Validators.pattern(this.namePattern)]),
      selectParentGroup: new FormControl(null, [Validators.required]),
      check: new FormControl(null)
    })

    this.getgroupListForview();

  }

  // selectionOption($event: { target: { value: string; }; }){
  //   const selectionValue = parseInt($event.target.value);
  //   if(selectionValue === 1){
  //     $('.mb-xl-3').show();
  //   }else{
  //     $('.mb-xl-3').hide();
  //   }
  // }

  yes($event: any) {

    this.choice = $event.target.value;
    var group = $('.mb-xl-3').show();
  }
  no($event: any) {
    this.choice = $event.target.value;
    var group = $('.mb-xl-3').hide();
  }



  get f() {
    return this.form.controls;
  }


  savegroup() {


    this.submitted = true;
    var groupName = $('#inputGroupName').val();
    var isSubgrouped = $('#yes').val();
    var isgroup = $('#no').val();
    var parentGroupId = $('#selectParentGroup').val();
    if (isSubgrouped == 1) {
      this.creategroupservice.getsaveForGroup(groupName, isSubgrouped, parentGroupId).subscribe(data => {
        console.log(data);
      });
    } else if (isgroup == 0) {
      this.creategroupservice.getsaveForGroup(groupName, isSubgrouped, parentGroupId).subscribe(data => {
        console.log(data);
      });
    }



    // Page title dispaly
    this.headerService.setTitle('Create Group');

    // utility show
    this.headerService.isIndicate(false);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(true);
    this.refresh();

    // this.router.navigate(['/application/creategroup'])
  }
  Reset() {

  }
  // getResponseFromUtil(parentData: any) {
  //   this.childmessage = parentData;
  // }

  getgroupListForview() {
    // alert("Hii")
    this.creategroupservice.getgroupdata().subscribe(data => {
      console.log("Comming----->>")
      this.cardReversalBeanList = data;
    })

  }
  UserGroup = {
    groupName: "",
    parentGroupId: "",
    GroupId: "",
    isSubgroup: ""
  }
  edit(item: any) {

    console.log(item)
    this.UserGroup = item;
    console.log(this.UserGroup);
    this.isUpdateBtnInVisible = false;


  }


  updategroup(item: any) {
    this.UserGroup = item;
    // alert(this.UserGroup.parentGroupId);
    // alert(this.UserGroup.isSubgroup);


    console.log(item)
    this.creategroupservice.groupupdate(item).subscribe((data: any) => {
      console.log(data)

      window.location.reload();

    })

  }
  delete(item: any) {
    this.creategroupservice.groupdelete(item).subscribe((data: any) => {
      console.log(data)
      this.getgroupListForview();

    })
  }
  refresh(): void {
    // window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });

  }

}
