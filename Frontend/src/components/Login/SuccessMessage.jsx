import { InlineAlert } from "@react-spectrum/inlinealert"
import { Header} from "@adobe/react-spectrum"
import { Content } from "@adobe/react-spectrum"

export default function SuccessMessage({header,message})
{
    return <InlineAlert width={300} variant="positive">
    <Header>{header}</Header>
    <Content>
      {message}
    </Content>
  </InlineAlert>
}