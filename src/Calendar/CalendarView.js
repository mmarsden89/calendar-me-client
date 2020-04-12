import React, { useState, useEffect } from "react";
import FullCalendar from "./FullCalendar";
import MiniCalendar from "./MiniCalendar";
import { useAuth0 } from "../react-auth0-spa";
import moment from "moment";
import apiUrl from "../apiConfig";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./CalendarView.scss";
import config from "../auth_config.json";

const CalendarView = () => {
  const [dateObject, setDateObject] = useState(moment());
  const [calendar, setCalendar] = useState({});
  const [holidays, setHolidays] = useState({});

  const currentDate = Number(moment().date());
  const currentMonth = moment().format("MMMM");
  const { user } = useAuth0();

  useEffect(() => {
    const loadStuff = async () => {
      const holidayResponse = await axios(
        `https://calendarific.com/api/v2/holidays?api_key=${
          config.holiday
        }&country=US&year=${moment(dateObject).format(
          "YYYY"
        )}&type=national,local,observance`
      );
      setHolidays(holidayResponse.data.response.holidays);
      console.log(holidayResponse.data.response.holidays);
      if (user) {
        try {
          const getCalendar = await axios(apiUrl + "/calendars/" + user.sub);
          setCalendar(getCalendar.data.calendar);
          console.log(getCalendar);
        } catch (error) {
          const sendCalendar = await axios.post(apiUrl + "/calendars", {
            calendar: { calendar },
            user: user,
          });
          setCalendar(sendCalendar.data.calendar);
          console.log(sendCalendar);
        }
      } else {
        console.log("try signing up to personalize your calendar today!");
      }
    };
    loadStuff();
  }, [dateObject]);

  const firstDay = () => {
    let first = dateObject.startOf("month").format("d");
    return first;
  };

  let blankDays = [];
  for (let i = 0; i < firstDay(); i++) {
    blankDays.push(
      <td key={`blank${i}`} className="calendar-day empty">
        {""}
      </td>
    );
  }

  const currentChecker = (k) => {
    if (k === currentDate && dateObject.format("MMMM") === currentMonth) {
      return "day current-day";
    } else {
      return "day";
    }
  };

  let days = [];
  for (let k = 1; k <= dateObject.daysInMonth(); k++) {
    days.push(
      <td key={k} className="calendar-day">
        <div className="day-container">
          <p className={currentChecker(k)}>{k}</p>
        </div>
      </td>
    );
  }

  const weekdayShort = moment.weekdaysShort().map((day) => {
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
      <div className="mini-month">{dateObject.format("MMMM YYYY")}</div>
    </div>
  );

  return (
    <div className="calendar-view">
      <MiniCalendar
        header={header}
        weekdayShort={weekdayShort}
        daysInMonth={daysInMonth}
      />
      <div className="full-calendar">
        <FullCalendar
          header={header}
          weekdayShort={weekdayShort}
          daysInMonth={daysInMonth}
        />
      </div>
    </div>
  );
};

export default CalendarView;
