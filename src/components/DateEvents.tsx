import './DateEvents.css'
import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import api from '../api/api'
import Confirm from './Confirm.tsx'
import { useUserContext } from '../context/User.tsx';
import dm from '../dateUtils.ts'

type dateEventsParams = {
    closeHandler:Function,
    dateParams:any,
    refreshMonthPage:any,
}

function DateEvents({closeHandler, dateParams, refreshMonthPage}:dateEventsParams) {
    const [events, setEvents] = useState<Array<any>>([]);
    const [eventDescription, setEventDescription] = useState('');
    const [saveType, setSaveType] = useState('greg');
    const [saveKind, setSaveKind] = useState('personal');

    const gregMonthSelect = useRef<HTMLSelectElement>(null);
    const gregDaySelect = useRef<HTMLSelectElement>(null);
    const hebMonthSelect = useRef<HTMLSelectElement>(null);
    const hebDaySelect = useRef<HTMLSelectElement>(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const confirmParams = useRef<any>({});

    const { user } = useUserContext()!;

    const loadDateEvent = async (params:any) => {
        const result:any = await api.getAllEvents(params);

        let dateEvents:any[] = [];
        result.data.map((evnt:any) => {
            dateEvents.push(evnt);
        });

        setEvents(dateEvents);
    }

    useEffect(() => {
        const queryParams = {
            user_id:user?.id,
            g_day: dateParams.gDay,
            g_month: dateParams.gMonth,
            h_day: dateParams.hDay,
            h_month: dateParams.hMonth,
            h_query_months:dateParams.hQueryMonths,
        }

        loadDateEvent(queryParams);
    }, []);

    const clearAddEvent = () => {
        setEventDescription('');
    }

    const addEvent = async () => {
        if (eventDescription == '')
            return;

        let saveParams:any = {
            g_day:-1,
            g_month:-1,
            h_day:-1,
            h_month:-1,
            description:eventDescription
        };

        switch (saveKind) {
            case 'personal':
                saveParams.user_id = user?.id;
                break;

            case 'general':
                saveParams.user_id = 0;
        }

        let eventType:number = -1;

        switch(saveType) {
            case 'greg':
                saveParams.g_day = gregDaySelect.current?.value;
                saveParams.g_month = gregMonthSelect.current?.value;
                eventType=1;
                break;

            case 'heb':
                saveParams.h_day = hebDaySelect.current?.value;
                saveParams.h_month = hebMonthSelect.current?.value;
                eventType=2;
                break;

            case 'both':
                saveParams.g_day = gregDaySelect.current?.value;
                saveParams.g_month = gregMonthSelect.current?.value;
                saveParams.h_day = hebDaySelect.current?.value;
                saveParams.h_month = hebMonthSelect.current?.value;
                eventType=3;
                break;
        }

        const result:any = await api.addEvent(saveParams);
        if (result.success) {
            const sameGregDate = (saveParams.g_day == dateParams.gDay) && (saveParams.g_month == dateParams.gMonth);
            const sameHebDate = (saveParams.h_day == dateParams.hDay) && (saveParams.h_month == dateParams.hMonth);
            if (sameGregDate || sameHebDate) {
                const eventData:any = {
                    description:eventDescription, 
                    id:result.id,
                    event_type:eventType

                };
                let newEventsList = [...events]
                newEventsList.push(eventData);
                
                setEvents(newEventsList);
            }

            refreshMonthPage();
        }

        clearAddEvent();
    }

    const confirmDeleteEvent = (id:number, index:number) => {
        confirmParams.current.id = id;
        confirmParams.current.index = index;
        confirmParams.current.text = "האם למחוק את הארוע?";

        setShowConfirm(true);
    }

    const deleteEvent = async (deleteEvent:boolean) => {
        if (!deleteEvent) {
            setShowConfirm(false);
            return;
        }

        const result:any = await api.deleteEvent(confirmParams.current.id);

        if (result.success) {
            let eventsList = [...events];
            eventsList.splice(confirmParams.current.index, 1);

            setEvents(eventsList);

            refreshMonthPage();
        }

        setShowConfirm(false);
    }

    const updateNewEventDesc = (e: ChangeEvent) => {
        setEventDescription((e.target as HTMLInputElement).value);
    }

    const setSaveEventType = (e:ChangeEvent) => {
        setSaveType((e.target as HTMLInputElement).value);
    }

    const setEventKind = (e:ChangeEvent) => {
        setSaveKind((e.target as HTMLInputElement).value);
    }

    const addEventSelects:any = dm.getAddEventDatesList();

    return (
        <div className='events-wrapper'>
            <div className="events-bg"></div>
            <div className="events">
                {
                    showConfirm &&
                    <Confirm 
                        text={confirmParams.current.text}
                        callback={deleteEvent}
                    >
                    </Confirm>
                }

                <div className='close'>
                    <span onClick={() => {closeHandler()}}>X</span>
                </div>
                <div className='title'>
                    <label>{dateParams.hTitle}</label>
                    <label>{dateParams.gTitle}</label>
                </div>
                <div className="events-table">
                    <table>
                        <tbody>
                            {
                                events.map((evnt:any, index:number) => {
                                    return (
                                        <tr key={evnt.description}>
                                            <td className='delete' onClick={() => confirmDeleteEvent(evnt.id, index)}>
                                                <i className="fa fa-trash"></i>  
                                            </td>
                                            <td>
                                                <div className='event-type'>
                                                    <div className={`type-letter ${[1,3].includes(evnt.event_type) ? 'select' : ''}`}>ל</div>
                                                    <div className={`type-letter ${[2,3].includes(evnt.event_type) ? 'select' : ''}`}>ע</div>
                                                </div>
                                            </td>
                                            <td className='description'>
                                                {evnt.description}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className='add-event'>
                    <div className='options'>
                        <b><label>סוג ארוע</label></b>
                        <label htmlFor="kind1">
                            <input type="radio" id="kind1" name="kind" value="personal" checked={saveKind == 'personal'} onChange={setEventKind} />
                            אישי
                        </label>
                        <label htmlFor="kind2">
                            <input type="radio" id="kind2" name="kind" value="general" checked={saveKind == 'general'} onChange={setEventKind} />
                            כללי
                        </label>
                    </div>

                    <div className='event-dates'>
                        <div className='event-date'>
                            <select ref={gregMonthSelect}>
                                {
                                    addEventSelects.greg_months.map((mData:any) => {
                                        return <option key={mData.index} value={mData.index}>{mData.name}</option>
                                    })
                                }
                            </select>
                            <select ref={gregDaySelect}>
                                {
                                    addEventSelects.greg_days.map((d:number) => {
                                        return <option key={d} value={d}>{d}</option>
                                    })
                                }
                            </select>
                        </div>

                        <div className='event-date'>
                            <select ref={hebMonthSelect}>
                                {
                                    addEventSelects.heb_months.map((mData:any) => {
                                        return <option key={mData.index} value={mData.index}>{mData.name}</option>
                                    })
                                }
                            </select>

                            <select ref={hebDaySelect}>
                                {
                                    addEventSelects.heb_days.map((dName:string, index:number) => {
                                        return <option key={index} value={index+1}>{dName}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>

                    <div className='options'>
                        <b><label>שמור בתאריך</label></b>
                        <label htmlFor="op1">
                            <input type="radio" id="op1" name="save" value="greg" checked={saveType == 'greg'}  onChange={setSaveEventType} />
                            לועזי
                        </label>
                        <label htmlFor="op2">
                            <input type="radio" id="op2" name="save" value="heb" checked={saveType == 'heb'} onChange={setSaveEventType} />
                            עברי
                        </label>
                        <label htmlFor="op3">
                            <input type="radio" id="op3" name="save" value="both" checked={saveType == 'both'} onChange={setSaveEventType} />
                            שניהם
                        </label>
                    </div>

                    <div className='description'>
                        <input type="text" value={eventDescription} onChange={updateNewEventDesc}/>
                        <button type="button" onClick={addEvent}>הוספה</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DateEvents;
