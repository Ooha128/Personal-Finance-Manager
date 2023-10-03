import React, { useLayoutEffect } from 'react';
import { ActionButton, Button, Flex, Heading } from "@adobe/react-spectrum";
import {Cell, Column, Row, TableView, TableBody, TableHeader, View, Well} from '@adobe/react-spectrum';
import Add from "@spectrum-icons/workflow/Add";
import Delete from "@spectrum-icons/workflow/Delete";
import Edit from "@spectrum-icons/workflow/Edit";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import DoughNutChart from "../DoughNutChart";
import { monthNames } from '../../../App';
import Pagination from '../../Pagination';

export default function ExpensesList(){
  const [expenses, setExpenses] =useState([]);
  const [budgets,setBudgets] = useState({});
  const [destAccounts, setDestAccounts] = useState({});
  const [categories, setCategories] = useState({});
  let date=new Date();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  useLayoutEffect(()=>{
    const fetchData = async () => {
      const jwtToken = localStorage.getItem("jwtToken");
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      await axios.post("http://localhost:8080/api/transactions/userTransactionsByMonthAndType",{email:localStorage.getItem("email"),type:"Expense",month:monthNames[date.getMonth()]},{
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },}
      ).then(response => { 
          setExpenses(response.data.transactions);
      });
    };

    fetchData();
     
  },[])
  
  useEffect(() => {
    getExpenses();
},[expenses]);

async function handleDeleteRecord(index) {
  const jwtToken = localStorage.getItem("jwtToken");
    await axios.delete(`http://localhost:8080/api/transactions/deleteTransaction/${index}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        console.log( response.data);
        getExpensesList(); 
      })
      .catch(error => {
        console.error('An error occurred', error);
      });
}

async function getExpensesList(){
  const jwtToken = localStorage.getItem("jwtToken");
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  await axios.post("http://localhost:8080/api/transactions/userTransactionsByMonthAndType",{email:localStorage.getItem("email"),type:"Expense",month:monthNames[date.getMonth()]},{
    headers: {
        Authorization: `Bearer ${jwtToken}`,
    },}
  ).then(response => { 
      setExpenses(response.data.transactions);
  });
}

function getExpenses(){
  let c=[];
  let b=[];
  let d=[];
  for(let i=0; i<expenses.length; i++){
      c.push(expenses[i].title);
      if(expenses[i].budget !== 0) {
          b.push(expenses[i].budget);
      }
      d.push(expenses[i].destAccount);
  }
  let cat = c.reduce((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
  b = b.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
  d = d.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
  
  setCategories(cat);
  setBudgets(b);
  setDestAccounts(d);
}
    function getType(expense){
      console.log(expense)
        if(expense.bills!==0){
          return "Bill";
        }
        else if(expense.budget!==0){
          return "Budget";
        }
        return "";
    }
    function expensesList()
    {
      return currentRecords.map((expense) => {
        return (
          <Row key={expense.id}>
              <Cell><Link to={"/editTransaction/"+expense.id}><ActionButton><Edit/></ActionButton></Link> &nbsp;
              <ActionButton onClick={() => handleDeleteRecord(expense.id)}><Delete/></ActionButton></Cell>
              <Cell>{expense.title}</Cell>
              <Cell>{expense.amount}</Cell>
              <Cell>{expense.date}</Cell>
              <Cell>{expense.sourceAccount}</Cell>
              <Cell>{expense.destAccount}</Cell>
              <Cell>{getType(expense)}</Cell>
            </Row>
        );
      });
    }
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = expenses.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(expenses.length / recordsPerPage);

    return (<div>
      <Flex direction="row" gap="size-300" width="100%" justifyContent='space-evenly'>
        <Well><View><DoughNutChart name={"Categories"} labels={categories} /></View></Well>
        <Well><View><DoughNutChart name={"Budgets"} labels={budgets}/></View></Well>
        <Well><View><DoughNutChart name={"Destination Accounts"} labels={destAccounts}/></View></Well>
      </Flex>
      <Well><View width="100%">
    <Flex direction="column" >
    <Heading level={4}>Expenses in {monthNames[date.getMonth()]} Month</Heading><br/>
    <Link to="/newTransaction">
      <Button variant="accent" width={200}><Add/> &nbsp; Create new Transaction</Button>
    </Link>
    <br/>
         <TableView aria-label="Example table with static contents" selectionMode="multiple">
          <TableHeader>
            <Column>Action</Column>
            <Column>Description</Column>
            <Column>Amount</Column>
            <Column>Date</Column>
            <Column>Source Account</Column>
            <Column>Destination Account</Column>
            <Column>Type</Column>
          </TableHeader>
          <TableBody>
            {expensesList()}
          </TableBody>
          </TableView><br></br>
    < View alignSelf={'center'} justifySelf={'center'}><Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/></View> 

    </Flex></View></Well>

    </div>);
}