import React, { useState } from "react";
import "./Calendar.css";
import { useNavigate } from 'react-router-dom';

function Calendar() {
  const navigate = useNavigate();
  const handleDayClick = (dayNumber) => {
    navigate(`/todo/${dayNumber}`);
  };

  const daysWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthYears = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDateOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  
  const buildWeeks = () => {
    const totalDays = firstDateOfMonth + daysInMonth;
    const totalWeeks = Math.ceil(totalDays / 7);


    let weeks = [];
    let dayCounter = 1;

    for (let week = 0; week < totalWeeks; week++) {
      let weekDays = [];
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDateOfMonth) {
          weekDays.push(null); // روزهای خالی اول ماه
        } else if (dayCounter <= daysInMonth) {
          weekDays.push(dayCounter);
          dayCounter++;
        } else {
          weekDays.push(null); // روزهای خالی آخر ماه
        }
      }
      weeks.push(weekDays);
    }

    // اگر بیشتر از ۵ هفته بود، روزهای هفته‌ی آخر رو به هفته‌ی اول منتقل کن
    if (weeks.length > 5) {
      const firstWeek = weeks[0];
      const lastWeek = weeks[weeks.length - 1];

      // روزهای غیر خالی هفته‌ی آخر
      const daysToMove = lastWeek.filter(day => day !== null);

      // ساخت هفته‌ی اول جدید
      const newFirstWeek = [...firstWeek];
      daysToMove.forEach((day, index) => {
        const originalIndex = lastWeek.indexOf(day);
        // اگه خونه‌ی مورد نظر در هفته‌ی اول خالی بود یا روز کوچک‌تری داشت، جایگزین کن
        if (newFirstWeek[originalIndex] === null || newFirstWeek[originalIndex] > day) {
          newFirstWeek[originalIndex] = day;
        } else {
          // اگه پر بود، به هفته‌ی دوم اضافه کن 
          const secondWeek = weeks[1];
          if (secondWeek[originalIndex] === null || secondWeek[originalIndex] > day) {
            secondWeek[originalIndex] = day;
          }
        }
      });

      
      weeks = [newFirstWeek, ...weeks.slice(1, -1)];
    }

    return weeks;
  };

  const weeks = buildWeeks();

  const GoToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const prevMonth = () => {
    setCurrentMonth(prevMonth => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear(prevYear => (currentMonth === 0 ? prevYear - 1 : prevYear));
  };

  const nextMonth = () => {
    setCurrentMonth(prevMonth => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear(prevYear => (currentMonth === 11 ? prevYear + 1 : prevYear));
  };

  return (
    <div className="calendar">
      <h3 className="year">{currentYear}</h3>

      <div className="buttons">
        <i className="bx bx-arrow-left" onClick={prevMonth} />
        <h3 className="month">{monthYears[currentMonth]}</h3>
        <i className="bx bx-arrow-right" onClick={nextMonth} />
      </div>

      <div className="daysOfTheWeek">
        {daysWeek.map(day => <span key={day}>{day}</span>)}
      </div>

      <div className="calendar-grid">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="week-row">
            {week.map((day, dayIndex) => (
              <span
                key={`${weekIndex}-${dayIndex}`}
                className={
                  day !== null && 
                  day === currentDate.getDate() &&
                  currentMonth === currentDate.getMonth() &&
                  currentYear === currentDate.getFullYear()
                    ? "currentDay"
                    : ""
                }
                onClick={() => day !== null && handleDayClick(day)}
              >
                {day !== null ? day : ""}
              </span>
            ))}
          </div>
        ))}
      </div>
        
{(currentMonth !== currentDate.getMonth() || currentYear !== currentDate.getFullYear()) && (
  <button className="NowButton" onClick={GoToToday}>
    Back To Now
  </button>
)}
    </div>
  );
}

export default Calendar;