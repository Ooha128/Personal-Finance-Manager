import SideNav from "../NavBars/SideNav";
import TopNav from "../NavBars/TopNav";
import { Flex, View, Well } from "@adobe/react-spectrum";
import BudgetsList from "./BudgetsList";
import PeriodNavigator from "./PeriodNavigator";
import { useState } from "react";

export default function BudgetsLanding(){
  const [selectedPeriod, setSelectedPeriod] = useState(new Date());
    return <Flex direction="column" gap="size-100" width={{XXS:'100%',XS:'100%',S:'100%',M:'100%',L:'100%'}}>
    <View> <TopNav/> </View>
    <Flex direction="row" gap="size-100" >
      <View width={{XXS:'20%',XS:'20%',S:'20%',M:'20%',L:275}}><SideNav/></View>
      <Flex direction="column" gap="size-300" width={{XXS:'70%',XS:'70%',S:'70%',M:'70%',L:'70%'}}>
        <Well><View><PeriodNavigator onSelectPeriod={setSelectedPeriod} /></View></Well>
        <View><BudgetsList selectedPeriod={selectedPeriod}/></View>
      </Flex>
      
    </Flex>
  </Flex>
}