import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { app } from '../firebase/firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { updateSucess } from '../store';
import { deleteSuccess, signoutSuccess } from '../store/slices/userSlice';

const marginTop = {
  marginTop: "0"
}

const Profile = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fileRef = useRef(null);

  const { currentUser } = useSelector((state) => {
    console.log("state", state)
    return state.user;
  });

  
  useEffect(() => {
    if(currentUser == null || currentUser == undefined) {
      navigate("/")
    }
  },[])


  const [percent, setPercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null); // Initialize as null

  console.log("formData", formData)

  // Add a dependency array to the useEffect hook so that it only runs when the image state changes.
  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

  const handleImageUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercent(Math.floor(progress));
      },
      (error) => {
        setImageError(true);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData({ ...formData, photo: downloadURL });
        } catch (error) {
          console.log(error);
        }
      }
    );
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async (e, _id) => {
    e.preventDefault()
    try {
      console.log("formData", formData)
      const response = await fetch('http://localhost:3000/api/user/update/' + _id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData
        })
      })
      const data = await response.json()
      console.log("data", data)
      if(response.ok){
        dispatch(updateSucess(data))
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  const handleFormDataChange = async (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleDelete = async (id) => {
    console.log("id", id)
    try {
      const response = await fetch("http://localhost:3000/api/user/delete/" + id, {
        method: "DELETE",
        credentials: "include"
      })
      const data = await response.json()
      if(response.ok) {
        dispatch(deleteSuccess())
        navigate("/register")
        console.log("data", data)
      }
    } catch (error) {
      
    }
  }

  const handleSignOut = async (id) => {
    console.log("handleSignout")
    try {
      const response =await fetch("http://localhost:3000/api/user/signout")
      const data = await response.json()
      if(response.ok) {
        navigate("/register")
        dispatch(signoutSuccess())
        console.log("data", data)
      }
    } catch (error) {
      
    }
  }

  if(currentUser != null) {
    const { username, email, _id, mobile, photo } = currentUser
    return (
      <>
        <Navbar />
        <form className='profile' onSubmit={(e) => handleSubmit(e,_id)}>
          <h1>Profile</h1>
          <input
            type="file"
            name=""
            id=""
            ref={fileRef}
            hidden={true}
            accept='image/*'
            onChange={handleImageChange}
          />
          <img
            src={formData.photo || photo}
            alt="User Photo"
            onClick={() => fileRef.current.click()}
          />
          {imageError ? (
            <p style={marginTop}>Some Error Occurred</p>
          ) : percent == 100 ? (
            <p style={{ color: 'green', marginTop: "0" } }>Upload Complete</p>
          ) : percent == 0 ? (
            ''
          ) : (
            <p style={marginTop}>{percent} % Complete</p>
          )}
          <div className='profile-credentials'>
            <label htmlFor="usenrame"><strong>Username : </strong></label>
            <input type="text" name="username" id="username" defaultValue={`${username}`} onChange={handleFormDataChange} />
          </div>
          <div className='profile-credentials'>
            <label htmlFor="mobile"><strong>Mobile : </strong></label>
            <input type="text" name="mobile" id="mobile" defaultValue={`${mobile}`} onChange={handleFormDataChange} />
          </div>
          <div className='profile-credentials'>
            <label htmlFor="email"><strong>Email : </strong></label>
            <input type="email" name="email" id="email" value={email} readOnly title='Sorry, email update not possible' />
          </div>
          <div className='profile-credentials'>
            <label htmlFor="password"><strong>Password : </strong></label>
            <input type="password" name="password" id="password" min={8} onChange={handleFormDataChange} />
          </div>
          <button type='submit'>Update</button>
          <div className='profile-danger'>
            <button type='button' onClick={() => handleDelete(_id)}>Delete Account</button>
            <button type='button' onClick={() => handleSignOut(_id)}>Sign Out</button>
          </div>
        </form>
      </>
    );
  }

};

export default Profile;
