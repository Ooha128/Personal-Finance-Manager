import React from 'react';
import { ActionButton, Button, Flex, Heading } from "@adobe/react-spectrum";
import {Cell, Column, Row, TableView, TableBody, TableHeader, View, Well} from '@adobe/react-spectrum';
import Add from "@spectrum-icons/workflow/Add";
import Delete from "@spectrum-icons/workflow/Delete";
import Edit from "@spectrum-icons/workflow/Edit";
import { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import DoughNutChart from "../DoughNutChart";
import { monthNames } from '../../../App';
import Pagination from '../../Pagination';


export default function RevenueList(){
  const [revenue, setRevenue] =useState([]);
  const [sourceAccounts,setSourceAccounts] = useState({});
    const [destAccounts, setDestAccounts] = useState({});
    const [categories, setCategories] = useState({});
    let date = new Date();
    const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

    useLayoutEffect(()=>{
      const fetchData = async () => {
        const jwtToken = localStorage.getItem("jwtToken");
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        await axios.post("http://localhost:8080/api/transactions/userTransactionsByMonthAndType",{email:localStorage.getItem("email"),type:"Revenue",month:monthNames[date.getMonth()]},{
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },}
      ).then(response => { 
          setRevenue(response.data.transactions);
      });
      };
  
      fetchData();
      
   },[])

  useEffect(() => {
    getRevenue();
},[revenue]);

async function handleDeleteRecord(index) {
  const jwtToken = localStorage.getItem("jwtToken");
    await axios.delete(`http://localhost:8080/api/transactions/deleteTransaction/${index}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        console.log( response.data);
        getRevenuesList(); 
      })
      .catch(error => {
        console.error('An error occurred', error);
      });
}

async function getRevenuesList(){
  const jwtToken = localStorage.getItem("jwtToken");
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  await axios.post("http://localhost:8080/api/transactions/userTransactionsByMonthAndType",{email:localStorage.getItem("email"),type:"Revenue",month:monthNames[date.getMonth()]},{
    headers: {
        Authorization: `Bearer ${jwtToken}`,
    },}
  ).then(response => { 
      setRevenue(response.data.transactions);
  });
}

function getRevenue(){
  const categoryNames = revenue.map(transaction => transaction.title);
  const srcAccounts = revenue.map(transaction => transaction.sourceAccount);
  const destAccounts = revenue.map(transaction => transaction.destAccount);
  let c = categoryNames.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
  let s = srcAccounts.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
  let d = destAccounts.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
  setCategories(c);
  setSourceAccounts(s);
  setDestAccounts(d);
}

    function revenueList()
    {
      return revenue.map((transaction) => {
        return (
          <Row key={transaction.id}>
              <Cell><Link to={"/editTransaction/"+transaction.id}><ActionButton><Edit/></ActionButton></Link> &nbsp;
              <ActionButton onClick={() => handleDeleteRecord(revenue.id)}><Delete/></ActionButton></Cell>
              <Cell>{transaction.title}</Cell>
              <Cell>{transaction.amount}</Cell>
              <Cell>{transaction.date}</Cell>
              <Cell>{transaction.sourceAccount}</Cell>
              <Cell>{transaction.destAccount}</Cell>
            </Row>
        );
      });
    }

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = revenue.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(revenue.length / recordsPerPage);


    return (<div>
      <Flex direction="row" gap="size-300" width="100%" justifyContent='space-evenly'>
        <Well><View  ><DoughNutChart name={"Categories"} labels={categories} /></View></Well>
        <Well><View ><DoughNutChart name={"Source Accounts"} labels={sourceAccounts}/></View></Well>
        <Well><View  ><DoughNutChart name={"Destination Accounts"} labels={destAccounts}/></View></Well>
      </Flex>
      <Well><View width="100%">
      <Flex direction="column">
    <Heading level={4}>Revenue in {monthNames[date.getMonth()]} Month</Heading><br/>
    <Link to="/newTransaction">
      <Button variant="accent" width={200}><Add/> &nbsp; Create new transaction</Button>
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
          </TableHeader>
          <TableBody>
            {revenueList()}
          </TableBody>
          </TableView><br></br>
    < View alignSelf={'center'} justifySelf={'center'}><Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/></View> 

    </Flex>
        </View></Well>
    
    </div>);
}