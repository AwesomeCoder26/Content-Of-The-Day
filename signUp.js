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

function createAccount(){
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    db.ref("usernames/" + username).get()
    .then((node)=>{

        if (node.val() == null || node.val() == undefined){ 
            auth.createUserWithEmailAndPassword(email, password)
            .then(()=>{
                let user_info = {
                    username: username,
                    email: email, 
                }

                db.ref("users/" + auth.currentUser.uid).set(user_info)
                .then(()=>{
                    alert("Account Created!");
                    window.location.replace("./verification.html");
                }).catch((err)=>{
                    alert(err);
                    console.log(err);
                });


            }).catch((err)=>{
                alert(err);
                console.log(err);
            })
        } else {
            alert("Username is already taken...");
            return;
        }

    }).catch((err)=>{
        alert(err);
        console.log(err);
    });

}
