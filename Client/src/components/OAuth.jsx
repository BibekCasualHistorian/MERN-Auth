import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase/firebase.jsx'
import { useDispatch } from 'react-redux'
import localStorage from 'redux-persist/es/storage'

const OAuth = () => {

    const dispatch = useDispatch()

    const handleGoogleOAuth = async (e) => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            
            console.log("result", result)

            // in result we have everything required so make OAuth 
            // we only get popup with 2 or more gmail. if less google with forware with that gmail

            const response = await fetch("http://localhost:3000/api/user/google-auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            })

            const data = await response.json()
            console.log("data", data)

            if(response.ok) {
                dispatch(localStorage(data))
                console.log("sign in through GoogleAuth", data)
            }

        } catch (error) {
          console.log("error in google Auth", error)  
        }
    }

    const style = {
        "cursor": "pointer",
        "backgroundColor": "red",
        "color": "white",
        "padding": "1em",
        "textAlign": "center",
        "display": "flex",
        "justifyContent": "center",
        "width": "90%",
        "border": "none",
        "borderRadius": "20px",
        "marginBottom": "10px"
    }
  return (
    <button type='button' onClick={handleGoogleOAuth} style={style}>Continue with Google</button>
  )
}

export default OAuth