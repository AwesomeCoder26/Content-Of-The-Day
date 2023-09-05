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

let signedIn = false;

const checkUser = (user)=>{
    if (!user){
        document.querySelector(".loadingScreen").classList.add("loadingScreen-end");
        document.getElementById("loadingScreen").addEventListener("transitionend", () => {
            document.getElementById("loadingScreen").remove();
        });
        return;
    }

    if (!user.emailVerified){
        document.querySelector(".loadingScreen").classList.add("loadingScreen-end");
        document.getElementById("loadingScreen").addEventListener("transitionend", () => {
            document.getElementById("loadingScreen").remove();
        });
        auth.signOut();
        return;
    }

    db.ref("users/" + user.uid + "/username").get()
    .then((username)=>{

        document.getElementById("login").innerText = "My Account";
        signedIn = true;

        document.getElementById("signUp").innerHTML = "Logout<span></span><span></span><span></span><span></span>";

        document.getElementById("navLogin").innerText = "My Acccount";
        document.getElementById("navSignUp").innerText = "Logout";

        document.querySelector(".loadingScreen").classList.add("loadingScreen-end");
        document.getElementById("loadingScreen").addEventListener("transitionend", () => {
            document.getElementById("loadingScreen").remove();
        });

    }).catch((err)=>{
        if (err == "Error: Error: Client is offline."){
            alert("Unable to connect. Poor internet connection...");
            return;
        }
        alert(err);
        console.log(err);

        document.querySelector(".loadingScreen").classList.add("loadingScreen-end");
        document.getElementById("loadingScreen").addEventListener("transitionend", () => {
            document.getElementById("loadingScreen").remove();
        });
    });

}


function goToLogin(){
    if (!signedIn)
    location.assign("./signIn.html");
    else
    location.assign("./account.html")
}

function goToSignUp(){
    if (!signedIn){
        location.assign("./signUp.html");
    } else {
        auth.signOut();
        location.reload();
    }
    
}
auth.onAuthStateChanged(checkUser);