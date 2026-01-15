import { useState, useEffect, useRef } from 'react'
import './Month.css'
import dm from '../dateUtils.ts'
import YearlyEvents from './YearlyEvents.tsx'
import DateEvents from './DateEvents.tsx'
import api from '../api/api.tsx'
import { useUserContext } from '../context/User.tsx'
import Navbar from './Navbar.tsx'

type dayParams = {
    isToday:boolean,
    enable:boolean,
    bigText: string,
    smallText: string,
    dbData:any,
    onClickHandler:any,
}

function Day({isToday, enable, bigText, smallText, dbData, onClickHandler}:dayParams) {
    return (
        <div className={`day ${enable ? 'enable' : 'disable'} ${isToday ? 'today' : ''}`} onClick={() => {onClickHandler(dbData)}}>
            <div className='day-half-area'>
                <div className='greg-date'>
                    <label>{bigText}</label>
                </div>
                <div className='heb-date'>
                    <label>{smallText}</label>
                </div>
            </div>
            <div className='events-half-area'>
                {
                    dbData.events.map((evnt:string) => {
                        return <div key={evnt}><label>{evnt}</label></div>
                    })
                }
            </div>
        </div> 
    )
}

type monthParams = {
    dbUsers: any[];
}

function Month({ dbUsers }:monthParams) {
    const todayDate = new Date();

    const { user, setUser } = useUserContext()!;

    const [refreshView, setRefreshView] = useState(false);
    const [showYearlyEvents, setShowYearlyEvents] = useState<string>('');

    const currentViewDate = useRef(todayDate);
    const currentMonth = useRef(0);
    const currentMonthName = useRef('');
    const currentYear = useRef(0);

    const monthRows = useRef<Array<number>>([]);
    const monthDays = useRef<Array<any>>([]);

    const [showDayEvents, setShowDayEvents] = useState(false);

    let openDateParams:any = useRef({});

    useEffect(() => {
        if (!user)
            setUser(dbUsers[0]);
        else
            setCurrentViewDate(todayDate);
    }, [])

    useEffect(() => {
        setCurrentViewDate(todayDate);
    }, [user])

    const setCurrentViewDate = (d:Date) => {
        currentViewDate.current = d;
        setCurrentYear(d.getFullYear());
        setCurrentMonth(d.getMonth());
        refreshMonthView();
    }

    const setCurrentMonth = (m:number, updateViewDate:boolean=false) => {
        currentMonth.current = m;
        setCurrentMonthName(monthsNames[currentMonth.current]);

        if (updateViewDate) {
            var d:Date = new Date(currentYear.current, m, 1);
            setCurrentViewDate(d);
        }
    }

    const setCurrentMonthName = (name:string) => {
        currentMonthName.current = name;
    }

    const setCurrentYear = (y:number, updateViewDate:boolean=false) => {
        currentYear.current = y;

        if (updateViewDate) {
            var d:Date = new Date(y, currentMonth.current, 1);
            setCurrentViewDate(d);
        }
    }

    const refreshMonthView = async () => {
        if (!user)
            return;

        monthRows.current = [];

        const firstMonthDate = new Date(currentYear.current, currentMonth.current, 1);
        const daysInMonth:number = dm.daysInMonth(currentYear.current, currentMonth.current+1);
        
        const startWeekDay = dm.dayInWeek(currentYear.current, currentMonth.current, 1);

        let greg_month_query = [];
        let heb_month_query = [];

        const days:any = [];
        
        for (var i=startWeekDay; i>0; i--) {
            var disableDate = dm.dateDaysDiff(firstMonthDate, i);
            var hebDate = dm.gregorianToHebrew(disableDate);
            
            const hebFullDate = hebDate.hebDay + " " + hebDate.hebMonth + " " + hebDate.hebYear;
            const gregFullDate = `${disableDate.getDate()}/${disableDate.getMonth()+1}/${disableDate.getFullYear()}`;
            var dateData:any = {
                isToday:dm.sameDate(disableDate, todayDate),
                enable:false,
                bigText:disableDate.getDate(),
                smallText:hebFullDate,
                dbData:{
                    gDay:disableDate.getDate(),
                    gMonth:disableDate.getMonth(),
                    gYear:disableDate.getFullYear(),
                    hDay:hebDate.nHebDay,
                    hMonth:hebDate.nHebMonth,
                    hYear:hebDate.nHebYear,
                    gTitle:gregFullDate,
                    hTitle:hebFullDate,
                    isLeapYear:hebDate.isLeapYear,
                    hQueryMonths:hebDate.nHebQueryMonth,
                    events:[],
                }
            }
            days.push(dateData);
            greg_month_query.push([dateData.dbData.gDay, dateData.dbData.gMonth]);
            heb_month_query.push([dateData.dbData.hDay, dateData.dbData.hQueryMonths]);
        }

        for (var i=0; i<daysInMonth; i++) {
            var monthDate = dm.dateDaysDiff(firstMonthDate, -i);
            var hebDate = dm.gregorianToHebrew(monthDate);
            const hebFullDate = hebDate.hebDay + " " + hebDate.hebMonth + " " + hebDate.hebYear;
            const gregFullDate = `${monthDate.getDate()}/${monthDate.getMonth()+1}/${monthDate.getFullYear()}`;
            var dateData:any = {
                isToday:dm.sameDate(monthDate, todayDate),
                enable:true,
                bigText:`${i+1}`,
                smallText:hebFullDate,
                dbData:{
                    gDay:monthDate.getDate(),
                    gMonth:monthDate.getMonth(),
                    gYear:monthDate.getFullYear(),
                    hDay:hebDate.nHebDay,
                    hMonth:hebDate.nHebMonth,
                    hYear:hebDate.nHebYear,
                    gTitle:gregFullDate,
                    hTitle:hebFullDate,
                    isLeapYear:hebDate.isLeapYear,
                    hQueryMonths:hebDate.nHebQueryMonth,
                    events:[],
                }
            }
            days.push(dateData);
            greg_month_query.push([dateData.dbData.gDay, dateData.dbData.gMonth]);
            heb_month_query.push([dateData.dbData.hDay, dateData.dbData.hQueryMonths]);
        }
        
        const result:any = await api.getMonthEvents({
            user_id:user?.id,
            heb_query:heb_month_query, 
            greg_query:greg_month_query
        });

        if (result.success) {
            result.data.forEach((rec:any) => {
                days.forEach((d:any) => {
                    const sameGregDate = ((d.dbData.gDay == rec.g_day) && (d.dbData.gMonth == rec.g_month));
                    const sameHebDate = ((d.dbData.hDay == rec.h_day) && (d.dbData.hQueryMonths.includes(rec.h_month)));
                    
                    if (sameGregDate || sameHebDate) {
                        d.dbData.events.push(rec.description);
                    }
                });
            })
        }

        var displayRows = Math.ceil(days.length / 7);
        monthRows.current = Array.from({ length: displayRows }, (_, i) => i);
        monthDays.current = days;

        setRefreshView(!refreshView);
    }

    const prevMonth = () => {
        var d:Date = new Date(currentYear.current, currentMonth.current, 1);
        d = dm.dateDaysDiff(d, 1);
        
        setCurrentViewDate(d);
    }

    const nextMonth = () => {
        var d:Date = new Date(currentYear.current, currentMonth.current, 1);
        d = dm.dateDaysDiff(d, -32);
        
        setCurrentViewDate(d);
    }

    const openDayEvents = (dbData:any) => {
        openDateParams.current = dbData;
        
        setShowDayEvents(true);
    }

    const closeDayEvents = () => {
        setShowDayEvents(false);
    }

    const displayYearlyEvents = (eventsType:string) => {
        setShowYearlyEvents(eventsType);
    }

    const monthsNames = dm.getGregMonthsList();
    const years = Array.from({ length: 80 }, (_, i) => 1960 + i);
    
    return (
        <>
            <Navbar yearlyEventHandler={displayYearlyEvents}/>

            {
                showDayEvents &&
                <DateEvents 
                    closeHandler={closeDayEvents} 
                    dateParams={openDateParams.current}
                    refreshMonthPage={refreshMonthView}
                >
                </DateEvents>
            }

            {
                ( showYearlyEvents != '') &&
                <>
                    <YearlyEvents eventsType={showYearlyEvents} closeHandler={setShowYearlyEvents}/>
                </>
            }

            <div className='month-container'>
                <div className='month-header'>
                    <div className='arrow' onClick={prevMonth}>
                        <i className="fa fa-arrow-left"></i>
                    </div>
                    <div className='title'>
                        <select
                            onChange={(e:any) => setCurrentMonth(monthsNames.indexOf(e.target.value), true)}
                            value={currentMonthName.current}
                        >
                            {
                                monthsNames.map((month) => {
                                    return (
                                        <option
                                            key={month} 
                                            value={month} 
                                        >
                                            {month}
                                        </option>
                                    )
                                })
                            }
                        </select>

                        <select
                            onChange={(e:any) => setCurrentYear(e.target.value, true)}
                            value={currentYear.current}
                        >
                            {
                                years.map((year) => {
                                    return (
                                        <option 
                                            key={year}
                                            value={year} 
                                        >
                                            {year}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='arrow' onClick={nextMonth}>
                        <i className="fa fa-arrow-right"></i>
                    </div>
                </div>

                <div className='day-names'>
                    <div className='day-name'>ראשון</div>
                    <div className='day-name'>שני</div>
                    <div className='day-name'>שלישי</div>
                    <div className='day-name'>רביעי</div>
                    <div className='day-name'>חמישי</div>
                    <div className='day-name'>שישי</div>
                    <div className='day-name'>שבת</div>
                </div>

                <div id="month-view">
                    {
                        monthRows.current.map((r) => {
                            return (
                                <div key={r} className='week-row'>
                                    {
                                        monthDays.current.map((_, index) => {
                                            var ind:number = r*7 + index;
                                            if ((ind >= monthDays.current.length) || (index > 6))
                                                return;

                                            var data:any = monthDays.current[ind];
                                            return (
                                                <Day 
                                                    key={index} 
                                                    isToday={data.isToday} 
                                                    enable={data.enable} 
                                                    bigText={data.bigText} 
                                                    smallText={data.smallText} 
                                                    dbData={data.dbData}
                                                    onClickHandler={openDayEvents}
                                                >
                                                </Day>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Month;
