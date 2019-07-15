import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({user}) => {

  const initialInfo = {}
  const [userInfo, setUserInfo] = useState(initialInfo);



  useEffect(()=>{
  },
  [userInfo]
  )
  return(
    <div>
      <div className="profile-container">
        <div className="profile-wrapper">
          <div className="profile-header">
            <h1>MI PERFIL</h1>
          </div>
          <p>nombre: {user.name}</p>
          <p>apellidos: {user.surname}</p>
          <p>teléfono: {user.phone}</p>
        </div>
      </div>
    </div>
  )


}

export default Profile;
