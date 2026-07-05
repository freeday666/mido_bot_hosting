
// Firebase Config (VUL HIER IN)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

let currentUser = null;

// AUTH
auth.onAuthStateChanged(user => {
  currentUser = user;

  if (user) {
    document.getElementById("loginBox").style.display = "none";
    loadMovies();
  } else {
    document.getElementById("loginBox").style.display = "block";
  }
});

function login(){
auth.signInWithEmailAndPassword(
document.getElementById("email").value,
document.getElementById("password").value
);
}

function register(){
auth.createUserWithEmailAndPassword(
document.getElementById("email").value,
document.getElementById("password").value
);
}

function logout(){
auth.signOut();
}

// CHECK ADMIN
function isAdmin(email){
return email === "admin@midoflix.com";
}

// UPLOAD MOVIE
async function uploadMovie(){

let videoFile = document.getElementById("videoFile").files[0];
let imageFile = document.getElementById("imageFile").files[0];

let videoRef = storage.ref("videos/" + videoFile.name);
let imageRef = storage.ref("thumbs/" + imageFile.name);

await videoRef.put(videoFile);
await imageRef.put(imageFile);

let videoURL = await videoRef.getDownloadURL();
let imageURL = await imageRef.getDownloadURL();

await db.collection("movies").add({
title: document.getElementById("title").value,
videoUrl: videoURL,
thumbnail: imageURL
});

alert("Uploaded!");
loadMovies();
}

// LOAD MOVIES
function loadMovies(){
db.collection("movies").onSnapshot(snapshot => {

document.getElementById("movies").innerHTML = "";

snapshot.forEach(doc => {

let m = doc.data();

document.getElementById("movies").innerHTML += `
<div class="movie" onclick="play('${m.videoUrl}')">
<img src="${m.thumbnail}">
<p>${m.title}</p>
</div>
`;

});
});
}

// PLAYER
function play(url){
document.getElementById("player").style.display = "flex";
document.getElementById("videoPlayer").src = url;
}

function closePlayer(){
document.getElementById("player").style.display = "none";
document.getElementById("videoPlayer").pause();
}
