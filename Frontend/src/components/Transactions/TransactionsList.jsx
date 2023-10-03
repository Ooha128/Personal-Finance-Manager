import React, { useEffect, useLayoutEffect } from 'react';
import { ActionButton, Button, Flex, Heading, View } from "@adobe/react-spectrum";
import {Cell, Column, Row, TableView, TableBody, TableHeader} from '@adobe/react-spectrum';
import Add from "@spectrum-icons/workflow/Add";
import Delete from "@spectrum-icons/workflow/Delete";
import Edit from "@spectrum-icons/workflow/Edit";
import Calendar from '@spectrum-icons/workflow/Calendar';
import { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';
export default function TransactionsList(){
  const [transactions, setTransactions] =useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  useLayoutEffect(()=>{
    //Fetches list of transactions from the database
    const fetchData = async () => {
      const jwtToken = localStorage.getItem("jwtToken");
      axios.defaults.headers.common['Content-Type'] = 'application/json';
      await axios.post('http://localhost:8080/api/transactions/userTransactions', {email : localStorage.getItem("email")},{
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
    }) 
      .then((response) => {
          setTransactions(response.data.transactions);
      })
      .catch((error) => {
          console.error(error);
      });
    };
    fetchData();
  },[])
  
  useEffect(()=>{
    setTransactions(transactions);
},[transactions])

async function getTransactionsList(){
  //retrieves jwtToken from local storage
  const jwtToken = localStorage.getItem("jwtToken");
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  //Fetches list of transactions from data base
  await axios.post('http://localhost:8080/api/transactions/userTransactions', {email : localStorage.getItem("email")},{
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
}) 
  .then((response) => {
      setTransactions(response.data.transactions);
  })
  .catch((error) => {
      console.error(error);
  });
}

async function deleteTransaction(index) {
  const jwtToken = localStorage.getItem("jwtToken");
  //delete bill with specific id
    await axios.delete(`http://localhost:8080/api/transactions/deleteTransaction/${index}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        console.log( response.data);
        getTransactionsList(); 
      })
      .catch(error => {
        console.error('An error occurred', error);
      });
}

function getType(transaction)
{
    // console.log(transaction.bill, transaction.budget);
    if(transaction.bills>0){
        return "Bill";
    }
    else if(transaction.budget){
        return "Budget";
    }
    else{
        return "";
    }
}

    function transactionsList()
    {
      return currentRecords.map((transaction) => {
        return (
          <Row key={transaction.id} data-testid='transaction'>
              <Cell><Link to={"/editTransaction/"+transaction.id}><ActionButton><Edit/></ActionButton></Link>&nbsp;
              <ActionButton onPress={() => deleteTransaction(transaction.id)}><Delete/></ActionButton></Cell>
              <Cell>{transaction.title}</Cell>
              <Cell>{transaction.amount}</Cell>
              <Cell>{transaction.type}</Cell>
              <Cell>{getType(transaction)}</Cell>
              <Cell>{transaction.date}</Cell>
            </Row>
        );
      });
    }
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = transactions.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(transactions.length / recordsPerPage);

    return (<div>
    <Flex direction="column" gap="size-100">
    <Heading level={4}><Calendar size="M"/> Transactions</Heading>
    <Link to="/newTransaction">
      <Button variant="accent" width={200}><Add/> &nbsp; Create new transaction</Button>
    </Link>
         <TableView aria-label="Example table with static contents">
          <TableHeader>
            <Column>Action</Column>
            <Column>Name</Column>
            <Column>Amount</Column>
            <Column>Type</Column>
            <Column>Category</Column>
            <Column>Date</Column>
          </TableHeader>
          <TableBody>
            {transactionsList()}
          </TableBody>
          </TableView>

         < View alignSelf={'center'} justifySelf={'center'}><Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/></View> 
    </Flex>
    </div>);
}