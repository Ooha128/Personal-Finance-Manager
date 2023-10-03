import { Button, Flex, TextField, Text } from "@adobe/react-spectrum";
import { Provider } from "@adobe/react-spectrum";
import {theme} from '@react-spectrum/theme-default';
import { Checkbox } from "@adobe/react-spectrum";
import { Link } from "@adobe/react-spectrum";
import { Link as RouterLink, useNavigate }  from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope,faEye} from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import { useReducer } from "react";
import LoginReducer from "../Reducers/LoginReducer";
import ErrorMessage from "./ErrorMessage";
import { Heading } from "@adobe/react-spectrum";

const initialState=
{
    message:'',
    success:false
}

export default function SignIn(props)
{
    let [email,setEmail]=useState();
    let [password,setPassword]=useState();
    let emailValid=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
    let navigate=useNavigate();
    let [state,dispatch]=useReducer(LoginReducer,initialState)
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const validateCredentials = async(a)=>
    {
        if(emailValid)
        {
            dispatch({type:'CLEAR_ERROR'})
                axios.defaults.headers.common['Content-Type'] = 'application/json';                 
                await axios.post('http://localhost:8080/api/auth/signin', {email:email,password:password}) 
                .then((response) => {
                    // console.log(response.data.token)
                    localStorage.setItem('jwtToken', response.data.token);
                    localStorage.setItem('email', email);
                    if(response.data.hasAccount) navigate("/dashboard")
                    else navigate("/gettingStarted")
                })
                .catch((error) => {
                    dispatch({type:'DISPLAY_ERROR',payload:{header:"Error",message:error.response.data.message}})
                });
        }
        else
        {
            dispatch({type:'DISPLAY_ERROR',payload:{header:"Invalid Email",message:"Enter Valid Email Address"}})
        }
    }

    function displayMessage()
    {
        if(state.message!=='')
        {
            return <ErrorMessage header={state.header} message={state.message} />
        }
    }
    return (
        <div className="form">
          <Provider theme={theme} width={400}  UNSAFE_className="provider">
            <Flex direction="column"  gap="size-100" alignItems='center' >
                <Heading width={300}  marginBottom={20} level={1}>Login</Heading>
                {
                    displayMessage()
                }
                {(props.message!=="")?<Text>{props.message}</Text>:<div></div>}
                
                <Flex width={300} gap="size-100" direction="row">
                <TextField label="Email" width={300} value={email||''} onChange={setEmail}  validationState={emailValid?'valid':'invalid'} />
                <FontAwesomeIcon style={{marginTop:"25px"}} icon={faEnvelope} size="2x"></FontAwesomeIcon>
                </Flex>

                <Flex width={300} gap="size-100" direction="row">
                <TextField width={300} marginBottom={10} label="Password" type={showPassword ? 'text' : 'password'} onChange={setPassword}/>
                <FontAwesomeIcon className="show" style={{marginTop:"25px"}}icon={faEye} size="2x" onClick={handleTogglePassword}></FontAwesomeIcon>
                </Flex>
                <Checkbox width={300} marginBottom={20}>Remember me</Checkbox>
                <Button width={300}  variant="accent" onPress={()=>validateCredentials()}>Login</Button>
                <Link width={300}>
                    <RouterLink to='/forgotPassword'>Forgot Password?</RouterLink>
                </Link>
                <Link width={300}>
                    <RouterLink to='/register'>Register</RouterLink>
                </Link>
            </Flex>
          </Provider>
          </div>
      );
}