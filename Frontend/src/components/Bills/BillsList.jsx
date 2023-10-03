import React, { useLayoutEffect } from 'react';
import { ActionButton, Button, Flex, Heading, View } from "@adobe/react-spectrum";
import {Cell, Column, Row, TableView, TableBody, TableHeader} from '@adobe/react-spectrum';
import Add from "@spectrum-icons/workflow/Add";
import Delete from "@spectrum-icons/workflow/Delete";
import Edit from "@spectrum-icons/workflow/Edit";
import Calendar from '@spectrum-icons/workflow/Calendar';
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import Pagination from '../Pagination';


let repeats={1:'Monthly', 2:'Half Yearly', 3:'Yearly'}
export default function BillsList(){
  const [bills, setBills] =useState([]);
  let [amount,setAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  useLayoutEffect(()=>{
    //Fetches list of bills from the database
    const fetchData = async () => {
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
    };

    fetchData();
  },[])
  
  useEffect(()=>{
    getTotal();
  },[bills])
  

function getTotal(){
  let a=0;
  for(let i=0;i<bills.length ; i++){
    a+= bills[i].amount;
  }
  setAmount(a);
}

async function getBillsList(){
  //retrieves jwtToken from local storage
  const jwtToken = localStorage.getItem("jwtToken");
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  //Fetches list of bills from data base
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

async function deleteBill(index) {
  const jwtToken = localStorage.getItem("jwtToken");
  //delete bill with specific id
    await axios.delete(`http://localhost:8080/api/bills/deleteBill/${index}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then(response => {
        console.log( response.data);
        getBillsList(); 
      })
      .catch(error => {
        console.error('An error occurred', error);
      });
}

    function billsList()
    {
      return currentRecords.map((bill) => {
        return (
          <Row key={bill.id} data-testid='bill'>
              <Cell><Link to={"/editBill/"+bill.id}><ActionButton><Edit/></ActionButton></Link>&nbsp;
              <ActionButton onPress={() => deleteBill(bill.id)}><Delete/></ActionButton></Cell>
              <Cell>{bill.name}</Cell>
              <Cell>{bill.amount}</Cell>
              <Cell>{bill.billDate}</Cell>
              <Cell>{bill.dueDate}</Cell>
              <Cell>{repeats[bill.repeats]}</Cell>
            </Row>
        );
      });
    }

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = bills.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(bills.length / recordsPerPage);

    return (<div>
    <Flex direction="column" gap="size-100">
    <Heading level={4}><Calendar size="M"/> Bills</Heading>
    <Link to="/newBill">
      <Button variant="accent" width={200}><Add/> &nbsp; Create new Bill</Button>
    </Link>
         <TableView aria-label="Example table with static contents">
          <TableHeader>
            <Column>Action</Column>
            <Column>Name</Column>
            <Column>Amount</Column>
            <Column>Paid this Period</Column>
            <Column>Next Expected Match</Column>
            <Column>Repeats</Column>
          </TableHeader>
          <TableBody>
            {billsList()}
            <Row>
              <Cell></Cell>
              <Cell>Sum (active and expected bills only)</Cell>
              <Cell>{amount}</Cell>
              <Cell></Cell>
              <Cell></Cell>
              <Cell></Cell>
            </Row>
          </TableBody>
          </TableView>
         < View alignSelf={'center'} justifySelf={'center'}><Pagination nPages={nPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/></View> 
    </Flex>
    </div>);
}