import './YearlyEvents.css'
import api from '../api/api';
import dm from '../dateUtils.ts'
import { useEffect, useState } from 'react';
import { useUserContext } from '../context/User.tsx';

type yearlyEventsParams = {
    eventsType:string,
    closeHandler:any
}

function YearlyEvents({ eventsType, closeHandler }:yearlyEventsParams) {
    const [yearlyEventsHTML, setYearlyEventsHTML] = useState<any[]>([]);

    const { user } = useUserContext()!;

    const loadEvents = async () => {
        const result:any = await api.getYearlyEvents({user_id:user?.id, type:eventsType});

        if (result.success) {
            const monthsKey:string = (eventsType == 'greg' ? 'greg_months' : 'heb_months');
            let eventsData:any = dm.getAddEventDatesList();
            const sortedMonths:any[] = eventsData[monthsKey].sort((a:any, b:any) => a.order - b.order);
            const allMonthsData:any = {};
            sortedMonths.forEach((data:any) => { 
                allMonthsData[data.index] = {order:data.order, name:data.name, events:[]};
            });

            result.data.forEach((rec:any) => {
                allMonthsData[rec.m].events.push({
                    d:(eventsType == 'greg' ? rec.d : eventsData.heb_days[rec.d-1]), 
                    desc:rec.description
                })
            })
            
            let sortedOutput:any[] = Array.from({length:sortedMonths.length}, (_, i) => (i ? null : null));
            Object.keys(allMonthsData).map((key:string) => {
                sortedOutput[Number(allMonthsData[key].order)] = allMonthsData[key];
            })
            
            setYearlyEventsHTML(sortedOutput);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    return (
        <div className='yearly-wrapper'>
            <div className='yearly-bg'>
                <div className='close' onClick={() => {closeHandler(false)}}>
                    X
                </div>
                <div className="title">
                    { eventsType == "greg" ? "ארועים בשנה לועזית" : "ארועים בשנה עברית"}
                </div>
                <div className="events">
                    { 
                        yearlyEventsHTML.map((mData:any) => {
                            return (
                                <div key={mData.name} className="month-events">
                                    <div className='month-name'>
                                        {mData.name}
                                    </div>

                                    {
                                        mData.events.map((evnt:any, index:number) => {
                                            return (
                                                <div key={`${mData.name}-${index}`} className='event-desc'>
                                                    <div>{evnt.d}</div>
                                                    <div>-</div>
                                                    <div>{evnt.desc}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                <div className='print'>
                    <i className="fa fa-print"></i>  
                </div>
            </div>
        </div>
    )
}

export default YearlyEvents;
