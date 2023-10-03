// import { Card } from '@react-spectrum/card';
import { Flex ,Text, Divider} from "@adobe/react-spectrum";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-calendar.js';
import '@spectrum-web-components/link/sp-link.js';

import {Well} from '@adobe/react-spectrum'

import './Dashboard.css';


export default function DashboardCard({backgroundColor,icon,linkText,topText,bottomText,link}) {
    return <Well width="33%" UNSAFE_style={{backgroundColor:backgroundColor}}>
            <Flex direction='row' gap='size-200' >
                <FontAwesomeIcon icon={icon} size="5x" style={{marginTop:"10px"}}></FontAwesomeIcon>
                <Flex direction='column' width='100%' >
                    <sp-link href={link}>{linkText}</sp-link>
                    <Text marginBottom={5} marginTop={5} UNSAFE_style={{fontSize:"1.1rem"}}>{topText}</Text>
                    <Divider size="L" marginBottom={4} ></Divider>
                    <Text marginBottom={5} marginTop={5}>{bottomText}</Text>
                </Flex>
            </Flex>
        </Well>
    

}