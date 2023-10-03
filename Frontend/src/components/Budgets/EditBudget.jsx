import React, { useLayoutEffect } from 'react';
import { Flex, Heading, NumberField, Well, View } from "@adobe/react-spectrum";
import { Button } from "@adobe/react-spectrum";
import { Form, TextField, Picker, Item } from "@adobe/react-spectrum";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import TopNav from '../NavBars/TopNav';
import { useNavigate } from 'react-router-dom';
import SideNav from '../NavBars/SideNav';
const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]

export default function EditBudget(){
    const date= new Date();
    const params = useParams();
    const [budgetId,setBudgetId] = useState(0);
    const [form, setForm] = useState({
        category: '',
        allottedAmount: 0,
        spentThisMonth: 0,
        leftForMonth: 0,
        autoBudgetPeriod:'',
        autoBudgetAmount: 0,
        autoBudgetType: ''
    });
    const navigate = useNavigate(); 
    
    let repeats = [
      { id: 1, name: 'Daily' },
      { id: 2, name: 'Weekly' },
      { id: 3, name: 'Monthly' },
      { id: 4, name: 'Quaterly' },
      { id: 5, name: 'Half Yearly' },
      { id: 6, name: 'Yearly' }
    ];

    let options = [
      { id: 1, name: 'Set Fixed amount every period' },
      { id: 2, name: 'Add an amount every period' },
      { id: 3, name: 'Add an amount every period and correct for overspending' }
    ];

    const updateForm = (field, value) => {
      setForm((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

    useLayoutEffect(()=>{
       const id = params.id.toString();
       setBudgetId(id);
    },[])

    useEffect(() => {
      const fetchData = async () => {
        const jwtToken = localStorage.getItem("jwtToken");
        //fetches budget with id
        await axios.get(`http://localhost:8080/api/budgets/${budgetId}`,{
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
      })
            .then((response) => {
                setForm(response.data.budget);
            })
            .catch((error) => {
                console.error(error);
            });
      };
  
      fetchData();
    }, [budgetId]);

    async function updateBudget(e) {
        e.preventDefault();
        const jwtToken = localStorage.getItem("jwtToken");
        const updatedBudget =  {
          category: form.category,
          allottedAmount: form.allottedAmount,
          leftForMonth: form.allottedAmount - form.spentThisMonth,
          spentThisMonth: form.spentThisMonth,
          month: monthNames[date.getMonth()]
        };
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        //update budget in database
        await axios.put(`http://localhost:8080/api/budgets/updateBudget`, {id:budgetId,budget:updatedBudget},{
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
      }) 
            .then((response) => {
                console.log(response.data);
                navigate("/budgets");
            })
            .catch((error) => {
                console.error(error);
            });
    }
    return (
        <>
          <Flex direction="column" gap="size-100">
            <View> <TopNav/> </View>
            <Flex direction="row" gap="size-100" >
              <View><SideNav/></View>
              <Flex direction="column" gap="size-300" width={{XXS:'70%',XS:'70%',S:'70%',M:'70%',L:'70%'}}>
                <Well>
                <Form aria-labelledby="label-3" method="post" onSubmit={updateBudget}>
                    <Flex direction="column" gap="size-150" >
                        <Flex direction="row" gap="size-100">
                            <Well><View width="50%">
                            <h3 id="label-3">Mandatory Fields</h3>
                            <hr></hr>
                                <TextField 
                                  label="Name" 
                                  value={form.category}
                                  onChange={(value) => updateForm('category', value)}
                                  isRequired/> <br/>
                                <NumberField 
                                  label="Budget Amount" 
                                  defaultValue={0} 
                                  value={form.allottedAmount}
                                  onChange={(value) => updateForm('allottedAmount', value)}
                                  isRequired/> <br/>
                                  <NumberField 
                                  label="Spent Amount" 
                                  defaultValue={0} 
                                  value={form.spentThisMonth}
                                  onChange={(value) => updateForm('spentThisMonth', value)}
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
                            </Picker> <br/>
                            <NumberField 
                              label="Auto Budgeted amount" 
                              defaultValue={0} 
                              value={form.autoBudgetAmount}
                              onChange={(value) => updateForm('autoBudgetAmount', value)}/> <br/>
                            <Picker
                              label="Auto-Budgeted-period"
                              items={repeats}
                              selectedKey={form.autoBudgetPeriod}
                              onSelectionChange={(value) => updateForm('autoBudgetPeriod', value)}>
                              {(item) => <Item>{item.name}</Item>}
                            </Picker>
                        </View></Well>
                    </Flex>
                    <View><Button variant="accent" type="submit">Update</Button></View>
                    </Flex> 
                  </Form>
                </Well>
              </Flex>
            </Flex>
          </Flex>     
    </>
    )
}