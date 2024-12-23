import * as XLSX from "xlsx";
import Swal from 'sweetalert2';
import { formatDate } from "@angular/common";
import { SessionStorageService } from "src/app/services/session-storage.service";

const getFileName = (name: string) => {
  let timeSpan = new Date().toISOString();
  let sheetName = name || "Bsky";
  let fileName = `${sheetName}-${timeSpan}`;
  return {
    sheetName,
    fileName
  };
};
export class TableUtil {
  // static sessionService: SessionStorageService;
  static decryptSessionData(key: string){
    let data = sessionStorage.getItem(key);
    data = this.decrypTheData(data);
    return JSON.parse(data);
  }
  static decrypTheData(data) {
    if (data) {
      data = data.substring(5, data.length - 5);
      return atob(data);
    } else {
      return data;
    }
  }

  // constructor(private sessionService: SessionStorageService){}

  static exportTableToExcel(tableId: string, name?: string) {
    let { sheetName, fileName } = getFileName(name);
    let targetTableElm = document.getElementById(tableId);
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{
      sheet: sheetName
    });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  static exportListToExcel(list: any[], name: string, heading: any[]) {
    //let { sheetName, fileName } = getFileName(name);
    if(list==null || list.length==0) {
      Swal.fire("Info", "No data found", 'info');
      return;
    }
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = TableUtil.decryptSessionData("user").fullName;
    const header = Object.keys(list[0]);
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // columns length added
        wscols.push({ wch: header[i].length + 15 })
    }

    var wb = XLSX.utils.book_new();
    var ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, [['Generated By', generatedBy]], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [['Generated On', generatedOn]], { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, heading, {origin: 'A4'});
    XLSX.utils.sheet_add_json(ws, list, { origin: 'A5', skipHeader: true });
    //
    ws['!cols'] = wscols;
    //ws['!cols'] = this.fitToColumn(list);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, "GJAY_"+name+".xlsx");
  }

  static exportListToExcelWithFilter(list: any[], name: string, heading: any[], filter: any[]) {
    //let { sheetName, fileName } = getFileName(name);
    if(list==null || list.length==0) {
      Swal.fire("Info", "No data found", 'info');
      return;
    }
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = TableUtil.decryptSessionData("user").fullName;
    const header = Object.keys(list[0]);
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // columns length added
        wscols.push({ wch: header[i].length + 15 })
    }

    var wb = XLSX.utils.book_new();
    var ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    for(var i=0; i<filter.length; i++) {
      XLSX.utils.sheet_add_aoa(ws, filter[i], { origin: 'A'+(1+i).toString() });
    }
    XLSX.utils.sheet_add_aoa(ws, [['Generated By', generatedBy]], { origin: 'A'+(filter.length+1).toString() });
    XLSX.utils.sheet_add_aoa(ws, [['Generated On', generatedOn]], { origin: 'A'+(filter.length+2).toString() });
    XLSX.utils.sheet_add_aoa(ws, heading, { origin: 'A'+(filter.length+4).toString() });
    XLSX.utils.sheet_add_json(ws, list, { origin: 'A'+(filter.length+5).toString(), skipHeader: true });
    //
    ws['!cols'] = wscols;
    //ws['!cols'] = this.fitToColumn(list);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, "BSKY_"+name+".xlsx");
  }

  static exportfiltercceListToExcel(list: any[], name: string, heading: any[],filter: any[], subheading: any[],) {
    let { sheetName, fileName } = getFileName(name);
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = TableUtil.decryptSessionData("user").fullName;
    if(list==null || list.length==0) {
      Swal.fire("Info", "No data found", 'info');
      return;
    }
    const header = Object.keys(list[0]);
    const subheader = Object.keys(list[0]);
    var wscols = [];
    for (var i = 0; i < header?.length && subheader?.length; i++) {  // columns length added
        wscols.push({ wch: header[i]?.length + 15 && subheader[i]?.length + 15})
    }

    var wb = XLSX.utils.book_new();
    var ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    for(var i=0; i<filter.length; i++) {
      XLSX.utils.sheet_add_aoa(ws, filter[i], { origin: 'A'+(1+i).toString() });
    }
    XLSX.utils.sheet_add_aoa(ws, [['Generated By', generatedBy]], { origin: 'A'+(filter.length+1).toString() });
    XLSX.utils.sheet_add_aoa(ws, [['Generated On', generatedOn]], { origin: 'A'+(filter.length+2).toString() });
    XLSX.utils.sheet_add_aoa(ws, heading, { origin: 'A'+(filter.length+4).toString() });
    XLSX.utils.sheet_add_aoa(ws, subheading, { origin: 'A'+(filter.length+5).toString() });
    XLSX.utils.sheet_add_json(ws, list, { origin: 'A'+(filter.length+6).toString(), skipHeader: true });
    // XLSX.utils.sheet_add_aoa(ws, heading);
    // XLSX.utils.sheet_add_aoa(ws, subheading, { origin: 'A2' });

    // XLSX.utils.sheet_add_json(ws, list, { origin: 'A3', skipHeader: true });
    //
    ws['!cols'] = wscols;
    //ws['!cols'] = this.fitToColumn(list);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, "GJAY_"+name+".xlsx");
  }
  static exportcceListToExcel(list: any[], name: string, heading: any[], subheading: any[],) {
    let { sheetName, fileName } = getFileName(name);
    if(list==null || list.length==0) {
      Swal.fire("Info", "No data found", 'info');
      return;
    }
    const header = Object.keys(list[0]);
    const subheader = Object.keys(list[0]);
    var wscols = [];
    for (var i = 0; i < header?.length && subheader?.length; i++) {  // columns length added
        wscols.push({ wch: header[i]?.length + 15 && subheader[i]?.length + 15})
    }

    var wb = XLSX.utils.book_new();
    var ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, heading);
    XLSX.utils.sheet_add_aoa(ws, subheading, { origin: 'A2' });

    XLSX.utils.sheet_add_json(ws, list, { origin: 'A3', skipHeader: true });
    //
    ws['!cols'] = wscols;
    //ws['!cols'] = this.fitToColumn(list);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, "GJAY_"+name+".xlsx");
  }
  static exportArrayToExcel(list: any[], name: string, heading: any[], filter: any[]) {
    //let { sheetName, fileName } = getFileName(name);
    if(list==null || list.length==0) {
      Swal.fire("Info", "No data found", 'info');
      return;
    }
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = TableUtil.decryptSessionData("user").fullName;
    console.log(filter);
    const header = Object.keys(list[0]);
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // columns length added
        wscols.push({ wch: header[i].length + 15 })
    }

    var wb = XLSX.utils.book_new();
    var ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    for(var i=0; i<filter.length; i++) {
      XLSX.utils.sheet_add_aoa(ws, filter[i], { origin: 'A'+(1+i).toString() });
    }
    XLSX.utils.sheet_add_aoa(ws, [['Generated By', generatedBy]], { origin: 'A'+(filter.length+1).toString() });
    XLSX.utils.sheet_add_aoa(ws, [['Generated On', generatedOn]], { origin: 'A'+(filter.length+2).toString() });
    XLSX.utils.sheet_add_aoa(ws, heading, { origin: 'A'+(filter.length+4).toString() });
    XLSX.utils.sheet_add_aoa(ws, list, { origin: 'A'+(filter.length+5).toString() });
    //
    ws['!cols'] = wscols;
    //ws['!cols'] = this.fitToColumn(list);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, "GJAY_"+name+".xlsx");
  }

  static exportListToExcelWithHeading(list: any[], name: string, headers: any[]) {
    let i;
    if(list==null || list.length==0) {
      Swal.fire("Info", "No Data Found!", 'info');
      return;
    }

    const header = Object.keys(list[0]);
    var wscols = [];
    for (i = 0; i < header.length; i++) {
      wscols.push({ wch: header[i].length + 15 })
    }

    let data;
    const dataLists = [];
    const headerData = headers[0];

    for (i = 0; i < headers.length; i++) {
      for (i = -1; i < list.length; i++) {
        if (i === -1) {
          let data = {};
          for (let j = 0; j < headerData.length; j++) {
            data[headerData[j]] = headerData[j];
          }
          dataLists.push(data);
        } else {
          data = {};
          for (let j = 0; j < headerData.length; j++) {
            data[headerData[j]] = list[i][headerData[j]];
          }
          dataLists.push(data);
        }
      }
    }

    let heading = 'CPD Approval Report List';

    const wb = XLSX.utils.book_new();//Workbook Creation
    let ws: XLSX.WorkSheet;//Worksheet Creation

    // For Heading Information
    ws = XLSX.utils.json_to_sheet([]);//Blank Sheet
    XLSX.utils.sheet_add_aoa(ws, [[heading]]);//Add Heading
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: header.length } }];//Merge Cells
    ws['!rows'] = [{ hpx: 30 }];//Set Rows Height

    // For Data
    XLSX.utils.sheet_add_json(ws, dataLists, { origin: 'A2', skipHeader: true });//Add Data
    ws['!cols'] = wscols;//Set Columns Width

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');//Add Sheet to Workbook
    XLSX.writeFile(wb, "GJAY_"+name+".xlsx");//Write Workbook to File
  }

  static fitToColumn(arrayOfArray: any[]) {
    // get maximum character of each column
    return arrayOfArray[0].map((a, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => a2[i] ? a2[i].toString().length : 0)) }));
  }

//for Hospital Section Excel Reports
  static exportListToExcelWithFilterforhospitals(list: any[], name: string, heading: any[], filter1: any[]) {
    //let { sheetName, fileName } = getFileName(name);
    if(list==null || list.length==0) {
      Swal.fire("Info", "No data found", 'info');
      return;
    }
    let hospitalName = TableUtil.decryptSessionData("user").fullName+"("+TableUtil.decryptSessionData("user").userName+")";
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString();
    const header = Object.keys(list[0]);
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // columns length added
        wscols.push({ wch: header[i].length + 15 })
    }
    var wb = XLSX.utils.book_new();
    var ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    for(var i=0; i<filter1.length; i++) {
      XLSX.utils.sheet_add_aoa(ws, filter1[i], { origin: 'A'+(1+i).toString() });
    }
    XLSX.utils.sheet_add_aoa(ws, [['Hospital Name', hospitalName]], { origin: 'A'+(filter1.length+1).toString() });
    XLSX.utils.sheet_add_aoa(ws, [['Generated On', generatedOn]], { origin: 'A'+(filter1.length+2).toString() });
    XLSX.utils.sheet_add_aoa(ws, heading, { origin: 'A'+(filter1.length+4).toString() });
    XLSX.utils.sheet_add_json(ws, list, { origin: 'A'+(filter1.length+5).toString(), skipHeader: true });
    //
    ws['!cols'] = wscols;
    //ws['!cols'] = this.fitToColumn(list);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, "GJAY_"+name+".xlsx");
  }
//for Adminz Section Excel Reports
  static exportListToExcelWithFilterforadmin(list: any[], name: string, heading: any[], filter2: any[]) {
    //let { sheetName, fileName } = getFileName(name);
    if(list==null || list.length==0) {
      Swal.fire("Info", "No data found", 'info');
      return;
    }
    let hospitalName =TableUtil.decryptSessionData("user").fullName+"("+TableUtil.decryptSessionData("user").userName+")";
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString();
    const header = Object.keys(list[0]);
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // columns length added
        wscols.push({ wch: header[i].length + 15 })
    }
    var wb = XLSX.utils.book_new();
    var ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    for(var i=0; i<filter2.length; i++) {
      XLSX.utils.sheet_add_aoa(ws, filter2[i], { origin: 'A'+(1+i).toString() });
    }
    XLSX.utils.sheet_add_aoa(ws, [['Authority Name', hospitalName]], { origin: 'A'+(filter2.length+1).toString() });
    XLSX.utils.sheet_add_aoa(ws, [['Generated On', generatedOn]], { origin: 'A'+(filter2.length+2).toString() });
    XLSX.utils.sheet_add_aoa(ws, heading, { origin: 'A'+(filter2.length+4).toString() });
    XLSX.utils.sheet_add_json(ws, list, { origin: 'A'+(filter2.length+5).toString(), skipHeader: true });
    //
    ws['!cols'] = wscols;
    //ws['!cols'] = this.fitToColumn(list);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, "GJAY_"+name+".xlsx");
  }


  static exportListToExcelmosarkar(list: any[], name: string, heading: any[]) {
    //let { sheetName, fileName } = getFileName(name);
    if(list==null || list.length==0) {
      Swal.fire("Info", "No data found", 'info');
      return;
    }
    // let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    // let generatedBy = TableUtil.decryptSessionData("user").fullName;
    const header = Object.keys(list[0]);
    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // columns length added
        wscols.push({ wch: header[i].length + 15 })
    }

    var wb = XLSX.utils.book_new();
    var ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    // XLSX.utils.sheet_add_aoa(ws, [['Generated By', generatedBy]], { origin: 'A1' });
    // XLSX.utils.sheet_add_aoa(ws, [['Generated On', generatedOn]], { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(ws, heading, {origin: 'A1'});
    XLSX.utils.sheet_add_json(ws, list, { origin: 'A2', skipHeader: true });
    //
    ws['!cols'] = wscols;
    //ws['!cols'] = this.fitToColumn(list);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, "GJAY_"+name+".xlsx");
  }
  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  //for Adminz Section Excel Reports
  static exportListToExcelWithFilterforadmin2(list: any[], name: string, heading: any[], filter2: any[]) {
    if (list == null || list.length === 0) {
      Swal.fire("Info", "No data found", 'info');
      return;
    }

    let hospitalName = TableUtil.decryptSessionData("user").fullName + "(" + TableUtil.decryptSessionData("user").userName + ")";
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString();

    // Creating worksheet and setting column widths based on headers
    const header = heading;
    var wscols = header.map((h) => ({ wch: h.toString().length + 15 }));

    // Creating a new workbook and worksheet
    var wb = XLSX.utils.book_new();
    var ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    // Adding filter2 data
    for (let i = 0; i < filter2.length; i++) {
      if (!Array.isArray(filter2[i])) {
        console.error(`filter2[${i}] is not an array:`, filter2[i]);
        continue;
      }
      XLSX.utils.sheet_add_aoa(ws, [filter2[i]], { origin: 'A' + (1 + i).toString() });
    }

    // Adding Authority Name and Generated On
    XLSX.utils.sheet_add_aoa(ws, [['Authority Name', hospitalName]], { origin: 'A' + (filter2.length + 1).toString() });
    XLSX.utils.sheet_add_aoa(ws, [['Generated On', generatedOn]], { origin: 'A' + (filter2.length + 2).toString() });

    // Adding headers and data
    XLSX.utils.sheet_add_aoa(ws, [header], { origin: 'A' + (filter2.length + 4).toString() });
    XLSX.utils.sheet_add_json(ws, list, { origin: 'A' + (filter2.length + 5).toString(), skipHeader: true });

    // Setting column widths
    ws['!cols'] = wscols;

    // Appending the worksheet to the workbook and saving the file
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, "GJAY_" + name + ".xlsx");
  }

}
