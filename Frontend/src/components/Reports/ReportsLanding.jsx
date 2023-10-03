import SideNav from "../NavBars/SideNav";
import TopNav from "../NavBars/TopNav";
import { Flex, View, Well } from "@adobe/react-spectrum";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import { useState,useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";


export default function ReportsLanding()
{
  const [barChartData, setBarChartData] = useState();
  const [lineChartData,setLineChartData]=useState()
  const [netWorthData,setNetWorthData]=useState([])
  const [incomeData,setIncomeData] = useState([]);
  const [expenseData,setExpenseData] = useState([]);

  useLayoutEffect(()=>{
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.post('http://localhost:8080/api/reports/getIncomeAndExpenses', {email:localStorage.getItem("email")}) 
    .then((response) => {
      setBarChartData(response.data.barChartData)
    })
    .catch((error) => {
        console.error(error);
    });


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
      getBarChartData();
      getLineChartData();
  },[barChartData,lineChartData])
  
  function getBarChartData(){
      let income=[];
      let expense=[];
      for(let obj in barChartData){
          income.push(barChartData[obj].income);
          expense.push(barChartData[obj].expense);
      }
      
      setIncomeData(income);
      setExpenseData(expense);
      
  }

  function getLineChartData()
  {
      let netWorth=[]
      for(let obj in lineChartData)
      {
          netWorth.push(lineChartData[obj])
      }
      setNetWorthData(netWorth)

  }
    return <Flex direction="column" gap="size-100">
    <View> <TopNav/> </View>
    <Flex direction="row" gap="size-300" >
      <View><SideNav/></View>
      <Flex direction="column" gap="size-300">
        <Well height="50%"><View width="100%"><BarChart name="Income and Expenses" incomeData={incomeData} expenseData={expenseData}/></View></Well>
        <Well height="50%"><View width="100%"><LineChart name="Net Worth vs Months" label="Net Worth" data={netWorthData}/></View></Well>
      </Flex>
    </Flex>
  </Flex>
}