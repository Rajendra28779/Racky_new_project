import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { CardPolicyService } from '../../Services/card-policy.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-card-policy-update',
  templateUrl: './card-policy-update.component.html',
  styleUrls: ['./card-policy-update.component.scss']
})
export class CardPolicyUpdateComponent implements OnInit {

  months: string;
  year: number;
  cardData: any;
  currentuser: any;
  amount1: any;
  amount2: any;
  startDate1: any;
  year2: string;

  constructor(public headerService: HeaderService,
    private cardPolicyService: CardPolicyService,
    private sessionService: SessionStorageService,
    public route: Router,) { }

  ngOnInit(): void {
    this.headerService.setTitle('Card Policy Update');
    this.currentuser = this.sessionService.decryptSessionData("user");

    this.getCardPolicyDate();

    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth();
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.months + '-' + this.year;

    let date2 = '31'
    let month2 = 'DEC'
    this.year = year + 1
    var scndDay = date2 + '-' + month2 + '-' + this.year;

    //Date input placeholder
    //  $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");

    $('input[name="toDate"]').val(scndDay);
    $('input[name="toDate"]').attr("placeholder", "To Date *");
  }

  getMonthFrom(month) {
    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    return month;
  }

  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  save() {
    let startDate = $('#date1').val().toString().trim();
    let endDate = $('#date2').val().toString().trim();
    let familyAmount = $('#familyAmount').val();
    let femaleAmount = $('#femaleAmount').val();
    if (Date.parse(startDate) > Date.parse(endDate)) {
      this.swal('', ' Start Date should be less End Date', 'error');
      return;
    }
    if (familyAmount == null || familyAmount == '' || familyAmount == 'undefined') {
      $("#familyAmount").focus();
      this.swal("Info", "Please enter familyAmount", 'info');
      return;
    }
    if (femaleAmount == null || femaleAmount == '' || femaleAmount == 'undefined') {
      $("#femaleAmount").focus();
      this.swal("Info", "Please enter femaleAmount", 'info');
      return;
    }
    let requestData = {
      userId: this.currentuser.userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      familyAmount: familyAmount,
      femaleAmount: femaleAmount,
    };
    this.cardPolicyService.updateCardPolicy(requestData)
      .subscribe((data: any) => {
        if (data != null) {
          this.swal("Success", "Card policy updated Succesfully", "success");
          // this.amount1=""
          // this.amount2=""
          // startDate=new Date()
          // endDate=new Date()
          window.location.reload();
        }
        else if (data == null) {
          this.swal("Error", "Something went wrong", "error");
        }
        this.getCardPolicyDate();
      })
  }
  validateFamilyAmount() {
    let familyAmount = $('#familyAmount').val();
    if (familyAmount.length <= 4) {
      $("#familyAmount").focus();
      this.swal("Info", "Family amount must be more than 5 character", 'info');
      return;
    }
  }
  validateFemaleAmount() {
    let femaleAmount = $('#femaleAmount').val();
    if (femaleAmount.length <= 4) {
      $("#femaleAmount").focus();
      this.swal("Info", "Female amount must be more than 5 character", 'info');
      return;
    }
  }
  resetForm() {
    window.location.reload();
  }

  getCardPolicyDate() {
    this.cardPolicyService.getCardPolicyDate().subscribe((data: any) => {
      this.cardData = data;
    })
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
