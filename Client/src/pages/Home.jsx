import React from 'react'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <>
    <Navbar />
    <div className='home'>
    <p><strong>Effortless Authentication:</strong>
      Our platform offers a hassle-free and user-friendly authentication process. With Google authentication, users can access our services without the need for time-consuming manual registration. This not only simplifies the user experience but also saves valuable time. Say goodbye to long and tedious registration forms, and welcome a more convenient way to access our platform.

      </p>
      <p><strong>Seamless Integration:</strong>
        We've seamlessly integrated Google authentication into our application, creating a user experience that's both efficient and straightforward. Users can effortlessly sign in using their Google accounts, providing a quick and secure entry point to our services. This integration enhances user engagement and ensures that your experience with our app is as smooth as possible.</p>
      <p><strong>Enhanced Security:</strong>
      Security is a top priority for us. By combining Google authentication with the power of React Redux, we've established robust security measures. Your data is well-protected, and our responsive interface guarantees a secure environment. Rest assured that your information is safe and sound while you enjoy a user-friendly experience. Your peace of mind is our commitment.
      </p>
    </div>
    </>
  )
}

export default Home