import React from 'react';
import { Flex, Heading, NumberField, Well, View } from "@adobe/react-spectrum";
import { Button } from "@adobe/react-spectrum";
import { Form, TextField, Picker, Item } from "@adobe/react-spectrum";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TopNav from '../NavBars/TopNav';
import SideNav from '../NavBars/SideNav';
const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]
export default function CreateBudget(){
    let date=new Date();
    const [form, setForm] = useState({
        name: '',
        amount: 0,
        spent: 0,
        left: 0,
        autoBudgetPeriod:'',
        autoBudgetAmount: 0,
        autoBudgetType: ''

    });

    let repeats = [
      { id: 1, name: 'Daily' },
      { id: 2, name: 'Weekly' },
      { id: 3, name: 'Monthly' },
      { id: 4, name: 'Quaterly' },
      { id: 5, name: 'Half Yearly' },
      { id: 6, name: 'Yearly' }
    ];

    let options = [
      { id: 1, name: 'Fixed' },
      { id: 2, name: 'Rollover' },
      { id: 3, name: 'Adjusted' }
    ];
    const navigate = useNavigate(); 
    const updateForm = (field, value) => {
      setForm((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

    async function addBudgets(e){
      //Adds new budget to database
        e.preventDefault();
        const jwtToken = localStorage.getItem("jwtToken");
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        const newBudget =  {
          category: form.name,
          allottedAmount: form.amount,
          leftForMonth: form.amount - form.spent,
          spentThisMonth: form.spent,
          month: monthNames[date.getMonth()],
          email: localStorage.getItem('email')
        };
        console.log(newBudget);
        
        await axios.post('http://localhost:8080/api/budgets/addBudget', newBudget,{
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
      }).then((response) => {
            console.log(response.data);
            navigate("/budgets");
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
              <Flex direction="column" gap="size-300" width={{XXS:'70%',XS:'70%',S:'70%',M:'70%',L:'70%'}}>
                <Well>
                <Form aria-labelledby="label-3" method="post" onSubmit={addBudgets}>
                    <Flex direction="column" gap="size-150" width={945} >
                        <Flex direction="row" gap="size-100">
                            <Well><View width={450}>
                            <h3 id="label-3">Mandatory Fields</h3>
                            <hr></hr>
                                <TextField 
                                  label="Name" 
                                  value={form.name}
                                  onChange={(value) => updateForm('name', value)}
                                  isRequired/> <br/><br/>
                                <NumberField 
                                  label="Budget Amount" 
                                  defaultValue={0} 
                                  value={form.amount}
                                  onChange={(value) => updateForm('amount', value)}
                                  isRequired/> <br/><br/>
                                   <NumberField 
                                  label="Spent Amount" 
                                  defaultValue={0} 
                                  value={form.spent}
                                  onChange={(value) => updateForm('spent', value)}
                                  isRequired/>
                        </View></Well>
                        <Well><View width={450}>
                            <Heading level={3}>Optional Fields</Heading>
                            <hr></hr>
                            <Picker
                              label="Auto-Budgeted"
                              items={options}
                              onChange={updateForm}
                              selectedKey={form.autoBudgetType}
                              onSelectionChange={(value) => updateForm('autoBudgetType', value)}>
                              {(item) => <Item>{item.name}</Item>}
                            </Picker> <br/><br/>
                            <NumberField 
                              label="Auto Budgeted amount" 
                              defaultValue={0} 
                              value={form.autoBudgetAmount}
                              onChange={(value) => updateForm('autoBudgetAmount', value)}/> <br/><br/>
                            <Picker
                              label="Auto-Budgeted-period"
                              items={repeats}
                              selectedKey={form.autoBudgetPeriod}
                              onSelectionChange={(value) => updateForm('autoBudgetPeriod', value)}>
                              {(item) => <Item>{item.name}</Item>}
                            </Picker>
                        </View></Well>
                    </Flex>
                    <View><Button variant="accent" type="submit">Add Budget</Button></View>
                    </Flex> 
                  </Form>
                </Well>
              </Flex>
            </Flex>
          </Flex>     
    </>
    )
}