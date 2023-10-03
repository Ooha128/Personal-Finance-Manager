import React from 'react';
import { DatePicker, Flex, Heading, NumberField, View } from "@adobe/react-spectrum";
import { Button } from "@adobe/react-spectrum";
import { Form, TextField, Picker, Item, Well, Divider } from "@adobe/react-spectrum";
import axios from "axios";
import { useEffect, useState , useLayoutEffect} from "react";
import { useParams } from 'react-router-dom';
import TopNav from '../NavBars/TopNav';
import SideNav from '../NavBars/SideNav';
import { useNavigate } from 'react-router-dom';

const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]

export default function EditTransaction(){
    let date=new Date();

    const navigate = useNavigate(); 
    const params = useParams();
    const [budgets, setBudgets] = useState([]);
    const [bills, setBills] = useState([]);
    const [transactionId,setTransactionId] = useState();
    const [form, setForm] = useState({
        title: '',
        sourceAccount: '',
        destAccount: '',
        date: new Date(),
        amount: 0,
        budget: 0,
        bills:0,
        email: localStorage.getItem("email"),
        type: ''
    });

    useLayoutEffect(()=>{
        getBudgets();
        getBills();
        const i = params.id.toString();
        setTransactionId(i);
     },[])

    useEffect(()=>{
        const fetchData = async () => {
            const jwtToken = localStorage.getItem("jwtToken");
            await axios.get(`http://localhost:8080/api/transactions/${transactionId}`,{
                headers: {
                Authorization: `Bearer ${jwtToken}`,
                },
            })
                .then((response) => {
                    // console.log(response.data.transaction)
                    setForm(response.data.transaction);
                })
                .catch((error) => {
                    console.error(error);
                });
          };
      
          fetchData();
        
    },[transactionId]);

    let type={1:'Revenue', 2:'Expense', 3:'Transfer'}

    const updateForm = (field, value) => {
      setForm((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

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

    async function updateTransaction(e){
        e.preventDefault();
        const jwtToken = localStorage.getItem("jwtToken");
        const inputDate = new Date(form.date);
        const updatedTransaction =  {
            title: form.title,
            date: `${inputDate.getDate()}-${inputDate.getMonth() + 1}-${inputDate.getFullYear()}`,
            amount: form.amount,
            email: localStorage.getItem('email'),
            sourceAccount: form.sourceAccount,
            destAccount: form.destAccount,
            budget: form.budget,
            bills:form.bills,
            month: monthNames[date.getMonth()],
            type: type[form.type]
        };
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        await axios.put(`http://localhost:8080/api/transactions/updateTransaction`, {id:transactionId,transaction:updatedTransaction},{
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
        })
            .then((response) => {
                console.log(response.data);
                if(updateTransaction.type === 1){
                    navigate("/revenue");
                }
                else if(updateTransaction.type === 2){
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
        <Flex direction="column" gap="size-100">
    <View> <TopNav/> </View>
    <Flex direction="row" gap="size-100" >
      <View><SideNav/></View>
      <Flex direction="column" gap="size-300">
        <Well>
        <View width={950}>
        <Form aria-labelledby="label-3" method="post" onSubmit={updateTransaction}>
            <Flex direction="column" gap="size-150" >
                <Heading level={5}>Transaction Information</Heading>
                <Divider marginBottom={25} size="S"/>
                <Flex direction="row" gap="size-100">
                    <View width={800}>
                        <TextField 
                            label="Description" 
                            value={form.title}
                            onChange={(value) => updateForm('title', value)} /> <br/>
                        <TextField 
                            label="Source Account" 
                            value={form.sourceAccount}
                            onChange={(value) => updateForm('sourceAccount', value)} /><br/>
                        <TextField 
                            label="Destination Account" 
                            value={form.destAccount}
                            onChange={(value) => updateForm('destAccount', value)} /><br/>
                        <DatePicker 
                            label="Date" 
                            selectedDate={form.date}
                            onChange={(date) => updateForm('date', date)}
                            isRequired/> <br/>
                        <NumberField 
                            label="Amount" 
                            defaultValue={0} 
                            value={form.amount}
                            onChange={(value) => updateForm('amount', value)}
                            isRequired/> <br/>
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
                            items={options}
                            isRequired
                            selectedKey={form.type}
                            onSelectionChange={(value) => updateForm('type', value)}>
                            {(item) => <Item>{item.name}</Item>}
                        </Picker>  
                    </View>
                </Flex>
                <View><Button variant="accent" type="submit">Update</Button></View>
            </Flex> 
        </Form>
        </View> </Well>
      </Flex>
      
    </Flex>
  </Flex>
        
    </>
    )
}