import { TextField, View, Flex, Button, Form, NumberField, Heading, Well, Text } from "@adobe/react-spectrum";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './GettingStarted.css'
import { useState } from 'react';
export default function GettingStarted() {
    const [form,setForm]=useState({
        bankName: '',
        balance: 0
    });
    let navigate=useNavigate();
    const updateForm = (field, value) => {
        setForm((prevData) => ({
          ...prevData,
          [field]: value,
        }));
      };

      async function updateBankDetails(event) {
        event.preventDefault();
        const jwtToken = localStorage.getItem("jwtToken");
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        //adds user bank details to the database
        await axios.post('http://localhost:8080/api/gettingStarted/updateDetails', {email:localStorage.getItem("email"),bankName:form.bankName,bankBalance:form.balance}, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
        })
        .then((response) => {
            console.log(response);
            navigate("/dashboard");
        })
        .catch((error) => {
            console.log(error)
        });
    }
    

    return  <div style={{padding: '30px' }} > 
    <Heading level={2} marginStart={50}>   Welcome to the Finance Manager</Heading>
    <Form onSubmit={updateBankDetails}>
        <Well UNSAFE_className='card' width={900} height={300} marginTop={30} marginStart={50} >
            <Heading level={4} style={{ whiteSpace: 'nowrap', marginLeft: '25px', marginTop: '10px', color: 'white' }}>Let's get started</Heading>

            <Flex direction="column">
                <View> <Text>To get started, please enter your bank name and the balance of your main checking account.</Text></View>
                <View>
            <TextField 
                label="Bank Name"  
                style={{ display: 'block', width: '100', }} 
                value={form.bankName}
                onChange={(value) => updateForm('bankName', value)}
                labelStyle={{ fontSize: '30px' }} /><br /><br />
            <NumberField 
                label="Account Balance"  
                value={form.balance}
                onChange={(value) => updateForm('balance', value)}
                style={{ display: 'block' }} />
            </View>
            <View paddingTop="20px"  paddingStart="2px" >
            <Button variant="accent" marginBottom={20} type='submit'>Submit</Button>
            </View>
            </Flex>
        </Well>
    </Form>
</div>
}