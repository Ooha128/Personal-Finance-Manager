import React from 'react';
import { Flex, Heading, NumberField, TextArea, View } from "@adobe/react-spectrum";
import { Button } from "@adobe/react-spectrum";
import { Form, TextField, Picker, Item, DatePicker, Well } from "@adobe/react-spectrum";
import axios from "axios";
import { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from 'react-router-dom';
import SideNav from '../NavBars/SideNav';
import TopNav from '../NavBars/TopNav';
import { useNavigate } from 'react-router-dom';

export default function EditBill(){
    const navigate = useNavigate(); 
    const params = useParams();
    const [billId,setBillId] = useState(0);
    const [form, setForm]=useState({
        name: '',
        amount:0,
        billDate:new Date(),
        repeats:'',
        dueDate: new Date(),
        paid: false,
        email: localStorage.getItem("email")
    });

    useLayoutEffect(()=>{
        const i = params.id.toString();
        setBillId(i);
     },[])

    const updateForm = (field, value) => {
        setForm((prevData) => ({
          ...prevData,
          [field]: value,
        }));
      };
      
     

      useEffect(() => {
        const fetchData = async () => {
            const jwtToken = localStorage.getItem("jwtToken");
            //fetches bill with id 
            await axios.get(`http://localhost:8080/api/bills/${billId}`,{
                headers: {
                Authorization: `Bearer ${jwtToken}`,
                },
            })
                .then((response) => {
                    // console.log(response.data.bill)
                    setForm(response.data.bill);
                })
                .catch((error) => {
                    console.error(error);
                });
          };
      
          fetchData();
        
    }, [billId]);

    async function updateBill(e) {
        e.preventDefault();
        const jwtToken = localStorage.getItem("jwtToken");
        const inputDate = new Date(form.date);
        const updatedBill =  {
            name: form.name,
            billDate: `${inputDate.getDate()}-${inputDate.getMonth() + 1}-${inputDate.getFullYear()}`,
            amount: form.amount,
            isPaid: form.isPaid,
            repeats: form.repeats,
            email: localStorage.getItem('email')
        };
        console.log(updatedBill);
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        //updates the existing bill with new data
        await axios.put(`http://localhost:8080/api/bills/updateBill`, {id:billId,bill:updatedBill},{
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
            <Flex direction="column" gap="size-100">
                <View> <TopNav/> </View>
                <Flex direction="row" gap="size-100" >
                <View><SideNav/></View>
                    <Flex direction="column" gap="size-300" width={{XXS:'70%',XS:'70%',S:'70%',M:'70%',L:'70%'}}>
                        <Well> <View >
                        <Form aria-labelledby="label-3" method="post" onSubmit={updateBill}>
                    <Flex direction="column" gap="size-150" >
                        <Flex direction="row" gap="size-100">
                            <Well><View width="50%">
                            <h3 id="label-3">Mandatory Fields</h3>
                            <hr></hr>
                                <TextField 
                                    label="Name" 
                                    value={form.name}
                                    isRequired
                                    onChange={(value) => updateForm('name', value)}
                                /> <br/>
                                <NumberField 
                                    label="Bill Amount" 
                                    defaultValue={0} 
                                    value={form.amount}
                                    onChange={(value) => updateForm('amount', value)} 
                                    isRequired/><br/>
                                <DatePicker
                                    label="Bill Date" 
                                    selectedDate={form.billDate}
                                    onChange={(value) => updateForm('date', value)}
                                    placeholderText="Date"
                                /> <br/>
                                <Picker
                                    label="Repeats"
                                    items={options}
                                    selectedKey={form.repeats}
                                    onSelectionChange={(value) => updateForm('repeats', value)}
                                    isRequired>
                                {(item) => <Item>{item.name}</Item>}
                                </Picker>
                            
                        </View></Well>
                        <Well><View width="50%">
                            <Heading level={3}>Optional Fields</Heading>
                            <hr></hr>
                            <DatePicker
                                label="End Date" 
                                selectedDate={form.endDate}
                                onChange={(value) => updateForm('endDate', value)}
                                placeholderText="Select End Date"
                            /> <br/>
                            <DatePicker
                                label="Extension Date" 
                                selectedDate={form.extensionDate}
                                onChange={(value) => updateForm('extensionDate', value)}
                                placeholderText="Select Extension Date"
                            /><br/>
                            <TextArea 
                                label="Notes"
                                value={form.notes} 
                                onChange={(value) => updateForm('notes', value)}/> <br/>
                        </View></Well>
                    </Flex>
                    <View><Button variant="accent" type="submit" >Update Bill</Button></View>
                    </Flex> 
        </Form>
                        </View></Well>
                    </Flex>
                </Flex>
            </Flex>
                
    </>
    )
}