import { CChart } from "@coreui/react-chartjs";
import { Divider } from "@adobe/react-spectrum";
import './LineChart.css'

const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]

export default function LineChart({name,label,data})
{
    function getData()
    {
        let length=data.length;
        let labels=monthNames.slice(0,length)
        let finalData={}
        let datasets=[]
      
        let datasetObject={}
        let backgroundColor=[]
        let r=Math.floor(Math.random()*255)
        let g=Math.floor(Math.random()*255)
        let b=Math.floor(Math.random()*255)
        backgroundColor.push('rgb('+r+','+g+','+b);
        
        datasetObject.label=label
        datasetObject.borderColor="red"
        datasetObject.backgroundColor="yellow"
        datasetObject.data=data
        datasets.push(datasetObject)
        
        finalData.labels=labels;
        finalData.datasets=datasets
        
        return finalData
        
    }
    return <div>
        <h3>{name}</h3>
        <Divider marginBottom={25} size="S"/>
        <div className='chart'>
            <CChart className="linechart" type="line"
            data={getData()}            
            />
        </div>
      </div>
}