const firebaseConfig = {
    apiKey: "AIzaSyD2Q3mFhTcnbcd8aDRsAPJw1UEWKV3vZvc",
    authDomain: "memeoftheday-c5970.firebaseapp.com",
    databaseURL: "https://memeoftheday-c5970-default-rtdb.firebaseio.com",
    projectId: "memeoftheday-c5970",
    storageBucket: "memeoftheday-c5970.appspot.com",
    messagingSenderId: "473344259722",
    appId: "1:473344259722:web:83e640ad8a54fd4b411f73"
}

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();

function login(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
    .then(()=>{
        if (!auth.currentUser.emailVerified){
            location.replace("./verification.html");
        } else {
            location.replace("./index.html");
        }
    }).catch((err)=>{
        alert(err);
        console.log(err);
    });
}