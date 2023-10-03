import { Divider } from "@adobe/react-spectrum";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from "react";
import './PeriodNavigator.css';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-calendar.js';

export default function PeriodNavigator({ onSelectPeriod }) {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDate) => {
    setDate(new Date(selectedDate));
    onSelectPeriod(new Date(selectedDate));
  };

  return (
    <div>
      <h5>Period Navigator</h5>
      <Divider marginBottom={25} size="S"/>
      <div className="date">
        <sp-icon-calendar/> &nbsp; 
        <DatePicker 
          dateFormat="MMM yyyy"
          selected={date}
          onChange={handleDateChange} // Use onChange to handle date selection
          showMonthYearPicker
          placeholderText="Select Period"
          className="datepicker"
        />
      </div>
    </div>
  );
}
