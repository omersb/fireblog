// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
// import { toastErrorNotify, toastSuccessNotify } from "./toastNotify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKJN91IiEu-3xSHutUSoxZZAt-SZUezkY",
  authDomain: "fireblog-4335d.firebaseapp.com",
  projectId: "fireblog-4335d",
  storageBucket: "fireblog-4335d.appspot.com",
  messagingSenderId: "842723826394",
  appId: "1:842723826394:web:3cf65af49119bead5d63e3",
};

//* Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const createUser = async (email, password, name, navigate) => {
  try {
    let userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(auth.currentUser, {
      displayName: name,
    });
    navigate("/");
    // toastSuccessNotify("New user successfully created.");
  } catch (error) {
    // toastErrorNotify(error.message);
  }
};

export const updateUser = async (displayName, photoURL, navigate) => {
  try {
    await updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    });
    navigate("/profile");
    // toastSuccessNotify("Your profile has been updated.");
  } catch (error) {
    //  toastErrorNotify(error.message);
  }
};

export const singIn = async (email, password, navigate) => {
  try {
    let userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    navigate("/");
    // toastSuccessNotify("Successfully logged in.");
  } catch (error) {
    // toastErrorNotify(error.message);
  }
};

export const userObserver = (setCurrentUser) => {
  //? Kullanıcının signin olup olmadığını takip eden ve kullanıcı değiştiğinde yeni kullanıcıyı response olarak dönen firebase metodu
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      // User is signed out
      setCurrentUser(false);
    }
  });
};

export const logOut = () => {
  signOut(auth);
};

//* https://console.firebase.google.com/
//* => Authentication => sign-in-method => enable Google
//! Google ile girişi enable yap
//* => Authentication => sign-in-method => Authorized domains => add domain
//! Projeyi deploy ettikten sonra google sign-in çalışması için domain listesine deploy linkini ekle
export const signUpProvider = (navigate) => {
  //? Google ile giriş yapılması için kullanılan firebase metodu
  const provider = new GoogleAuthProvider();
  //? Açılır pencere ile giriş yapılması için kullanılan firebase metodu
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      navigate("/");
      // toastSuccessNotify('Logged out successfully!');
    })
    .catch((error) => {
      // Handle Errors here.
      console.log(error);
    });
};

//***** DATABASE İŞLEMLERİ *****//

export const db = getFirestore(app);
const blogsRef = collection(db, "fireBlog");

//** Read (veri alma) işlemi **//
export const getBlogs = async () => {
  const data = await getDocs(blogsRef);
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

//** Create (veri oluşturma) işlemi **//
export const createBlogs = async (
  title,
  imgUrl,
  content,
  email,
  date1,
  userPhoto,
  likeCount,
  likeCountUsers,
  navigate
) => {
  //! title:title ismi aynı ise title olarak yazıla bilir.
  try {
    await addDoc(blogsRef, {
      title: title,
      imgUrl: imgUrl,
      description: content,
      email,
      date: date1,
      userPhoto,
      likeCount,
      likeCountUsers,
    });
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

//** Update (veri güncelleme) işlemi **//
export const updateBlog = async (id, title, imgUrl, content, navigate) => {
  const blogDoc = doc(db, "fireBlog", id);
  try {
    await updateDoc(blogDoc, { title, imgUrl, description: content });
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

//** Delete (veri silme) işlemi **//
export const deleteBlog = async (id, navigate) => {
  const blogDoc = doc(db, "fireBlog", id);
  try {
    await deleteDoc(blogDoc);
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

export const updateLike = async (id, likeCount) => {
  const blogDoc = doc(db, "fireBlog", id);
  try {
    await updateDoc(blogDoc, { likeCount: likeCount + 1 });
  } catch (error) {
    console.log(error);
  }
};
