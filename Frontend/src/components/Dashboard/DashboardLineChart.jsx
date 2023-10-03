import { Flex, View, Well } from "@adobe/react-spectrum";
import LineChart from "../Reports/LineChart";
import { useState,useEffect, useLayoutEffect} from "react";
import axios from "axios";
export default function DashboardLineChart()
{
  const [lineChartData,setLineChartData]=useState()

  const [balanceData,setBalanceData]=useState([])

  useLayoutEffect(()=>{
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.post('http://localhost:8080/api/reports/getNetWorth', {email:localStorage.getItem("email")}) 
    .then((response) => {
      setLineChartData(response.data.lineChartData)
    })
    .catch((error) => {
        console.error(error);
    });

  },[])

  useEffect(()=>{
    getLineChartData(); 
  },[lineChartData])

  function getLineChartData()
  {
      let balance=[]
      for(let obj in lineChartData)
      {
          balance.push(lineChartData[obj])
      }
      setBalanceData(balance)

  }


    return <Flex direction="column" gap="size-100">
      <Well height={500}><View><LineChart name="Balance" label="Balance" data={balanceData}/></View></Well>
      </Flex>
}