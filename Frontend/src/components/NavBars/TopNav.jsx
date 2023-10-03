import '@spectrum-web-components/sidenav/sp-sidenav.js';
import '@spectrum-web-components/sidenav/sp-sidenav-heading.js';
import '@spectrum-web-components/sidenav/sp-sidenav-item.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-money.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-log-out.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-report.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-table.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-summarize.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-dashboard.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav,NavItem,Navbar} from 'react-bootstrap';
import { Text } from '@adobe/react-spectrum';
import './Navigation.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Light from '@spectrum-icons/workflow/Light';
import Moon from '@spectrum-icons/workflow/Moon';
import { useDispatch ,useSelector} from 'react-redux';
import { changeColourScheme } from '../Redux/ThemeChange/ThemeSlice';


const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]

export default function TopNav()
{
    let date=new Date();
    let dispatch=useDispatch();
    let {colorScheme}=useSelector((state)=>state.colourSchemeReducer)
    let icon=colorScheme==='dark'?<Light />:<Moon />

    function handleChangeColourScheme()
    {
       if(colorScheme==='dark')dispatch(changeColourScheme('light'))
       else dispatch(changeColourScheme('dark'))
    }

    return <div>
          <Navbar className='topnav'>
            <Navbar.Brand><Text UNSAFE_style={{color:"white"}}>Finance Manager</Text></Navbar.Brand>
            <Nav className='ms-auto'>
              <NavItem onClick={()=>handleChangeColourScheme()} className='icon'>{icon}</NavItem>
              <NavItem>{monthNames[date.getMonth()]+" "+date.getFullYear()}</NavItem>
              <NavItem>{localStorage.getItem("email")}</NavItem>
            </Nav>
          </Navbar>
    </div>
}