import { CChart } from "@coreui/react-chartjs";
import './DoughNutChart.css'
import { Divider } from "@adobe/react-spectrum";

export default function DoughNutChart({name,labels})
{
    function getData()
    {
        let finalData={}
        let datasets=[]
        let datasetObject={}
        let backgroundColor=[]
        let data=Object.values(labels);
        let length = data.length;

        for(let i=0;i<length;i++)
        {
            let r=Math.floor(Math.random()*255)
            let g=Math.floor(Math.random()*255)
            let b=Math.floor(Math.random()*255)
            backgroundColor.push('rgb('+r+','+g+','+b);
        }
        
        datasetObject.backgroundColor=backgroundColor
        datasetObject.data=data;
        datasets.push(datasetObject);
        finalData.labels=Object.keys(labels);
        finalData.datasets=datasets;
        
        return finalData;
        
    }
    return <div>
        <h5 className="text">{name}</h5>
        <Divider marginBottom={25} size="S"/>
        <div className='chart'>
            <CChart className="doughnutchart" type="doughnut"
            data={getData()}

            options={{
                plugins:{
                    legend:{
                        display:false
                    }
                }
            }}
            />
        </div>
      </div>
}