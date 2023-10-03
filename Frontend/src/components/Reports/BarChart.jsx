import { CChart } from "@coreui/react-chartjs";
import { Divider } from "@adobe/react-spectrum";
import './BarChart.css'
import { useSelector } from "react-redux";
const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]
        
export default function BarChart({name,incomeData,expenseData})
{
    let {colorScheme}=useSelector((state)=>state.colourSchemeReducer)
    function getData()
    {
        let length=incomeData.length;
        let labels=monthNames.slice(0,length)
        let finalData={}
        let datasets=[]
       
        for(let i=0;i<2;i++)
        {
            let datasetObject={}
            let backgroundColor=[]
            let r=Math.floor(Math.random()*255)
            let g=Math.floor(Math.random()*255)
            let b=Math.floor(Math.random()*255)
            backgroundColor.push('rgb('+r+','+g+','+b);
    
            datasetObject.label=(i===0)?"Income":"Expenses"
            datasetObject.backgroundColor=backgroundColor
            datasetObject.data=(i===0)?incomeData:expenseData
            datasets.push(datasetObject)
        }
        
        finalData.labels=labels;
        finalData.datasets=datasets
        
        return finalData
        
    }
    return <div>
        <h3>{name}</h3>
        <Divider marginBottom={25} size="S"/>
        <div className='chart'>
            <CChart className="barchart" type="bar"
            data={getData()}
            options={{
                scales:{
                    x:{
                        ticks:{
                            color:colorScheme==='dark'?'white':'black'
                        },
                        grid:{
                            color:colorScheme==='dark'?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)" 
                        }
                    },
                    y:{
                        ticks:{
                            color:colorScheme==='dark'?'white':'black'
                        },
                        grid:{
                            color:colorScheme==='dark'?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)" 
                        }
                    }
                }
                
            }}
            
            />
        </div>
      </div>
}