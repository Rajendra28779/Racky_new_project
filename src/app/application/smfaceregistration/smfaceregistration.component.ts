import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { SwastyaMitraHospitalService } from '../Services/swastya-mitra-hospital.service';
import { HeaderService } from '../header.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-smfaceregistration',
  templateUrl: './smfaceregistration.component.html',
  styleUrls: ['./smfaceregistration.component.scss']
})
export class SmfaceregistrationComponent implements OnInit {

  user: any;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  public smList: any = [];
  public list: any = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  placeHolder = "Select Hospital";
  placeHolder1 = "Select SwasthyaMitra";
  hospList: any = [];
  hospObj: any;
  swasmList: any = [];
  smObj: any;
  state: any;
  dist: any;
  showPegi: any = false;
  currentPage: any
  pageElement: any
  totalcount: any;
  txtsearchDate: any

  constructor(public headerService: HeaderService, public swastyaMitraHospitalService: SwastyaMitraHospitalService, private snoService: SnocreateserviceService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Swasthya Mitra Face Re-registration");
    this.user = this.sessionService.decryptSessionData("user");
    // this.getStateList();
    this.OnChangeState(21);

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'hospitalCode',
      textField: 'hospitalName',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'userId',
      textField: 'fullname',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getsmlist() {
    let hospital = this.hosplisttostring(this.hospList);
    this.swastyaMitraHospitalService.getsmlistbyhospital(hospital).subscribe((data: any) => {
      this.smList = data;
    }, (error) => console.log(error)
    );
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
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }


  OnChangeDistrict(id) {
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  reset() {
    window.location.reload();
  }

  onItemSelect1(item) {
    this.smObj = {
      smid: "",
      smname: ""
    }
    this.smObj.smid = item.userId;
    for (var i = 0; i < this.swasmList.length; i++) {
      if (this.smObj.smid == this.swasmList[i].smid) {
        this.smObj.smname = this.hospitalList[i].fullname;
      }
    }
    var stat: boolean = false;
    for (const i of this.swasmList) {
      if (i.smid == this.swasmList.smid) {
        stat = true;
      }
    }
    if (stat == false) {
      this.swasmList.push(this.smObj);
    }
  }

  onSelectAll1(list) {
    for (var x = 0; x < list.length; x++) {
      let item = list[x];
      this.smObj = {
        smid: "",
        smname: ""
      }
      this.smObj.smid = item.userId;
      for (var i = 0; i < this.swasmList.length; i++) {
        if (this.smObj.smid == this.swasmList[i].smid) {
          this.smObj.smname = this.hospitalList[i].fullname;
        }
      }
      var stat: boolean = false;
      for (const i of this.swasmList) {
        if (i.smid == this.swasmList.smid) {
          stat = true;
        }
      }
      if (stat == false) {
        this.swasmList.push(this.smObj);
      }
    }
  }

  onItemDeSelect1(item) {
    for (var i = 0; i < this.swasmList.length; i++) {
      if (item.userId == this.swasmList[i].smid) {
        var index = this.swasmList.indexOf(this.swasmList[i]);
        if (index !== -1) {
          this.swasmList.splice(index, 1);
        }
      }
    }
  }

  onDeSelectAll1(list) {
    this.swasmList = [];
  }

  onItemSelect(item) {
    this.hospObj = {
      hospitalCode: "",
      hospitalName: ""
    }
    this.hospObj.hospitalCode = item.hospitalCode;
    for (var i = 0; i < this.hospitalList.length; i++) {
      if (this.hospObj.hospitalCode == this.hospitalList[i].hospitalCode) {
        this.hospObj.hospitalName = this.hospitalList[i].hospitalName;
      }
    }
    var stat: boolean = false;
    for (const i of this.hospList) {
      if (i.hospitalCode == this.hospObj.hospitalCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.hospList.push(this.hospObj);
    }
    this.getsmlist();
  }

  onSelectAll(list) {
    for (var x = 0; x < list.length; x++) {
      let item = list[x];
      this.hospObj = {
        hospitalCode: "",
        hospitalName: ""
      }
      this.hospObj.hospitalCode = item.hospitalCode;
      for (var i = 0; i < this.hospitalList.length; i++) {
        if (this.hospObj.hospitalCode == this.hospitalList[i].hospitalCode) {
          this.hospObj.hospitalName = this.hospitalList[i].hospitalName;
        }
      }
      var stat: boolean = false;
      for (const i of this.hospList) {
        if (i.hospitalCode == this.hospObj.hospitalCode) {
          stat = true;
        }
      }
      if (stat == false) {
        this.hospList.push(this.hospObj);
      }
    }
    this.getsmlist();
  }

  onItemDeSelect(item) {
    for (var i = 0; i < this.hospList.length; i++) {
      if (item.hospitalCode == this.hospList[i].hospitalCode) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
    if (this.hospList.length > 0) {
      this.getsmlist();
    } else {
      this.smList = [];
    }
  }

  onDeSelectAll(list) {
    this.hospList = [];
    this.smList = [];
  }

  hosplisttostring(hospList: any = []) {
    let hospital = "";
    if (hospList.length == 0) {
      hospital = "";
    } else {
      for (let i = 0; i < hospList.length; i++) {
        hospital = hospital + hospList[i].hospitalCode + ","
      }
    }
    return hospital;
  }
  smlisttostring(smlist: any = []) {
    let sm = "";
    if (smlist.length == 0) {
      sm = "";
    } else {
      for (let i = 0; i < smlist.length; i++) {
        sm = sm + smlist[i].smid + ","
      }
    }
    return sm;
  }


  Search() {
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    if (this.state == null || this.state == "" || this.state == undefined) {
      this.swal("Info", "Please select State Name", 'info');
      return;
    }
    if (this.dist == null || this.dist == "" || this.dist == undefined) {
      this.swal("Info", "Please select Dist Name", 'info');
      return;
    }
    if (this.hospList.length == 0) {
      this.swal("Info", "Please select atlest one hospital ", 'info');
      return;
    }
    let hospital = this.hosplisttostring(this.hospList)
    let smid = this.smlisttostring(this.swasmList)
    this.swastyaMitraHospitalService.getsmlistforregistaration(this.state, this.dist, hospital, smid).subscribe((data: any) => {
      this.list = data;
      this.totalcount = this.list.length
      if (this.totalcount > 0) {
        this.showPegi = true;
        this.currentPage = 1
        this.pageElement = 100
      } else {
        this.showPegi = false;
      }
    }, (error) => console.log(error)
    );
  }
  closemodal() {
    $('#swasmodal').hide();
  }

  smdetails: any;
  smhosplist: any[];
  onaction(item: any) {
    this.swastyaMitraHospitalService.getsmdetailsforregister(item).subscribe((data: any) => {
      this.smdetails = data;
      if (this.smdetails.status == 200) {
        this.smhosplist = this.smdetails.hospital;
        $('#swasmodal').show();
      } else {
        this.swal("Error", "Something went Wrong", "error")
      }
    }, (error) => console.log(error)
    );
  }

  allowforregister(item: any) {
    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Allow For Re-registration!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Allow It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.swastyaMitraHospitalService.allowforregister(item, this.user.userId).subscribe((data: any) => {
          if (data.status == 200) {
            $('#swasmodal').hide();
            this.swal("Success", "Successfully Allowed For Re-Registration", 'success');
            this.Search();
          } else {
            this.swal("Error", "Something went wrong", 'error');
          }
        }, (error) => console.log(error)
        );
      }
    });
  }
  report: any = [];
  sno: any = {
    Slno: "",
    smid: "",
    name: "",
    mobile: "",
    email: "",
    date: "",
  };
  heading = [['Sl#', 'District Code', 'SwasthyMitra Name', 'Contact No', 'EmailId', 'Registration Date']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.smid = sna.username;
      this.sno.name = sna.fullname;
      this.sno.mobile = sna.mobile;
      this.sno.email = sna.emailid;
      this.sno.date = sna.regdate;
      this.report.push(this.sno);
    }
    let distname = "All";
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.dist) {
        distname = this.districtList[i].districtname;
      }
    }
    if (no == 1) {
      let filter = [];
      filter.push([['State Name', "Odisha"]]);
      filter.push([['District Name', distname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Swasthya Mitra Face Re-registration',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      // doc.text(" ", 5, 5);
      doc.text("Swasthya Mitra Face Re-registration", 50, 15);
      doc.setFontSize(12);
      doc.text('State Name :- ' + "Odisha", 8, 25);
      doc.text('District Name :- ' + distname, 110, 25);
      doc.text('GeneratedOn :- ' + generatedOn, 8, 33);
      doc.text('GeneratedBy :- ' + generatedBy, 110, 33);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.smid;
        pdf[2] = clm.name;
        pdf[3] = clm.mobile;
        pdf[4] = clm.email;
        pdf[5] = clm.date;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Swasthya Mitra Face Re-registration.pdf');
    }
  }



}
