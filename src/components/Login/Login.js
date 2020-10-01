// import React, { useState } from 'react';


// import * as firebase from "firebase/app";
// import "firebase/auth";
// import firebaseConfig from './firebase.config';
// import { useContext } from 'react';
// import { UserContext } from '../../App';
// import { useHistory, useLocation } from 'react-router-dom';

// firebase.initializeApp(firebaseConfig);

// function Login() {
//   const [newUser, setNewUser] = useState(false);
//   const [user, setUser] = useState({
//     isSignIn: false,
    
//     name:'',
//     email:'',
//     password:'',
//     photo:''
//   });

//   const [loggedInUser, setLoggedInUser] = useContext(UserContext);
//   const history = useHistory();
//   const location = useLocation();
//   let { from } = location.state || { from: { pathname: "/" } };

//   const provider = new firebase.auth.GoogleAuthProvider();
//   const handleSignIn = () => {
//     firebase.auth().signInWithPopup(provider)
//     .then(res => {
//       const {displayName, photoURL, email} = res.user;
//       const signInUser = {
//         isSignIn: true,
//         name: displayName,
//         email: email,
//         photo: photoURL
//       }
//       setUser(signInUser);
//       //console.log(displayName,email,photoURL);
//     })
//     .catch(err=> {
//       console.log(err);
//       console.log(err.message);
//     })
//   }

//   const handleSignOut = () => {
//     firebase.auth ().signOut()
//     .then(res => {
//      const signedOutUser = {
//        isSignIn: false,
//        name:'',
//        photo:'',
//        email:'',
//        error: '',
//        success: false
       

//      }
//      setUser(signedOutUser);
//      console.log(res);
//     })
//     .catch(err => {
//      // an error happened.
//     });
//   }
//   const handleBlur = (e) => {
//      let isFieldValid = true;
//      if(e.target.name === 'email'){
//        const isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
       
//      }
//      if(e.target.name === 'password'){
//         const isPasswordValid = e.target.value.length > 6;
//         const passwordHasNumber = /\d{1}./.test(e.target.value);
//         isFieldValid = isPasswordValid && passwordHasNumber
//      }
//      if(isFieldValid){
//        const newUserInfo = {...user};
//        newUserInfo[e.target.name] = e.target.value;
//        setUser(newUserInfo);
//      }
//   }

//   const handleSubmit = (e) => {
//     //console.log(user.email, user.password)
//     if(newUser && user.email && user.password){
//       firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
//       .then(res=>{
//         console.log(res)
//         const newUserInfo = {...user};
//         newUserInfo.error = '';
//         newUserInfo.success = true;
//         setUser(newUserInfo);
//         updateUserName(user.name);
//       })
//       .catch(error => {
        
//         // Handle Errors here.
//         const newUserInfo = {...user};
//         newUserInfo.error = error.message;
//         newUserInfo.success = false;
//         setUser(newUserInfo);
        
//       });
//     }
//     if(!newUser && user.email && user.password){
//       firebase.auth().signInWithEmailAndPassword(user.email, user.password)
//       .then(res => {
//         const newUserInfo = {...user};
//         newUserInfo.error = '';
//         newUserInfo.success = true;
//         setUser(newUserInfo);
//         setLoggedInUser(newUserInfo);
//         history.replace(from);
//         console.log('sign in user info', res.user);
//       })
//       .catch(function(error) {
//         const newUserInfo = {...user};
//         newUserInfo.error = error.message;
//         newUserInfo.success = false;
//         setUser(newUserInfo);
        
//       });
//     }


//     e.preventDefault();
//   }


//   const updateUserName = name => {
//       const user = firebase.auth().currentUser;

//       user.updateProfile({
//         displayName: name
//         }).then(function() {
//           console.log('user name  Update successfully')
//       }).catch(function(error) {
//         console.log(error)
// });
//   }

//   return (
//     <div style={{textAlign:'center'}} >
//      {
//        user.isSignIn ? <button onClick={handleSignOut}>Sign out</button>:
//        <button onClick={handleSignIn}>Sign in</button>
//      }
//      <br/> 
//      <button>Sign in using Facebook</button>
//       {
//         user.isSignIn && <div><p>Welcome, {user.name}</p>
//        <p>Your Email: {user.email}</p>
//        <img src={user.photo} alt=""/>
//        </div>
//       }

//       <h1>Our own Authentication</h1>
//       <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id=""/>
//       <label htmlFor="newUser">New User Sign up</label>
      
//       <form onSubmit={handleSubmit}>
//         {newUser && <input name='name' type="text" onBlur={handleBlur} placeholder='Your name'/>}
//         <br/>
//       <input type="text" name='email' onBlur={handleBlur} placeholder='Your email address' required/>
//       <br/>
//       <input type="password" name="password" onBlur={handleBlur} placeholder='Your Password' required/>
//       <br/>
//       <input type="submit" value={newUser ? "Sign up" : "Sign in"}/>
//       </form>
//       <p style={{color:'red'}}>{user.error}</p>
//       {user.success && <p style={{color:'green'}}>User {newUser ?'Created' : 'Logged In' } Successfully</p>}
//     </div>
//   );
// }

// export default Login;




import React, { useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { initializeLoginFramework, handleGoogleSignIn, handleSignOut, handleFbSignIn, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './loginManager';



function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  });

  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser ] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
      handleGoogleSignIn()
      .then(res => {
        handleResponse(res, true);
      })
  }

  const fbSignIn = () => {
      handleFbSignIn()
      .then(res => {
        handleResponse(res, true);
      })

  }

  const signOut = () => {
      handleSignOut()
      .then(res => {
          handleResponse(res, false);
      })
  }

  const handleResponse = (res, redirect) =>{
    setUser(res);
    setLoggedInUser(res);
    if(redirect){
        history.replace(from);
    }
  }

  const handleBlur = (e) => {
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber =  /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      createUserWithEmailAndPassword(user.name, user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }

    if(!newUser && user.email && user.password){
      signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }
    e.preventDefault();
  }



  return (
    <div style={{textAlign: 'center'}}>
      { user.isSignedIn ? <button onClick={signOut}>Sign Out</button> :
        <button onClick={googleSignIn}>Sign In</button>
      }
      <br/>
      <button onClick={fbSignIn}>Sign in using Facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}!</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }

      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your name"/>}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign up' : 'Sign in'}/>
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      { user.success && <p style={{color: 'green'}}>User { newUser ? 'created' : 'Logged In'} successfully</p>}
    </div>
  );
}

export default Login;