import SideNav from "../NavBars/SideNav";
import TopNav from "../NavBars/TopNav";
import { Flex, View } from "@adobe/react-spectrum";
import GettingStarted from "./GettingStarted";

export default function GettingStartedLanding(){
    return <Flex direction="column" gap="size-200" width={{XXS:'100%',XS:'100%',S:'100%',M:'100%',L:'100%'}}>
    <View> <TopNav/> </View>
    <Flex direction="row" gap="size-100" height={600}>
      <Flex direction="column" gap="size-300" width={{XXS:'70%',XS:'70%',S:'70%',M:'70%',L:'70%'}}>
        <View width={1000}><GettingStarted /></View>
      </Flex>
      
    </Flex>
  </Flex>
}