import React from 'react';
import { Flex, Heading, NumberField, TextArea, View } from "@adobe/react-spectrum";
import { Button } from "@adobe/react-spectrum";
import { Form, TextField, Picker, Item, DatePicker, Well } from "@adobe/react-spectrum";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TopNav from '../NavBars/TopNav';
import SideNav from '../NavBars/SideNav';

export default function CreateBill(){
    const [form, setForm]=useState({
        name: '',
        amount:0,
        date:new Date(),
        repeats:'',
        endDate:new Date(),
        extensionDate:new Date(),
        notes:''
    });
    const navigate = useNavigate(); 
    const updateForm = (field, value) => {
        setForm((prevData) => ({
          ...prevData,
          [field]: value,
        }));
      };
      
        

    async function addBill(e){
        e.preventDefault();
        const inputDate = new Date(form.date);
        const jwtToken = localStorage.getItem("jwtToken");
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        const newBill =  {
            name: form.name,
            billDate: `${inputDate.getDate()}-${inputDate.getMonth() + 1}-${inputDate.getFullYear()}`,
            amount: form.amount,
            isPaid: false,
            repeats: form.repeats,
            email: localStorage.getItem('email')
        };
        console.log(newBill);
        //add new bill
        await axios.post('http://localhost:8080/api/bills/addBill', newBill,{
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
        }) 
        .then((response) => {
            console.log(response.data);
            navigate("/bills"); 
        })
        .catch((error) => {
            console.error(error);
        });
    }
    
    let options = [
        { id: 1, name: 'Monthly' },
        { id: 2, name: 'Half Yearly' },
        { id: 3, name: 'Yearly' }
      ];
    return (
        <>
        <Flex direction="column" gap="size-100" width={{XXS:'100%',XS:'100%',S:'100%',M:'100%',L:'100%'}}>
            <View> <TopNav/> </View>
            <Flex direction="row" gap="size-100" >
                <View width={{XXS:'20%',XS:'20%',S:'20%',M:'20%',L:250}}><SideNav/></View>
                <Flex direction="column" gap="size-300" width={{XXS:'70%',XS:'70%',S:'70%',M:'70%',L:'70%'}}>
                    <Well> <View>
                    <Form aria-labelledby="label-3" method="post" onSubmit={addBill}>
                    <Flex direction="column" gap="size-150" >
                        <Flex direction="row" gap="size-100">
                           <Well><View width={450}>
                            <h3 id="label-3">Mandatory Fields</h3>
                            <hr></hr>
                                <TextField 
                                    label="Name" 
                                    value={form.name}
                                    isRequired
                                    onChange={(value) => updateForm('name', value)}
                                /> <br/><br/>
                                <NumberField 
                                    label="Bill Amount" 
                                    defaultValue={0} 
                                    value={form.amount}
                                    onChange={(value) => updateForm('amount', value)} 
                                    isRequired/><br/><br/>
                                <DatePicker
                                    label="Bill Date" 
                                    selectedDate={form.date}
                                    onChange={(value) => updateForm('date', value)}
                                    placeholderText="Date"
                                    dateFormat="dd-MM-yyyy"
                                    isRequired
                                /> <br/><br/>
                                <Picker
                                    label="Repeats"
                                    items={options}
                                    selectedKey={form.repeats}
                                    onSelectionChange={(value) => updateForm('repeats', value)}
                                    isRequired>
                                {(item) => <Item>{item.name}</Item>}
                                </Picker> <br/><br/>
                                
                            
                        </View></Well>
                        <Well><View width={450}>
                            <Heading level={3}>Optional Fields</Heading>
                            <hr></hr>
                            <DatePicker
                                label="End Date" 
                                selectedDate={form.endDate}
                                onChange={(value) => updateForm('endDate', value)}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="Select End Date"
                            /> <br/><br/>
                            <DatePicker
                                label="Extension Date" 
                                selectedDate={form.extensionDate}
                                onChange={(value) => updateForm('extensionDate', value)}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="Select Extension Date"
                            /><br/><br/>
                            <TextArea 
                                label="Notes"
                                value={form.notes} 
                                onChange={(value) => updateForm('notes', value)}/> <br/>
                        </View></Well>
                    </Flex>
                    <View><Button variant="accent" type="submit" >Submit Bill</Button></View>
                    </Flex> 
                </Form>
                    </View></Well>
                </Flex>
            </Flex>
        </Flex>
    </>
    )
}