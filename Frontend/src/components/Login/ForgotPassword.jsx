import { Button, Flex, TextField } from "@adobe/react-spectrum";
import { Provider } from "@adobe/react-spectrum";
import {theme} from '@react-spectrum/theme-default';
import { Link } from "@adobe/react-spectrum";
import { Link as RouterLink}  from "react-router-dom";
import { useState } from "react";
import { faEnvelope,faCheck, faEye} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import { useReducer } from "react";
import LoginReducer from "../Reducers/LoginReducer";
import { Heading } from "@adobe/react-spectrum";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const initialState=
{
    header:'',
    message:'',
    success:false
}



export default function ForgotPassword()
{
    let [email,setEmail]=useState();
    let [password,setPassword]=useState();
    let [confirmPassword,setConfirmPassword]=useState();
    let emailValid=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
    let navigate=useNavigate();
    let [state,dispatch]=useReducer(LoginReducer,initialState)
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    async function validateCredentials(a)
    {
        if(emailValid)
        {
            dispatch({type:'CLEAR_ERROR'})
            if(password===undefined || confirmPassword===undefined)
            {
                dispatch({type:'DISPLAY_ERROR',payload:{header:"Invalid Password",message:"Password fields cannot be empty"}});
                return;
            }
            let passwordInvalid=/\s/.test(password)
            if(passwordInvalid)
            {
                dispatch({type:'DISPLAY_ERROR',payload:{header:"Invalid Password",message:"Enter Valid Password"}});
                return;
            }
            if(confirmPassword!==password)
            {
                dispatch({type:'DISPLAY_ERROR',payload:{header:"Error",message:"Passwords don't match"}});
                return;
            }
            
            axios.defaults.headers.common['Content-Type'] = 'application/json';
            await axios.put('http://localhost:8080/api/auth/resetPassword', {email:email,newPassword:password}) 
            .then((response) => {
                dispatch({type:'SUCCESS',payload:{header:"Success",message:"Password Reset"}});
                console.log(response);
                navigate("/");
            })
            .catch((error) => {
                dispatch({type:'DISPLAY_ERROR',payload:{header:"Error",message:error.response.data.message}});
            });
        }
        else
        {
            dispatch({type:'DISPLAY_ERROR',payload:{header:"Invalid Email",message:"Enter Valid Email Address"}});
        }
    }
    function displayMessage()
    {
        if(state.message!=='' && state.success===false)
        {
            return <ErrorMessage message={state.message} header={state.header} />
        }
        else if(state.message!=='' && state.success===true)
        {
            return <SuccessMessage message={state.message} header={state.header} />
        }

    }

    return (
        <div className="form">
          <Provider theme={theme} width={450} UNSAFE_className="provider" >
            <Flex direction="column"  gap="size-100" alignItems='center' >
            <Heading width={300} marginBottom={20} level={1}>Reset Password</Heading>
                {
                    displayMessage()
                }
                <Flex width={300} gap="size-100" direction="row"> 
                <TextField  label="Email" width={300} value={email||''} onChange={setEmail}  validationState={emailValid?'valid':'invalid'}/>
                <FontAwesomeIcon style={{marginTop:"25px"}}icon={faEnvelope} size="2x"></FontAwesomeIcon>
                </Flex>

                <Flex width={300} gap="size-100" direction="row"> 
                <TextField width={300} label="New Password" type={showPassword ? 'text' : 'password'} onChange={setPassword} description="Password cannot have spaces"/>
                <FontAwesomeIcon className="show" style={{marginTop:"25px"}}icon={faEye} size="2x" onClick={handleTogglePassword}></FontAwesomeIcon>
                </Flex>

                <Flex width={300} gap="size-100" direction="row"> 
                <TextField width={300} marginBottom={25} label="Re-enter New Password" type={showPassword ? 'text' : 'password'} onChange={setConfirmPassword} description="Password cannot have spaces"/>
                <FontAwesomeIcon style={{marginTop:"25px"}}icon={faCheck} size="2x"></FontAwesomeIcon>
                </Flex>
                <Button width={300} variant="accent" onPress={()=>validateCredentials()}>Submit</Button>
                <Link width={300}>
                    <RouterLink to='/'>Back</RouterLink>
                </Link>
            </Flex>
          </Provider>
          </div>
      );
}