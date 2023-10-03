import { Flex } from "@adobe/react-spectrum"
import { Text } from "@adobe/react-spectrum"
import { Well } from "@adobe/react-spectrum"
export default function TransactionItem({transaction})
{
    return <Well><Flex direction='row' justifyContent='space-between'>
        <Text>{transaction.title}</Text>
        <Text UNSAFE_style={{color:transaction.type==='Revenue'?'green':'red'}}>{transaction.amount}</Text>
    </Flex>
    </Well>
}