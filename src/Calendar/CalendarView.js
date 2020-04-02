import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./CalendarView.scss";
import moment from "moment";

const CalendarView = () => {
  const [dateObject, setDateObject] = useState(moment());

  const firstDay = () => {
    let first = moment(dateObject)
      .startOf("month")
      .format("d");
    return first;
  };

  const currentDate = Number(moment().format("d"));
  const currentMonth = moment().format("MMMM");

  let blankDays = [];
  for (let i = 0; i < firstDay(); i++) {
    blankDays.push(
      <td key={`blank${i}`} className="calendar-day empty">
        {""}
      </td>
    );
  }
  let days = [];
  for (let k = 1; k <= moment(dateObject).daysInMonth(); k++) {
    days.push(
      <td
        key={k}
        className={
          k === currentDate &&
          moment(dateObject).format("MMMM") === currentMonth
            ? "calendar-day current-day"
            : "calendar-day"
        }
      >
        {k}
      </td>
    );
  }

  const weekdayShort = moment.weekdaysShort().map(day => {
    return <th key={day}>{day}</th>;
  });

  var totalSlots = [...blankDays, ...days];
  let rows = [];
  let cells = [];

  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row);
    } else {
      rows.push(cells);
      cells = [];
      cells.push(row);
    }
    if (i === totalSlots.length - 1) {
      rows.push(cells);
    }
  });

  let daysInMonth = rows.map((d, i) => {
    return <tr key={`days${i}`}>{d}</tr>;
  });

  const handleMonthBack = () => {
    const newDate = moment(dateObject).subtract(1, "months");
    setDateObject(newDate);
  };

  const handleMonthForward = () => {
    const newDate = moment(dateObject).add(1, "months");
    setDateObject(newDate);
  };

  const header = (
    <div className="mini-header">
      <div className="arrow-container">
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={handleMonthBack}
          className="hover"
        />
        <FontAwesomeIcon
          icon={faArrowRight}
          onClick={handleMonthForward}
          className="hover"
        />
      </div>
      <div className="mini-month">{moment(dateObject).format("MMMM YYYY")}</div>
    </div>
  );

  const defaultCalendarMap = (
    <div className="calendar mini">
      {header}
      <table className="calendar-day">
        <thead>
          <tr>{weekdayShort}</tr>
        </thead>
        <tbody>{daysInMonth}</tbody>
      </table>
    </div>
  );
  return <div className="calendar-view-container">{defaultCalendarMap}</div>;
};

export default CalendarView;
