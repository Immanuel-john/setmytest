const functions = require('firebase-functions');

var admin = require("firebase-admin");


var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pat0708-9374e.firebaseio.com"
},functions.config().firebase);


var db = admin.firestore();
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);


exports.createUser = functions.firestore
    .document('users/{docID}')
    .onCreate((snap, context) => {
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      const newValue = snap.data();
        console.log("New value ",newValue);
      // access a particular field as you would any JS property
     // const name = newValue.name;
      db.collection("userInformation").add({
        name: newValue.name,
        email: newValue.email
    })
    .then(function() {
        console.log("Written data to userInfo!");
        return ;
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    });

 exports.sendMail = functions.firestore.document('userInformation/{userId}').onCreate((snap, context)=> {

  let to   = snap.data().email,
      name = snap.data().name;
  console.log("to ",to);
  const SENDGRID_API_KEY = functions.config().sendgrid.key;
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(SENDGRID_API_KEY);
  const msg = {
    to: to,
    from: 'imjjohn18@gmail.com',
    subject: 'Welcome',
    text: `Dear ${name} , Welcome to our app`
  };
  sgMail.send(msg).then(()=>console.log("email sent")).catch((err)=>console.log(err))
})   
