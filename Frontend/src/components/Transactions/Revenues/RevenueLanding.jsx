import { Flex, View, Well, Heading } from "@adobe/react-spectrum";
import RevenueList from "./RevenueList";
import TopNav from "../../NavBars/TopNav";
import SideNav from "../../NavBars/SideNav";
import Sync from '@spectrum-icons/workflow/Sync';
import ChevronRight from '@spectrum-icons/workflow/ChevronRight';
import { monthNames } from "../../../App";

export default function RevenueLanding()
{
    
    let date = new Date();
    return <Flex direction="column" gap="size-100" width={{XXS:'100%',XS:'100%',S:'100%',M:'100%',L:'100%'}}>
    <View> <TopNav/> </View>
    <Flex direction="row" gap="size-100" >
      <View width={{XXS:'20%',XS:'20%',S:'20%',M:'20%',L:275}}><SideNav/></View>
      <Flex direction="column" gap="size-100" width={{XXS:'70%',XS:'70%',S:'70%',M:'70%',L:'70%'}}>
        <Well><View ><Heading level={5}><Sync/> Transactions <ChevronRight/>Revenue in {monthNames[date.getMonth()]} Month </Heading>  </View></Well>
      <RevenueList/>
    </Flex></Flex>
  </Flex>
}