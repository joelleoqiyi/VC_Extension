//import necessary functions from other supporting files
import 'babel-polyfill';
import {updateDocument, deleteDocuments, queryDocument} from './db';
import {getCurrDate} from './date';
import {auth, room} from './config'

//executable function.
(async ()=>{
    let DaysToClean = [-1, -2, -3 , -4, -5, 1 , 2, 3, 4,5 ];
    DaysToClean.forEach((day,i)=>{
        DaysToClean[i] = getCurrDate(day);
    });
    let queryRes = await queryDocument(
        room,
        [{"expirationDate" : {"$in": DaysToClean}}],
        ["roomKey"],
        true
    );
    let queryArray = [];
    queryRes.forEach(res => queryArray.push(res.roomKey));
    let updateRes = await updateDocument(
        auth,{}, null, null,
        {
            "currActiveRooms": {
                    "roomToken" : { 
                            "$in": queryArray
                     }
            }
        }
    );
    if (updateRes !== 1){
        console.log(`\(FAILED\) cleanRequest: updateRes failed to update database\n\tres: ${updateRes}\n\tDaysToClean: ${queryArray}`);
    }
    let res = await deleteDocuments(
        room,
        [{"expirationDate" : {"$in": DaysToClean}}]
    );
    if (res !== 1){
        console.log(`\(FAILED\) cleanRequest: res failed to update database\n\tres: ${res}\n\tDaysToClean: ${DaysToClean}`);
    }
})().catch(err => console.error(`Error during Cleaning: ${err}`));
