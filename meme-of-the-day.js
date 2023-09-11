document.getElementById("urlOut").value = location.href;

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

const checkUser = (user) => {
    if (user) {
        db.ref('meme-of-the-day/' + user.uid).set(true);
        signedIn = true;
        displayLikes();
        displayDislikes();
        displayComments();
    } else {
        signedIn = false;
        db.ref('meme-of-the-day/annonymous').get()
            .then((node) => {

                if (node.val() == null || node.val() == undefined) {
                    db.ref('meme-of-the-day/annonymous').set(1);
                } else {
                    db.ref('meme-of-the-day/annonymous').set(node.val() + 1);
                }

            }).catch((err) => {
                alert(err);
                console.log(err);
            });
        displayLikes();
        displayDislikes();
    }
}

auth.onAuthStateChanged(checkUser);

function displayMeme(){
    db.ref("meme").get()
    .then((url)=>{
        document.getElementById("meme").src = url.val();
    }).catch((err)=>{
        alert(err);
        console.log(err);
    });
}

displayMeme();

function like() {
    if (!signedIn) {
        location.assign("./signIn.html");
        return;
    }

    let uid = auth.currentUser.uid;

    db.ref("meme-likes/" + uid).get()
        .then((clientLike) => {

            if (clientLike.val() == null || clientLike.val() == undefined) { // if user has not liked the meme before
                db.ref("meme-likes/" + uid).set(true)
                    .then(() => {
                        let displayedLikes = Number(document.getElementById("likesText").innerText);
                        document.getElementById("likesText").innerText = displayedLikes + 1;
                        document.getElementById("likesText").style.color = "cyan";

                        db.ref("meme-dislikes/" + uid).get() // if user has disliked the meme before, remove the like
                            .then((node) => {

                                if (node.val() != undefined || node.val() != null) {
                                    let displayedDislikes = Number(document.getElementById("dislikesText").innerText);
                                    document.getElementById("dislikesText").innerText = displayedDislikes - 1;
                                    document.getElementById("dislikesText").style.color = "white";
                                }

                                db.ref("meme-dislikes/" + uid).remove() // remove the users like

                            }).catch((err) => {
                                alert(err);
                                console.log(err);
                            });
                    }).catch((err) => {
                        alert(err);

                        console.log(err);
                    });
            } else {
                db.ref("meme-likes/" + uid).remove()
                    .then(() => {
                        let displayedLikes = Number(document.getElementById("likesText").innerText);
                        document.getElementById("likesText").innerText = displayedLikes - 1;
                        document.getElementById("likesText").style.color = "white";

                    }).catch((err) => {
                        alert(err);
                        console.log(err);
                    })
            }

        }).catch((err) => {
            alert(err);
            console.log(err);
        });

}

function dislike() {
    if (!signedIn) {
        location.assign("./signIn.html");
        return;
    }

    let uid = auth.currentUser.uid;

    db.ref("meme-dislikes/" + uid).get()
        .then((clientLike) => {

            if (clientLike.val() == null || clientLike.val() == undefined) { // if user has not disliked the meme before
                db.ref("meme-dislikes/" + uid).set(true)
                    .then(() => {

                        let displayedDislikes = Number(document.getElementById("dislikesText").innerText);
                        document.getElementById("dislikesText").innerText = displayedDislikes + 1;
                        document.getElementById("dislikesText").style.color = "rgb(242, 70, 58)";

                        db.ref("meme-likes/" + uid).get() // if user has liked the meme before, remove the like
                            .then((node) => {

                                if (node.val() != undefined || node.val() != null) {
                                    let displayedLikes = Number(document.getElementById("likesText").innerText);
                                    document.getElementById("likesText").innerText = displayedLikes - 1;
                                    document.getElementById("likesText").style.color = "white";
                                }

                                db.ref("meme-likes/" + uid).remove() // remove the users like

                            }).catch((err) => {
                                alert(err);
                                console.log(err);
                            });


                    }).catch((err) => {
                        alert(err);

                        console.log(err);
                    });
            } else {
                db.ref("meme-dislikes/" + uid).remove()
                    .then(() => {
                        let displayedLikes = Number(document.getElementById("dislikesText").innerText);
                        document.getElementById("dislikesText").innerText = displayedLikes - 1;
                        document.getElementById("dislikesText").style.color = "white";
                    }).catch((err) => {
                        alert(err);
                        console.log(err);
                    })
            }

        }).catch((err) => {
            alert(err);
            console.log(err);
        });
}

function displayLikes() {
    db.ref("meme-likes").get()
        .then((likesList) => { // get the list of likes

            if (likesList.val() == null || likesList.val() == undefined) {
                endLoadingScreen();
                return;
            }

            let keys = Object.keys(likesList.val());
            let likes = keys.length; // get the number of likes
            if (!signedIn) {
                document.getElementById("likesText").innerText = likes;
                endLoadingScreen();

            } else { // if user is signed in, check if he has liked the post

                db.ref("meme-likes/" + auth.currentUser.uid).get()
                    .then((node) => {
                        document.getElementById("likesText").innerText = likes;

                        if (node.val() != undefined) { // if user has liked the meme before
                            document.getElementById("likesText").style.color = "cyan";
                        }

                        endLoadingScreen();

                    }).catch((err) => {
                        alert(err);
                        console.log(err);
                    });
            }



        }).catch((err) => {
            alert(err);
            console.log(err);
        })
}

function displayDislikes() {
    db.ref("meme-dislikes").get()
        .then((likesList) => { // get the list of likes

            if (likesList.val() == null || likesList.val() == undefined) {
                endLoadingScreen();
                return;
            }

            let keys = Object.keys(likesList.val());
            let dislikes = keys.length; // get the number of dislikes

            if (!signedIn) {
                document.getElementById("dislikesText").innerText = dislikes;
                endLoadingScreen();

            } else { // if user is signed in, check if he has disliked the post

                db.ref("meme-dislikes/" + auth.currentUser.uid).get()
                    .then((node) => {
                        document.getElementById("dislikesText").innerText = dislikes;

                        if (node.val() != undefined) { // if user has disliked the meme before
                            document.getElementById("dislikesText").style.color = "rgb(242, 70, 58)";
                        }

                        endLoadingScreen();

                    }).catch((err) => {
                        alert(err);
                        console.log(err);
                    });
            }

        }).catch((err) => {
            alert("Cannot get dislikes...");
            alert(err);
            console.log(err);
        });
}

function sendComment() {
    let comment = document.querySelector("textarea").value;
    let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    if (!signedIn) {
        alert("Sign in to comment...");
        return;
    }

    let uid = auth.currentUser.uid;

    db.ref("meme-comments").get()
        .then((node) => {
            if (node.val() == undefined || node.val() == null) { // if no one else has commented before
                db.ref("users/" + uid + "/username").get()
                    .then((username) => {
                        let comment_info = {
                            message: comment,
                            sender_username: username.val()
                        }

                        db.ref("meme-comments/a " + uid).set(comment_info);
                    }).catch((err) => {
                        alert(err);
                        console.log(err);
                    })
            } else {
                let messageNum = "";
                let newMessageNum = "";

                let i = 0;
                for (m in node.val()) { // find length
                    i += 1;
                }

                let j = 0;
                for (m in node.val()) { // find last node
                    if (j == i - 1) {
                        const splitStr = m.split(" ");
                        messageNum = splitStr[0];

                        if (messageNum[messageNum.length - 1] == "z") {
                            newMessageNum = messageNum.concat("a");
                        } else {
                            let index = letters.indexOf(messageNum[messageNum.length - 1]);
                            messageNum[messageNum.length - 1] = letters[index + 1];

                        }
                    }
                    j += 1;
                }

                // get new messageNum
                newMessageNum = letters[(letters.indexOf(messageNum) + 1)];

                // record comment in database
                db.ref('users/' + uid).get()
                    .then((node2) => {
                        let message_info = {
                            sender_username: node2.val().username,
                            message: comment
                        }
                        db.ref("meme-comments/" + newMessageNum + " " + uid).set(message_info);

                    })
                    .catch((err) => {
                        alert(err);
                    });
            }
        }).catch((err) => {
            alert(err);
            console.log(err);
        });

    document.querySelector("textarea").value = "";
    document.querySelector("body").scrollHeight = 0;
}

function displayComments() {
    db.ref("meme-comments").on("child_added", (comment) => {
        let htmlCode = `
            <div class = "comment">
                <div class = "commentSender align-cent">
                    <img src = "./Assets/userLogo.png" width = "45px"> 
                    <h2 style = "font-size: 1.3rem;">${comment.val().sender_username}</h2>
                </div>
        
                <div class = "commentMessage">
                    <p style = "font-size: 1.15rem;">${comment.val().message}</p>
                </div>
            </div>
        `

        document.getElementById("comments").innerHTML += htmlCode;
    });
}

function sharePopup() {
    document.querySelector(".sharePopup").classList.add("sharePopup-appear");
}

function endLoadingScreen() {
    document.querySelector(".loadingScreen").classList.add("loadingScreen-end");
    document.getElementById("loadingScreen").addEventListener("transitionend", () => {
        document.getElementById("loadingScreen").remove();
    });
}
