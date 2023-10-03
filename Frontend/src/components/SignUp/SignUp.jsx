import { Button, Flex, TextField } from "@adobe/react-spectrum";
import { Provider } from "@adobe/react-spectrum";
import {theme} from '@react-spectrum/theme-default';
import { Link } from "@adobe/react-spectrum";
import { Link as RouterLink}  from "react-router-dom";
import { useState } from "react";
import { faEnvelope ,faUser,faCheck, faEye} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SuccessMessage from "../Login/SuccessMessage";
import { useReducer } from "react";
import LoginReducer from "../Reducers/LoginReducer";
import ErrorMessage from "../Login/ErrorMessage";
import { Heading } from "@adobe/react-spectrum";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import validator from 'validator';

const initialState=
{
    message:'',
    success:false
}


export default function SignUp()
{
    let [name,setName]=useState('');
    let [email,setEmail]=useState();
    let [password,setPassword]=useState();
    let [confirmPassword,setConfirmPassword]=useState();
    let emailValid=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
    let nameValid=/^[a-zA-Z\s]*$/.test(name) && !/^\s+/.test(name) && !/^$/.test(name) && name.length<25;

    let [state,dispatch]=useReducer(LoginReducer,initialState)
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); 

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };


    const validateCredentials = async(a) =>
    {
        if(!nameValid)
        {
            dispatch({type:'DISPLAY_ERROR',payload:{header:"Error",message:"Enter Valid Name"}});
            return;
        }
        dispatch({type:'CLEAR_ERROR'})
        if(emailValid)
        {
            dispatch({type:'CLEAR_ERROR'})
            let passwordInvalid=/\s/.test(password)
            if (! validator.isStrongPassword(password, {
                minLength: 8, minLowercase: 1,
                minUppercase: 1, minNumbers: 1, minSymbols: 1
            })) {
                dispatch({type:'DISPLAY_ERROR',payload:{header:"Weak Password",message:"Password must be 8 characters long and with atleast 1 uppercase, lowecase, digit ans special character"}});
                return;
            } 
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
            await axios.post('http://localhost:8080/api/auth/signup', {name:name,email:email,password:password}) 
            .then((response) => {
                localStorage.setItem('jwtToken', response.data.token);
                localStorage.setItem('email',email);
               navigate("/gettingStarted")
            })
            .catch((error) => {
                dispatch({type:'DISPLAY_ERROR',payload:{header:"Error",message:error.response.data.message}})
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
            return <ErrorMessage message={state.message} header={state.header}/>
        }
        else if(state.message!=='' && state.success===true)
        {
            return <SuccessMessage message={state.message} header={state.header}/>
        }
    }

    return (
        <div className="form">
          <Provider theme={theme} width={450} UNSAFE_className="provider">
            <Flex direction="column"  gap="size-100" alignItems='center' >
                <Heading width={300} marginBottom={5} level={1}>Register</Heading>
                {
                    displayMessage()
                }
                <Flex width={300} gap="size-100" direction="row"> 
                <TextField  label="Name" width={300}  onChange={setName} value={name||''} validationState={nameValid?'valid':'invalid'} isRequired/>
                <FontAwesomeIcon style={{marginTop:"25px"}}icon={faUser} size="2x"></FontAwesomeIcon>
                </Flex>   
                <Flex width={300} gap="size-100" direction="row"> 
                <TextField  label="Email" width={300} value={email||''} onChange={setEmail}  validationState={emailValid?'valid':'invalid'}/>
                <FontAwesomeIcon style={{marginTop:"25px"}}icon={faEnvelope} size="2x"></FontAwesomeIcon>
                </Flex>

                <Flex width={300} gap="size-100" direction="row"> 
                <TextField width={300} label="Password" type={showPassword ? 'text' : 'password'} onChange={setPassword } description="Password cannot have spaces" shi/>
                <FontAwesomeIcon className="show" style={{marginTop:"25px"}}icon={faEye} size="2x" onClick={handleTogglePassword}></FontAwesomeIcon>
                </Flex>

                <Flex width={300} gap="size-100" direction="row"> 
                <TextField width={300} marginBottom={15} label="Re-enter Password" type={showPassword ? 'text' : 'password'} onChange={setConfirmPassword} description="Password cannot have spaces"/>
                <FontAwesomeIcon style={{marginTop:"25px"}}icon={faCheck} size="2x"></FontAwesomeIcon>
                </Flex>

                <Button width={300} variant="accent" onPress={()=>validateCredentials()}>Sign Up</Button>
                <Link width={300}>
                    <RouterLink to='/'>Back</RouterLink>
                </Link>
            </Flex>
          </Provider>
          </div>
      );
}