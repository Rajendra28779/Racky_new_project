import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { CreategroupserviceService } from '../Services/creategroupservice.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  groupName:any;
  parentGroupId:any;
  cardReversalBeanList:any=[];
  isUpdateBtnInVisible: boolean =true;

  inputGroupName:any="";
  public submitted=false;
  form:FormGroup;
  selectParentGroup:any;
  id:any;

  // GroupDetails = new  GroupDetails();
  items = [
    {groupName: 'groupA', value: 'Value 1'},
    {groupName: 'groupA', value: 'Value 2'},
    {groupName: 'groupA', value: 'Value 3'},
  ];
  subgroupedChoices: string[] =['Yes','No'];
  groupDetails:any
  namePattern = "[a-zA-Z ]*";


  constructor(public headerService:HeaderService,public fb: FormBuilder,
    private creategroupservice:CreategroupserviceService,private router: Router) { }

  ngOnInit() {
this.getgroupList();
    this.form = new FormGroup({
      inputGroupName: new FormControl(null, [Validators.required,Validators.pattern(this.namePattern)]),
      selectParentGroup:new FormControl(null, [Validators.required]),
      check:new FormControl(null, [Validators.required])
    })

  }

    // selectionOption($event: { target: { value: string; }; }){
    //   const selectionValue = parseInt($event.target.value);
    //   if(selectionValue === 1){
    //     $('.mb-xl-3').show();
    //   }else{
    //     $('.mb-xl-3').hide();
    //   }
    // }
    isSubgrouped:any;
    yes($event: any) {
      this.isSubgrouped=1;
      this.choice = $event.target.value;
      var group = $('.mb-xl-3').show();
    }

    no($event: any) {
      this.isSubgrouped=0;
      this.choice = $event.target.value;
      var group = $('.mb-xl-3').hide();
    }



    get f() {
      return this.form.controls;
    }


   savegroup() {
  // this.submitted=true;
  var groupName =$('#inputGroupName').val();
  // var isSubgrouped=$('#yes').val();
  // var isgroup=$('#no').val();
  // alert(this.isSubgrouped);
  var parentGroupId =$('#selectParentGroup').val();
  this.id = $('#yes')


if(this.form.get('inputGroupName').valid && this.id!=""){
  this.creategroupservice.getsaveForGroup(groupName,this.isSubgrouped,parentGroupId).subscribe(data=>{
      console.log(data);
      this.form.reset();
      $('#selectParentGroup').html("");

      Swal.fire("","Submit Successfull !!","success")

      });
    }



    else{
      if(!(this.form.get('inputGroupName').valid)){
      Swal.fire("","Enter valid group Name !!","info")

      }
     else if(!(this.form.get('selectParentGroup').valid)){
        Swal.fire("","Enter parent group Name !!","info")

        }
    }

setTimeout(() => {
  window.location.reload()
}, 2000);

    // this.router.navigate(['/application/creategroup'])
    // Page title dispaly
    this.headerService.setTitle('Create Group');

    // utility show
    this.headerService.isIndicate(false);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(true);
    this.refresh();
  }
Reset(){

}
  // getResponseFromUtil(parentData: any) {
  //   this.childmessage = parentData;
  // }

  getgroupList() {
    this.creategroupservice.getgroupdata().subscribe(data=>{
      // console.log("Comming----->>")
      this.cardReversalBeanList = data;
    })

  }
UserGroup={
  groupName:"",
  parentGroupId:"",
  GroupId:"",
  isSubgrouped:""
}
  edit(item:any){

    console.log(item)
    this.UserGroup=item;
    console.log(this.UserGroup);
    this.isUpdateBtnInVisible=false;


  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }


updategroup(item:any){
  this.UserGroup = item;
  // alert(this.UserGroup);
this.UserGroup.isSubgrouped=this.isSubgrouped;
// alert(this.UserGroup.isSubgrouped);
this.creategroupservice.groupupdate(this.UserGroup).subscribe((data:any)=>{
  console.log(data)

  window.location.reload();

})

}
delete(item:any){
  this.creategroupservice.groupdelete(item).subscribe((data:any)=>{
    console.log(data)
    this. getgroupList();

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