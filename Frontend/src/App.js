import './App.css';
import { lazy } from 'react';
import {defaultTheme, Provider} from '@adobe/react-spectrum';
import { Routes, Route} from 'react-router-dom';
import { Suspense } from 'react';
import SignIn from './components/Login/SignIn';
import './components/Login/SignIn.css';
import ForgotPassword from './components/Login/ForgotPassword';
import SignUp from './components/SignUp/SignUp';
import GettingStartedLanding from './components/GettingStarted/GettingStartedLanding';
import Dashboard from './components/Dashboard/Dashboard';
import {useSelector } from 'react-redux';
import TransactionsLanding from './components/Transactions/TransactionsLanding';
export const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]

const BillsLanding = lazy(() => import('./components/Bills/BillsLanding'));
const CreateBill = lazy(() => import('./components/Bills/CreateBill'));
const BudgetsLanding = lazy(() => import('./components/Budgets/BudgetsLanding'));
const CreateBudget=lazy(()=>import('./components/Budgets/CreateBudget'))
const ExpensesLanding=lazy(()=>import('./components/Transactions/Expenses/ExpensesLanding.jsx'))
const RevenueLanding=lazy(()=>import('./components/Transactions/Revenues/RevenueLanding'))
const TransfersLanding=lazy(()=>import('./components/Transactions/Transfers/TransfersLanding'))
const CreateTransaction=lazy(()=>import('./components/Transactions/CreateTransaction'))
const EditBudget=lazy(()=>import('./components/Budgets/EditBudget'))
const EditBill=lazy(()=>import('./components/Bills/EditBill'))
const EditTransaction=lazy(()=>import('./components/Transactions/EditTransaction'))
const ReportsLanding=lazy(()=>import('./components/Reports/ReportsLanding'))

function App() {
  let {colorScheme}=useSelector((state)=>state.colourSchemeReducer)
  return (
    <>
    <Provider theme={defaultTheme} colorScheme={colorScheme}>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path='/gettingStarted' element={<GettingStartedLanding/>}/>
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/bills" element={<BillsLanding />} />
          <Route path="/newbill" element={<CreateBill />} />
          <Route path="/budgets" element={<BudgetsLanding />} />
          <Route path="/newBudget" element={<CreateBudget />} />
          <Route path="/expenses" element={<ExpensesLanding/>} />
          <Route path="/revenue" element={<RevenueLanding/>} />
          <Route path="/transfers" element={<TransfersLanding/>} />
          <Route path="/newTransaction" element={<CreateTransaction />} />
          <Route path="/editBudget/:id" element={<EditBudget />} />
          <Route path="/editBill/:id" element={<EditBill />} />
          <Route path="/editTransaction/:id" element={<EditTransaction />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<ReportsLanding />} />
          <Route path="/transactions" element={<TransactionsLanding/>} />
        </Routes>
      </Suspense>
    </Provider>
    
  </>
  );
}

export default App;