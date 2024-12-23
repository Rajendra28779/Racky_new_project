import { PreAuthData } from './PreAuthData.service';
import { ApprovedAmountData } from './ApprovedAmountData.service';

export class TransactionClass{
    hospitalName:string;
    hospitalCode:string;
    invoiceNo:string;
    gender:string;
    patientName:string;
    
    dateOfAdmission:string;
    dateOfDischarge:string;
    procedureName:string;
    packageName:string;
    patientAddress:string;

    hospitalClaimedAmount :string;
    packageCost:string;
    
    age:String;
    noOfDays:number;
    
    hospitalAddress:string;
    approvedAmountList : ApprovedAmountData[];
    preAuthDataTable : PreAuthData[];

}