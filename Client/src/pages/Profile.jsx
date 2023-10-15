import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { app } from '../firebase/firebase';

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

const Profile = () => {
  const fileRef = useRef(null);

  const { username, photo, email } = useSelector((state) => {
    return state.user.currentUser;
  });

  const [percent, setPercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null); // Initialize as null

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

  return (
    <>
      <Navbar />
      <div className='profile'>
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
          <p>Some Error Occurred</p>
        ) : percent == 100 ? (
          <p style={{ color: 'green' }}>Upload Complete</p>
        ) : percent == 0 ? (
          ''
        ) : (
          <p>{percent} % Complete</p>
        )}
        <h3>Username: {username}</h3>
        <h3>Email: {email}</h3>
        <button>Update Password</button>
        <div className='profile-danger'>
          <button>Delete Account</button>
          <button>Sign Out</button>
        </div>
      </div>
    </>
  );
};

export default Profile;
