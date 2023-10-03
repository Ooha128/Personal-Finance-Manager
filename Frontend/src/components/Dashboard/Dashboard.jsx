import DashboardCard from "./DashboardCard";
import DashboardLineChart from "./DashboardLineChart";
import { View, Flex, Well} from "@adobe/react-spectrum";
import TopNav from "../NavBars/TopNav";
import SideNav from "../NavBars/SideNav";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { faBalanceScale } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import TransactionsSummary from "./TransactionsSummary";
import { useLayoutEffect, useState } from "react";
import axios from "axios";
export default function Dashboard(){
    let {colorScheme}=useSelector((state)=>state.colourSchemeReducer)
    let [balance,setBalance]=useState();
    let [spent, setSpent] = useState();
    let [revenue,setRevenue]=useState();
    let [expense, setExpense] = useState();
    let [billToPay,setBillsToPay]=useState();
    useLayoutEffect(()=>{
      const fetchData = async () => {
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        const jwtToken = localStorage.getItem("jwtToken");
        await axios.post("http://localhost:8080/api/dashboard/getDashboardDetails",{email:localStorage.getItem("email")},{
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
      }).then(response => { //change the URL
            setBalance(response.data.bankBalance)
            setSpent(response.data.spent)
            setBillsToPay(response.data.billsToPay)
            setRevenue(response.data.revenue)
            setExpense(response.data.expense)
        })
        .catch((error)=>
        {
          console.log(error.data)
        });
      };
  
      fetchData();
      
    },[])
    
    return <Flex direction="column" gap="size-100">
    <View> <TopNav/> </View>
    <Flex direction="row" gap="size-100" width={{XXS:'100%',XS:'100%',S:'100%',M:'100%',L:'100%'}}>
      <View width={{XXS:'20%',XS:'20%',S:'20%',M:'20%',L:'20%'}}><SideNav/></View>
      <Flex direction="column" gap="size-100" width={{XXS:'80%',XS:'80%',S:'80%',M:'80%',L:'80%'}}>
      <Well><Flex direction="row" gap="size-300" width="100%" justifyContent='space-evenly'>
        <DashboardCard backgroundColor={colorScheme==='dark'?"maroon":"lightcoral"} icon={faBalanceScale} linkText={"Transactions"} topText={"Debit/Credit"} bottomText={"Rs."+expense+"/Rs."+revenue} link="/transactions"/>
        <DashboardCard backgroundColor={colorScheme==='dark'?"darkgreen":"rgb(145, 177, 145)"}  icon={faMoneyBill} linkText={"Bills"} topText={"Bills To Pay"} bottomText={"Rs."+billToPay} link="/bills"/>
        <DashboardCard backgroundColor={colorScheme==='dark'?"darkblue":"orange"} icon={faCalendar} linkText={"Budget"} topText={"Budget Spent"} bottomText={"Rs."+spent} link="/budgets"/>
        <DashboardCard backgroundColor={colorScheme==='dark'?"purple":"lightblue"} icon={faUser} linkText={"Balance"} topText={"Current Balance"} bottomText={"Rs."+balance}/>
      </Flex></Well>
      <Flex direction='row' gap='size-300'>
      <View><DashboardLineChart/></View>
      <View><TransactionsSummary/></View>
      </Flex>
    </Flex></Flex>
  </Flex>
}