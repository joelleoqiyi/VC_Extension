//import necessary functions from other supporting files
import 'babel-polyfill';
import {deleteDocuments} from './db';
import {getCurrDate} from './date';

//executable function. 
(async ()=>{
    let DaysToClean = [-1, -2, -3 , -4, -5];
    DaysToClean.forEach((day,i)=>{
        DaysToClean[i] = getCurrDate(day);
    });
    let res = await deleteDocuments(
        "roomData",
        [{"expirationDate": {"$in": DaysToClean}}] 
    );
    if (res !== 1){
        console.log(`\(FAILED\) cleanRequest: res failed to update database\n\tres: ${res}\n\tDaysToClean: ${DaysToClean}`);
    }
})().catch(err => console.error(`Error during Cleaning: ${err}`));
