import React, { useState } from 'react';


import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';

firebase.initializeApp(firebaseConfig);

function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignIn: false,
    
    name:'',
    email:'',
    password:'',
    photo:''
  });

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signInUser = {
        isSignIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signInUser);
      //console.log(displayName,email,photoURL);
    })
    .catch(err=> {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () => {
    firebase.auth ().signOut()
    .then(res => {
     const signedOutUser = {
       isSignIn: false,
       name:'',
       photo:'',
       email:'',
       error: '',
       success: false
       

     }
     setUser(signedOutUser);
     console.log(res);
    })
    .catch(err => {
     // an error happened.
    });
  }
  const handleBlur = (e) => {
     let isFieldValid = true;
     if(e.target.name === 'email'){
       const isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
       
     }
     if(e.target.name === 'password'){
        const isPasswordValid = e.target.value.length > 6;
        const passwordHasNumber = /\d{1}./.test(e.target.value);
        isFieldValid = isPasswordValid && passwordHasNumber
     }
     if(isFieldValid){
       const newUserInfo = {...user};
       newUserInfo[e.target.name] = e.target.value;
       setUser(newUserInfo);
     }
  }

  const handleSubmit = (e) => {
    //console.log(user.email, user.password)
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res=>{
        console.log(res)
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
      })
      .catch(error => {
        
        // Handle Errors here.
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        
      });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        setLoggedInUser(newUserInfo);
        history.replace(from);
        console.log('sign in user info', res.user);
      })
      .catch(function(error) {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
        
      });
    }


    e.preventDefault();
  }


  const updateUserName = name => {
      const user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: name
        }).then(function() {
          console.log('user name  Update successfully')
      }).catch(function(error) {
        console.log(error)
});
  }

  return (
    <div style={{textAlign:'center'}} >
     {
       user.isSignIn ? <button onClick={handleSignOut}>Sign out</button>:
       <button onClick={handleSignIn}>Sign in</button>
     }
     <br/> 
     <button>Sign in using Facebook</button>
      {
        user.isSignIn && <div><p>Welcome, {user.name}</p>
       <p>Your Email: {user.email}</p>
       <img src={user.photo} alt=""/>
       </div>
      }

      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign up</label>
      
      <form onSubmit={handleSubmit}>
        {newUser && <input name='name' type="text" onBlur={handleBlur} placeholder='Your name'/>}
        <br/>
      <input type="text" name='email' onBlur={handleBlur} placeholder='Your email address' required/>
      <br/>
      <input type="password" name="password" onBlur={handleBlur} placeholder='Your Password' required/>
      <br/>
      <input type="submit" value={newUser ? "Sign up" : "Sign in"}/>
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      {user.success && <p style={{color:'green'}}>User {newUser ?'Created' : 'Logged In' } Successfully</p>}
    </div>
  );
}

export default Login;
