import { Divider} from "@adobe/react-spectrum";
import { ProgressBar } from "@adobe/react-spectrum";
import 'react-datepicker/dist/react-datepicker.css';
import { monthNames } from "../../App";
export default function AvailableBudget(props)
{
    let selectedPeriod=props.selectedPeriod;
    return <div className="AvailableBudget">
        <h5 className="text">Total Available Budget in Rupees in {monthNames[selectedPeriod.getMonth()]+" "+selectedPeriod.getFullYear()}</h5>
        <Divider marginBottom={25} size="S"/>
        <ProgressBar label={"Available Budget in "+monthNames[selectedPeriod.getMonth()]+" "+selectedPeriod.getFullYear()+": "+props.amount} showValueLabel={false} width={690} value={props.amount===0?0:props.amount} maxValue={props.amount===0?100:props.amount} marginBottom={35}/>
        <ProgressBar label={"Amount Spent in "+monthNames[selectedPeriod.getMonth()]+" "+selectedPeriod.getFullYear()+": "+props.spent} showValueLabel={false}  width={690} maxValue={props.amount===0?100:props.amount} value={props.amount===0?0:props.spent} />
    </div>
}