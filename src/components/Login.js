import React, {useState} from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

const Login = (props) => {  

  const [state, setState] = useState({username: "", password: ""});

  const handleChange = ({name, value}) => {
    setState({...state, [name]: value})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://192.168.1.51:3010/api/auth/login', state,{
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
        },
      withCredentials: true // <= that's what changed
    })
    .then( result => console.log(result))
    .then( props.history.push('/appointments'))
    .catch( err => console.error('there was an error posting your info', err));
  }

  return (
    <div className="home-container">
      <h1 className="main titile">Log in as a user</h1>

      <form 
        className="signup-guest"
        onSubmit={(e) => handleSubmit(e)}
      >

        <label htmlFor="username">username</label>
        <input 
          name= "username" 
          type= "text"
          onChange= {(e) => handleChange(e.target)}
          value= {state.username}
        />
        <br/>

        <label htmlFor="password">password</label>
        <input 
          name="password" 
          type="text"
          onChange= {(e) => handleChange(e.target)}
          value ={state.password}
        />
        <br/>

        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}
export default withRouter(Login)
