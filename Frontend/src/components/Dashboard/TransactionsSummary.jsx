import { Flex } from "@adobe/react-spectrum"
import TransactionItem from "./TransactionItem"
import { Well } from "@adobe/react-spectrum"
import { useLayoutEffect,useState} from "react";
import axios from "axios";

export default function TransactionsSummary()
{
    let [transactions,setTransactions]=useState([]);
    useLayoutEffect(()=>
    {
        const fetchData = async () => {
            axios.defaults.headers.common['Content-Type'] = 'application/json';
            await axios.post("http://localhost:8080/api/transactions/userTransactions",{email:localStorage.getItem("email")}).then((response) => {
                setTransactions(response.data.transactions)
            })
            .catch((error) => {
                console.log(error)
            });
          };
      
          fetchData();
        
    },[])

    return <Well width={300} ><Flex direction='column' maxHeight={500} UNSAFE_style={{overflow:"scroll"}}>
        <h3>Transactions</h3>
        {
            transactions.map((transaction)=><TransactionItem transaction={transaction} key={transaction.id}/>)
        }
    </Flex>
    </Well>
}