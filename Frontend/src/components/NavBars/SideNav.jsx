import '@spectrum-web-components/sidenav/sp-sidenav.js';
import '@spectrum-web-components/sidenav/sp-sidenav-heading.js';
import '@spectrum-web-components/sidenav/sp-sidenav-item.js';
import { Well } from '@adobe/react-spectrum';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-money.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-log-out.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-report.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-table.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-dashboard.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-view-list.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-arrow-right.js';
import './Navigation.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SideNav()
{
    const [isLoggedIn, setIsLoggedIn] = useState(true); 
    const navigate = useNavigate(); 
    function handleLogout(){
      // Perform logout actions here, such as clearing session data
      localStorage.clear()
      setIsLoggedIn(false);
      navigate('/');
    }

    return <div>
          <Well>
            <sp-sidenav defaultValue="Dashboard" variant='multi-level'>
            <sp-sidenav-heading label="General">
              <sp-sidenav-item value="Dashboard" href="/dashboard">
                  <sp-icon-dashboard slot="icon"></sp-icon-dashboard>
                  Dashboard
              </sp-sidenav-item>
              </sp-sidenav-heading>
              <sp-sidenav-heading label="Financial Control">
                <sp-sidenav-item value="budgets" href="/budgets">
                <sp-icon-table slot="icon"></sp-icon-table>
                    Budgets
                </sp-sidenav-item>
                <sp-sidenav-item value="bills" href="/bills">
                <sp-icon-money slot="icon"></sp-icon-money>
                    Bills
                </sp-sidenav-item>
              </sp-sidenav-heading>

              <sp-sidenav-heading label="Accounting">
                <sp-sidenav-item expanded>
                <sp-icon-view-list slot="icon"></sp-icon-view-list>
                    Transactions

                  <sp-sidenav-item value="expenses" href="/expenses" >
                  <sp-icon-arrow-right slot="icon"></sp-icon-arrow-right>
                      Expenses
                  </sp-sidenav-item>

                  <sp-sidenav-item value="revenue" href="/revenue" >
                  <sp-icon-arrow-right slot="icon"></sp-icon-arrow-right>
                      Revenue
                  </sp-sidenav-item>

                  <sp-sidenav-item value="transfers" href="/transfers" >
                  <sp-icon-arrow-right slot="icon"></sp-icon-arrow-right>
                      Transfers
                  </sp-sidenav-item>
                </sp-sidenav-item>

              </sp-sidenav-heading>

              <sp-sidenav-heading label="Others">
                <sp-sidenav-item value="Reports" href="/reports">
                <sp-icon-report slot="icon"></sp-icon-report>
                    Reports
                </sp-sidenav-item>

                <sp-sidenav-item value="Logout">
                  <sp-icon-log-out slot="icon"></sp-icon-log-out>
                   <div onClick={handleLogout}>Logout</div>
                </sp-sidenav-item>
              </sp-sidenav-heading>
            </sp-sidenav>
            </Well> 
    </div>
}