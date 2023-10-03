import React, { useLayoutEffect } from 'react';
import { DatePicker, Flex, Heading, NumberField, View } from "@adobe/react-spectrum";
import { Button } from "@adobe/react-spectrum";
import { Form, TextField, Picker, Item, Well, Divider } from "@adobe/react-spectrum";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TopNav from '../NavBars/TopNav';
import SideNav from '../NavBars/SideNav';
import {today} from '@internationalized/date';
import {getLocalTimeZone} from '@internationalized/date';
const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]

export default function CreateTransaction(){
    let date=new Date();

    const [form, setForm] = useState({
        description: '',
        sourceAccount: '',
        destAccount: '',
        date: new Date(),
        amount: 0,
        budget: 0,
        bills:0,
        type: ''
    });
    const navigate = useNavigate();
    useLayoutEffect(()=>{
        getBudgets();
        getBills();
    },[]);

    const [budgets, setBudgets] = useState([]);
    const [bills, setBills] = useState([]);

    const updateForm = (field, value) => {
      setForm((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

    let type={1:'Revenue', 2:'Expense', 3:'Transfer'}
    let options = [
        { id: 1, name: 'Revenue' },
        { id: 2, name: 'Expense' },
        { id: 3, name: 'Transfer' }
      ];

    async function getBudgets()
    {
        const jwtToken = localStorage.getItem("jwtToken");
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        await axios.post('http://localhost:8080/api/budgets/userBudgets', {email:localStorage.getItem("email")},{
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },}) 
        .then((response) => {
            setBudgets(response.data.budgets);
        })
        .catch((error) => {
            console.error(error);
        });
    }

    async function getBills()
    {
        const jwtToken = localStorage.getItem("jwtToken");
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        await axios.post('http://localhost:8080/api/bills/userBills', {email : localStorage.getItem("email")},{
            headers: {
            Authorization: `Bearer ${jwtToken}`,
            },
        }) 
        .then((response) => {
            
            setBills(response.data.bills);
        })
        .catch((error) => {
            console.error(error);
        });
    }


    async function addTransaction(e){
        e.preventDefault();
        const inputDate = new Date(form.date);
        const newTransaction={
            email: localStorage.getItem('email'),
            title: form.description,
            budget: parseInt(form.budget),
            bills: parseInt(form.bills),
            type: type[form.type],
            amount: form.amount,
            sourceAccount: form.sourceAccount,
            destAccount: form.destAccount,
            month: monthNames[date.getMonth()],
            date: `${inputDate.getDate()}-${inputDate.getMonth() + 1}-${inputDate.getFullYear()}`,
        }
        console.log(newTransaction);
        const jwtToken = localStorage.getItem("jwtToken");
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        await axios.post('http://localhost:8080/api/transactions/addTransaction', newTransaction,{
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
        })
        .then((response) => {
            console.log(response.data);
            if(form.type === 1){
                navigate("/revenue");
            }
            else if(form.type === 2){
            navigate("/expenses");
            }
            else{
                navigate("/transfers");
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    return (
        <>
        <Flex direction="column" gap="size-100" width={{XXS:'100%',XS:'100%',S:'100%',M:'100%',L:'100%'}}>
    <View> <TopNav/> </View>
    <Flex direction="row" gap="size-100" >
      <View width={{XXS:'20%',XS:'20%',S:'20%',M:'20%',L:250}}><SideNav/></View>
      <Flex direction="column" gap="size-300">
        <Well>
        <View width={950}>
        <Form aria-labelledby="label-3" method="post" onSubmit={addTransaction}>
            <Flex direction="column" gap="size-200" >
                <Heading level={5}>Transaction Information</Heading>
                <Divider marginBottom={25} size="S"/>
                <Flex direction="row" gap="size-100">
                    <View width={800}>
                        <TextField 
                            label="Description" 
                            value={form.description}
                            onChange={(value) => updateForm('description', value)} /> <br/><br/>
                        <TextField 
                            label="Source Account" 
                            value={form.sourceAccount}
                            onChange={(value) => updateForm('sourceAccount', value)} /><br/><br/>
                        <TextField 
                            label="Destination Account" 
                            value={form.destAccount}
                            onChange={(value) => updateForm('destAccount', value)} /><br/><br/>
                        <DatePicker 
                            label="Date" 
                            selectedDate={form.date}
                            onChange={(date) => updateForm('date', date)}
                            maxValue={today(getLocalTimeZone())}
                            isRequired/> <br/><br/>
                        <NumberField 
                            label="Amount" 
                            defaultValue={0} 
                            value={form.amount}
                            onChange={(value) => updateForm('amount', value)}
                            isRequired/> <br/><br/>
                    </View>
                    <View width={800}>
                    <Picker
                            label="Budget"
                            items={budgets}
                            selectedKey={form.budget}
                            onSelectionChange={(value) => updateForm('budget', value)}
                            >
                            {(item) =><Item key={item.id} >
                                        {item.category}
                                    </Item>}
                        </Picker> <br/><br/>

                        <Picker
                            label="Bill"
                            items={bills}
                            selectedKey={form.bills}
                            onSelectionChange={(value) => updateForm('bills', value)}
                            >
                            {(item) =><Item key={item.id} >
                                        {item.name}
                                    </Item>}
                        </Picker> <br/><br/>
                        <Picker
                            label="Type"
                            isRequired
                            items={options}
                            selectedKey={form.type}
                            onSelectionChange={(value) => updateForm('type', value)}>
                            {(item) => <Item>{item.name}</Item>}
                        </Picker>  
                    </View>
                </Flex>
                <View><Button variant="accent" type="submit">Submit</Button></View>
            </Flex> 
        </Form>
        </View> </Well>
      </Flex>
      
    </Flex>
  </Flex>
        
    </>
    )
}