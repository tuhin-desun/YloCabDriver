import firebase from "../config/firebase";
import Configs from "../config/Configs";


export const writeUserDataToFirebase = (data, id) => {
    firebase.database().ref('Drivers/'+id).set(data).then((data)=>{
        //success callback
        console.log('data firebase' , data)
    }).catch((error)=>{
        //error callback
        console.log('error firebase ' , error)
    })
}


export const readUserDataFromFirebase = () => {
    firebase.database().ref('Drivers/').on('value', function (snapshot) {
        console.log("snapshot value",snapshot.val())
    });
}

export const updateDataFirebase = (data, id) => {
    firebase.database().ref('Drivers/'+id).update(data);
}

export const updateTempBookingDataFirebase = (data, id) => {
    console.log(data,id)
    firebase.database().ref('TempBooking/'+id).update(data);
}


export const updateLocation = (data, id) => {
    firebase.database().ref('Location/'+id).update(data);
}

export const getDriverUpdatedLocation = (id) => {
    firebase.database().ref('Location/'+id).on('value', function (snapshot) {
        console.log("snapshot value",snapshot.val())
    });
}

export const getTravelDistanceandTime = async (origin,destination) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      let response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${Configs.GOOGLE_MAPS_API_KEY}&mode=driving`, requestOptions)
      return await response.json();
}



