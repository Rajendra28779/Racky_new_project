import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValidatorchecklistService {

  constructor() { }

  blankCheck(elmVal:any, msg:any)
  {
      if(elmVal == '' || typeof (elmVal) == undefined || elmVal == null)
      {
        Swal.fire({
          icon: 'error',
          text: msg
        });
        return false;
      }
      return true;
  }

  blankImgCheck(elmVal:any, msg:any)
  {
      if(elmVal == '' || typeof (elmVal) == undefined || elmVal == null)
      {
        Swal.fire({
          icon: 'error',
          text: 'Please '+msg
        });
        return false;
      }
      return true;
  }

  blankCheckRdo(elmNm:any, msg:any)
  {
      let ele = document.getElementsByName(elmNm);
      let checkedCtr:number = 0;
      for(let i = 0; i < ele.length; i++) {

         if((ele[i] as HTMLInputElement).checked)
         {
          checkedCtr++;
         }

      }
      if(checkedCtr==0)
      {
        Swal.fire({
          icon: 'error',
          text: 'Select '+msg
        });

        return false;
      }
      return true;
  }


  blankCheckRdoDynamic(clsName:any, msg:any)
  {
      let className =  'cls_'+clsName;
      let ele = document.getElementsByClassName(className);
      let checkedCtr:number = 0;
      for(let i = 0; i < ele.length; i++) {

         if((ele[i] as HTMLInputElement).checked)
         {
          checkedCtr++;
         }

      }
      if(checkedCtr==0)
      {
        Swal.fire({
          icon: 'error',
          text: 'Select '+msg
        });

        return false;
      }
      return true;
  }

  blankCheckChkboxDynamic(clsName:any, msg:any)
  {
      let className =  'cls_'+clsName;
      let ele = document.getElementsByClassName(className);
      let checkedCtr:number = 0;
      for(let i = 0; i < ele.length; i++) {

         if((ele[i] as HTMLInputElement).checked)
         {
          checkedCtr++;
         }

      }
      if(checkedCtr==0)
      {
        Swal.fire({
          icon: 'error',
          text: 'Select '+msg
        });

        return false;
      }
      return true;
  }

  selectDropdown(elmVal:any, msg:any)
  {
      if(elmVal == 0 || elmVal == '' || typeof (elmVal) == undefined || elmVal == null)
      {
        Swal.fire({
          icon: 'error',
          text: 'Select '+msg
        });
        return false;
      }
      return true;
  }
  maxLength(elmVal:any,fldLngth:any, msg:any)
  {
      if(elmVal.length>0 && elmVal.length>fldLngth)
      {
        Swal.fire({
          icon: 'error',
          text: msg+' should not more than ' + fldLngth + ' charater'
        });
        return false;
      }
      return true;
  }

  minLength(elmVal:any,fldLngth:any, msg:any)
  {
      if(elmVal.length>0 && elmVal.length<fldLngth)
      {
        Swal.fire({
          icon: 'error',
          text: msg+' should not be less than ' + fldLngth + ' charater'
        });
        return false;
      }
      return true;
  }


  validEmail(elmVal:any)
  {
      let pattern = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);
      if (elmVal != '')
      {
          if (pattern.test(elmVal) == true)
            return true;
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Please enter a valid email id'
            });
            return false;
          }
      }
      return true;
  }
  validMob(elmVal:any)
  {
      let pattern = new RegExp(/^[7-9][0-9]{9}$/);
      if (elmVal != '')
      {
          if (pattern.test(elmVal) == true)
            return true;
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Please enter a valid mobile no'
            });
            return false;
          }
      }
      return true;
  }

  validPassword(elmVal:any)
  {
      let pattern = new RegExp(/^.*(?=.{8,15})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&!%()*?]).*$/);
      if (elmVal != '')
      {
          if (pattern.test(elmVal) == true)
            return true;
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Please enter a valid password'
            });
            return false;
          }
      }
      return true;
  }

// validates Aadhar number received as string
  validAadhar(elmVal:any) {
    if (elmVal != '')
      {
          // multiplication table
          const d = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
            [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
            [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
            [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
            [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
            [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
            [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
            [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
          ]

          // permutation table
          const p = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
            [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
            [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
            [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
            [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
            [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
            [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
          ]
          let c = 0
          let invertedArray = elmVal.split('').map(Number).reverse()

          invertedArray.forEach((val:any, i:any) => {
            c = d[c][p[(i % 8)][val]]
          })
          if (c === 0)
            return true;
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Please enter a valid aadhaar no'
            });
            return false;
          }
      }
      return true;
  }

  isCharKey(event:any){
    var charCode2 = (event.which) ? event.which : event.keyCode
    if (charCode2 > 32 && (charCode2 < 65 || charCode2 > 90) &&
            (charCode2 < 97 || charCode2 > 122) ) {
        //alert("Enter letters only.");
        return false;
    }
    return true;
  }
  isCharKeyMob(val: any) {
    return val.replace(/[^a-zA-z ]/g, '');
  }


  isNumberKey(event:any)
  {
      let charCode = (event.which) ? event.which : event.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57))
          return false;
      return true;
  }
  isNumberKeyMob(val: any) {
    return val.replace(/[^0-9]/g, '');
  }


  isAlphaNumeric(event:any){
    var numPattern = new RegExp(/^[0-9a-zA-Z @.-/,]*$/);
    var txtVal = event.target.value;
    let space = txtVal.charAt(0);
    var charCode2 = (event.which) ? event.which : event.keyCode
    if (event.target.selectionStart === 0 && charCode2 === 32){
      event.preventDefault();
    }
    if (txtVal != '')
    {
        if (numPattern.test(txtVal) == true)
            return true;
        else
            return false;
    }
    else
        return true;
  }


  isAlphaNumericMob(val:any){
    var numPattern = new RegExp(/^[a-zA-Z0-9-.@ /]*$/);
    if (numPattern.test(val))
      return true;
    return false;
  }

  isDecimal(event:any){
    let charCode = (event.which) ? event.which : event.keyCode;
    var txtVal = event.target.value;
    if ((charCode > 47 && charCode < 58) || charCode == 46 || charCode == 8)
    {
        if (txtVal.indexOf(".") > 0 && charCode == 46)
            return false;
        else
            return true;
    }
    return false;
  }

  isDecimalMob(val: any) {
    return val.replace(/[^\d+(\.\d{1,2}]/g, '');
  }


  dynCtrlVal(ctrlValParam:any,elemObj:any)
  {
    let dynData       = ctrlValParam['dynDataObj'];
    let elmVal        = ctrlValParam['ctrlVal'];
    let drftSts       = ctrlValParam['drftSts'];
    let dispNnSts     = ctrlValParam['dispNnSts'];
    let sectnCtrlType = ctrlValParam['ctrlType'];
    let ctrlNm      = '';
    let lblName     = '';
    let ctrlType    = 0;
    let mndSts      = 0;
    let fldLngth    = 0;
    if(sectnCtrlType==8)
    {
      ctrlNm      = '';
      lblName     = dynData['columnName'];
      ctrlType    = dynData['columnType'];
      mndSts      = (dispNnSts===false)?dynData['columnMnd']:0;
      fldLngth    = dynData['fieldLen'];
    }
    else{
      ctrlNm      = dynData['jsnControlArray'][0]['ctrlName'];
      lblName     = dynData['vchLabelName'];
      ctrlType    = dynData['tinControlType'];
      mndSts      = (dispNnSts===false)?dynData['tinMandatorySts']:0;
      fldLngth    = dynData['intFieldLength'];
    }

    let valSts = true;

    // for select tag
    if (mndSts==1 && ctrlType==2) {
      if(drftSts==false)
      {
        if(!this.selectDropdown(elmVal,lblName))
        {
          valSts = false;
        }
      }
    }
    // for radio button
    else if (mndSts==1 && (ctrlType==5 || ctrlType==1)) {
      if(drftSts==false)
      {
        if(!this.blankCheckRdoDynamic(ctrlNm,lblName))
        {
          valSts = false;
        }
      }
    }
    // for text box
    else if (mndSts==1 && ctrlType==6) {;
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
          //dynData.focus();
        }
      }
      if(!this.maxLength(elmVal,fldLngth,lblName))
      {
        valSts = false;
        //dynData.focus();
      }
    }
    // for text area
    else if (mndSts==1 && ctrlType==7) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
          //dynData.focus();
        }
      }
      if(!this.maxLength(elmVal,fldLngth,lblName))
      {
        valSts = false;
        //dynData.focus();
      }
    }

    // for date box
    else if (mndSts==1 && ctrlType==9) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
        }
      }
    }

    // for time box
    else if (mndSts==1 && ctrlType==10) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
        }
      }
    }

    // for date time box
    else if (mndSts==1 && ctrlType==11) {
      if(drftSts==false)
      {
        if(!this.blankCheck(elmVal,lblName))
        {
          valSts = false;
        }
      }
    }

    else{
      valSts = true;
    }
    return valSts;
  }

  isDashSlashNumeric(event:any){
    let charCode = (event.which) ? event.which : event.keyCode
    // console.log(charCode);
    if (charCode > 31 && (charCode < 45 || charCode > 57 || charCode==46))
        return false;
    return true;
  }
  isDashSlashNumericMob(val: any) {
    return val.replace(/[^0-9/-]/g, '');
  }
  is_url(str:any)
  {
    let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
          if (regexp.test(str))
          {
            return true;
          }
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Enter valid URL'
            });
            return false;
          }
  }
  chkPassword(str:any)
  {
    let regexp =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
          if (regexp.test(str))
          {
            return true;
          }
          else
          {

            return false;
          }
  }
  chkblankspace(str:any)
  {
    var regexp = /^\S*$/
          if (regexp.test(str))
          {
            return true;
          }
          else
          {
            Swal.fire({
              icon: 'error',
              text: 'Space not allowed'
            });
            return false;
          }
  }
  validateFile(fileUploadType: string ,actualFileType:any) {
    var ext = fileUploadType.substring(fileUploadType.lastIndexOf('/') + 1);
    const fileTypes :any=
    {"pdf"  :['pdf'],
    "image" :['jpeg', 'jpe','jif','jfif', 'png', 'gif'],
    "excel" :['csv', 'dbf', 'dif', 'htm','html','mht', 'mhtml', 'ods','pdf', 'prn', 'slk', 'txt', 'xla', 'xlam', 'xls', 'xlsb', 'xlsm', 'xlsx','xlt', 'xltm', 'xls', 'xlsb', 'xlsm', 'xlsx','xlt','xlw', 'xps'],
    "doc"   :['doc', 'docm', 'docx', 'dot','dotm', 'dotx','htm', 'html', 'mht', 'mhtml', 'odt', 'pdf', 'rtf', 'txt', 'wps', 'xml','xps']
  };
    if (fileTypes[actualFileType].includes(ext)) {
        return true;
    }
    else {
        return false;
    }
}
    validateFileSize(uploadedFileSize:any,actualFileSize:any,actualFileSizeType:any)
    {
      if (actualFileSizeType.toLowerCase() == 'kb')
      {
        actualFileSize = 1024*actualFileSize;
      }
      else
      {
        actualFileSize = 1024*1024*actualFileSize;
      }

      let fileValidStatus = true;
        if(uploadedFileSize > actualFileSize)
          {
            fileValidStatus = false;
          }
      return fileValidStatus;
    }
}
