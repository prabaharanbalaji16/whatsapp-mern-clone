import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyBs0fhxshRYteNNnRYYC7jwl253tO_x1bE",
    authDomain: "whatsapp-clonemern.firebaseapp.com",
    projectId: "whatsapp-clonemern",
    storageBucket: "whatsapp-clonemern.appspot.com",
    messagingSenderId: "342017219147",
    appId: "1:342017219147:web:67a19a860946b38dbe8bce"
  };

// eslint-disable-next-line no-unused-vars
const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider();

export {auth,provider};

