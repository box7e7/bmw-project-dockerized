import React, { useState } from "react";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { format, isSameDay } from "date-fns";




const DateRangeSelector = ({endDate,setEndDate,startDate,setStartDate,handleEndDateChange}) => {



    

    const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => {
        return (
          <button id="button-date"
            className=" border border-gray-600  px-4 py-2 rounded shadow "
            onClick={onClick}
            ref={ref}
          >
            {value || placeholder}
          </button>
        );
      });



    
  
    const handleStartDateChange = (date) => {
      setStartDate(date);
      if (endDate === null || date > endDate) {
        setEndDate(date);
      }
    };
  
    // const handleEndDateChange = (date) => {
    //   if (date >= startDate) {
    //     setEndDate(date);
    //   }
    // };
  
    const isDateBlocked = (date) => {
      if (endDate && date > endDate) {
        return true;
      }
      return false;
    };
  
    const renderDayContents = (day, date) => {
      const tooltipText = `Tooltip for ${format(date, "MMMM d, yyyy")}`;
      return (
        <span title={tooltipText}>
          {format(date, "d")}
        </span>
      );
    };
  
    return (
       <div className="datePicker pt-3 pb-4">
         
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          dateFormat="yyyy-MM-d"
          selectsStart
          startDate={startDate}
          endDate={endDate}
          renderDayContents={renderDayContents}
          isDateBlocked={isDateBlocked}
          customInput={<CustomInput placeholder="Start Date" />}
        />
        <span className="text-gray-600 p-1">-</span>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          dateFormat="yyyy-MM-d"
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          renderDayContents={renderDayContents}
          isDateBlocked={isDateBlocked}
          customInput={<CustomInput placeholder="End Date" />}
        />
    
       </div>
    );
  };

  export default DateRangeSelector;