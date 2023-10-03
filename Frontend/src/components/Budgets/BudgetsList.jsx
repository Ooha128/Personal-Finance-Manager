import React, { useLayoutEffect } from 'react';
import { ActionButton, Button, Flex, Heading, View, Well } from "@adobe/react-spectrum";
import {Cell, Column, Row, TableView, TableBody, TableHeader} from '@adobe/react-spectrum';
import Add from "@spectrum-icons/workflow/Add";
import Delete from "@spectrum-icons/workflow/Delete";
import Edit from "@spectrum-icons/workflow/Edit";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import AvailableBudget from './AvailableBudget';
import Pagination from '../Pagination';

const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]

export default function BudgetsList({selectedPeriod}){
  const [budgets, setBudgets] =useState([]);
  const [amount,setAmount] = useState();
  const [spent,setSpent] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  useLayoutEffect(() => {
    const fetchData = async () => {
      const jwtToken = localStorage.getItem("jwtToken");
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      await axios.post('http://localhost:8080/api/budgets/userBudgets', {email:localStorage.getItem("email"),month:monthNames[selectedPeriod.getMonth()]},{
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
    }) 
      .then((response) => {
          setBudgets(response.data.budgets);
          
      })
      .catch((error) => {
          console.error(error);
      });
    };
    fetchData();
    getTotal();
  },[]);

  useEffect(()=>{
    getTotal();
  },[budgets])
  
  useEffect(() => {
     getBudgetList();
  },[selectedPeriod]);

  async function getBudgetList(){
    const jwtToken = localStorage.getItem("jwtToken");
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    await axios.post('http://localhost:8080/api/budgets/userBudgets', {email:localStorage.getItem("email"),month:monthNames[selectedPeriod.getMonth()]},{
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
  }) 
    .then((response) => {
        setBudgets(response.data.budgets);
    })
    .catch((error) => {
        console.error(error);
    });
    getTotal();
  }
  
  function getTotal(){
    let a=0,s=0;
    for(let i=0;i<budgets.length ; i++){
      a+= budgets[i].allottedAmount;
      s+= budgets[i].spentThisMonth;
    }
    setAmount(a);
    setSpent(s);
  }

  async function deleteBudget(index) {
    //delete budget with id from database
    const jwtToken = localStorage.getItem("jwtToken");
    await axios.delete(`http://localhost:8080/api/budgets/deleteBudget/${index}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        console.log( response.data);
        getBudgetList(); 
      })
      .catch(error => {
        console.error('An error occurred', error);
      });
  }  

    function budgetsList()
    {
      return currentRecords.map((budget) => {
        return (
          <Row key={budget.id}>
            <Cell>
              <Link to={"/editBudget/"+budget.id}><ActionButton><Edit/></ActionButton></Link> &nbsp;
              <ActionButton onPress={() => deleteBudget(budget.id)}><Delete/></ActionButton></Cell>
            <Cell>{budget.category}</Cell>
            <Cell>{budget.allottedAmount}</Cell>
            <Cell>{budget.spentThisMonth}</Cell>
            <Cell>{budget.leftForMonth}</Cell>
          </Row>
        );
      });
    }

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = budgets.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(budgets.length / recordsPerPage);


    return (<div>
    <Flex direction="column" gap="size-300">
    <Well>
      <View width={{XXS:'100%',XS:'100%',S:'100%',M:'100%',L:'80%'}}><AvailableBudget amount={amount} spent={spent} selectedPeriod={selectedPeriod}/></View>
    </Well>
    <Well>
    <View>
    <Heading level={5}>Budgets</Heading>
    <br></br>
    <Link to="/newBudget" >
      <Button variant="accent" width={200} marginBottom={20}><Add/> &nbsp; Add Budget</Button>
    </Link>
         <TableView aria-label="Example table with static contents">
          <TableHeader>
            <Column>Action</Column>
            <Column>Name</Column>
            <Column>Budget Amount</Column>
            <Column>Spent</Column>
            <Column>Left</Column>
          </TableHeader>
          <TableBody>
            {budgetsList()}
            <Row>
              <Cell></Cell>
              <Cell>Sum</Cell>
              <Cell>{amount}</Cell> 
              <Cell>{spent}</Cell>
              <Cell>{amount-spent}</Cell>
            </Row>
          </TableBody>
          </TableView>
          </View>

          </Well>
          < View alignSelf={'center'} justifySelf={'center'}><Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/></View> 
    </Flex>
    </div>);
}