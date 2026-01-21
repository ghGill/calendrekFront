import './DateEvents.css'
import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import api from '../api/api'
import Confirm from './Confirm.tsx'
import { useUserContext } from '../context/User.tsx';
import dm from '../dateUtils.ts'

const SAVE_KIND = {
    "general": "general",
    "personal": "personal",
}

const SAVE_TYPE = {
    "greg": "greg",
    "heb": "heb",
    "both": "both",
}

const SAVE_MODE = {
    "add": "add",
    "edit": "edit",
}

type dateEventsParams = {
    closeHandler:Function,
    dateParams:any,
    refreshMonthPage:any,
}

function DateEvents({closeHandler, dateParams, refreshMonthPage}:dateEventsParams) {
    const loadDateEventsParams = useRef<any>({});

    const [events, setEvents] = useState<Array<any>>([]);
    const [eventDescription, setEventDescription] = useState('');
    const [saveType, setSaveType] = useState(SAVE_TYPE.greg);
    const [saveKind, setSaveKind] = useState(SAVE_KIND.general);

    const [gregMonthSelect, setGregMonthSelect] = useState(-1);
    const [gregDaySelect, setGregDaySelect] = useState(-1);
    const [hebMonthSelect, setHebMonthSelect] = useState(-1);
    const [hebDaySelect, setHebDaySelect] = useState(-1);

    const [displayEvents, setDisplayEvents] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const confirmParams = useRef<any>({});

    const [saveRecordId, setSaveRecordId] = useState(0);
    const saveMode = useRef<string>(SAVE_MODE.add);

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
        loadDateEventsParams.current = {
            user_id:user?.id,
            g_day: dateParams.gDay,
            g_month: dateParams.gMonth,
            h_day: dateParams.hDay,
            h_month: dateParams.hMonth,
            h_query_months:dateParams.hQueryMonths,
        }

        setGregMonthSelect(dateParams.gMonth);
        setGregDaySelect(dateParams.gDay);
        setHebMonthSelect(dateParams.hMonth);
        setHebDaySelect(dateParams.hDay);
        
        loadDateEvent(loadDateEventsParams.current);
    }, []);

    useEffect(() => {
        setDisplayEvents(true);
    }, [displayEvents]);

    const clearAddEvent = () => {
        setEventDescription('');
        setSaveRecordId(0);
        setSaveMode(SAVE_MODE.add);
    }

    const addEvent = async () => {
        if (eventDescription == '')
            return;

        let saveParams:any = {
            description:eventDescription
        };

        switch (saveKind) {
            case SAVE_KIND.personal:
                saveParams.user_id = user?.id;
                break;

            case SAVE_KIND.general:
                saveParams.user_id = 0;
        }

        switch(saveType) {
            case 'greg':
                saveParams.g_day = Math.max(0, gregDaySelect);
                saveParams.g_month = Math.max(0, gregMonthSelect);
                saveParams.h_day = -1;
                saveParams.h_month = -1;
                break;

            case 'heb':
                saveParams.h_day = Math.max(0, hebDaySelect);
                saveParams.h_month = Math.max(0, hebMonthSelect);
                saveParams.g_day = -1;
                saveParams.g_month = -1;
                break;

            case 'both':
                saveParams.g_day = Math.max(0, gregDaySelect);
                saveParams.g_month = Math.max(0, gregMonthSelect);
                saveParams.h_day = Math.max(0, hebDaySelect);
                saveParams.h_month = Math.max(0, hebMonthSelect);
                break;
        }

        let result:any = null;
        if (!isEditMode())
            result = await api.addEvent(saveParams);
        else {
            saveParams.id = saveRecordId;
            result = await api.updateEvent(saveParams);
        }

        if (result.success) {
            await loadDateEvent(loadDateEventsParams.current);
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
        clearAddEvent();

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

    const editEvent = (evnt:any) => {
        if (saveRecordId == evnt.id) {
            clearAddEvent();
            return
        }

        setSaveMode(SAVE_MODE.edit);

        setSaveRecordId(evnt.id);

        setSaveKind(evnt.user_id == 0 ? SAVE_KIND.general : SAVE_KIND.personal);

        const saveType:string = 
            ((evnt.h_day > -1) && (evnt.g_day > -1)) ? 
                SAVE_TYPE.both : 
            (evnt.h_day > -1) ? 
                SAVE_TYPE.heb :
                SAVE_TYPE.greg;

        switch (saveType) {
            case SAVE_TYPE.greg:
                setGregMonthSelect(evnt.g_month);
                setGregDaySelect(evnt.g_day);
                setHebMonthSelect(hebMonthSelect);
                setHebDaySelect(hebDaySelect);
                break;

            case SAVE_TYPE.heb:
                setGregMonthSelect(gregMonthSelect);
                setGregDaySelect(gregDaySelect);
                setHebMonthSelect(evnt.h_month);
                setHebDaySelect(evnt.h_day);
                break;

            case SAVE_TYPE.both:
                setGregMonthSelect(evnt.g_month);
                setGregDaySelect(evnt.g_day);
                setHebMonthSelect(evnt.h_month);
                setHebDaySelect(evnt.h_day);
                break;
        }
        
        setSaveType(saveType);

        setEventDescription(evnt.description);
    }

    const setSaveMode = (mode:string) => {
        saveMode.current = mode;
    }

    const isEditMode = ():boolean => {
        return saveMode.current == SAVE_MODE.edit;
    }

    const addEventSelects:any = dm.getAddEventDatesList();

    return (
        <>
            {
                displayEvents &&
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
                                                <tr key={evnt.description} className={`${(saveRecordId == evnt.id) ? 'edit-mode' : ''}`}>
                                                    <td className='delete' onClick={() => confirmDeleteEvent(evnt.id, index)}>
                                                        <i className="fa fa-trash"></i>
                                                    </td>
                                                    <td>
                                                        <div className='event-type'>
                                                            <div className={`type-letter ${[1,3].includes(evnt.event_type) ? 'select' : ''}`}>ל</div>
                                                            <div className={`type-letter ${[2,3].includes(evnt.event_type) ? 'select' : ''}`}>ע</div>
                                                        </div>
                                                    </td>
                                                    <td className='description' onClick={() => editEvent(evnt)}>
                                                        {evnt.description}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                        <div className={`add-event ${(saveRecordId > 0) ? 'edit-mode' : ''}`}>
                            <div className='options'>
                                <b><label>סוג ארוע</label></b>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="kind" 
                                        value={SAVE_KIND.personal} 
                                        checked={saveKind == SAVE_KIND.personal} onChange={setEventKind} 
                                    />
                                    אישי
                                </label>
                                <label>
                                    <input 
                                        type="radio" 
                                        name="kind" 
                                        value={SAVE_KIND.general} 
                                        checked={saveKind == SAVE_KIND.general} 
                                        onChange={setEventKind} 
                                    />
                                    כללי
                                </label>
                            </div>

                            <div className='event-dates'>
                                <div className='event-date'>
                                    <select value={gregMonthSelect} onChange={((e:any) => setGregMonthSelect(e.target.value))}>
                                        {
                                            addEventSelects.greg_months.map((mData:any) => {
                                                return <option key={mData.index} value={mData.index}>{mData.name}</option>
                                            })
                                        }
                                    </select>
                                    <select value={gregDaySelect} onChange={((e:any) => setGregDaySelect(e.target.value))}>
                                        {
                                            addEventSelects.greg_days.map((d:number) => {
                                                return <option key={d} value={d}>{d}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='event-date'>
                                    <select value={hebMonthSelect} onChange={((e:any) => setHebMonthSelect(e.target.value))}>
                                        {
                                            addEventSelects.heb_months.map((mData:any) => {
                                                return <option key={mData.index} value={mData.index}>{mData.name}</option>
                                            })
                                        }
                                    </select>

                                    <select value={hebDaySelect} onChange={((e:any) => setHebDaySelect(e.target.value))}>
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
                                    <input 
                                        type="radio" 
                                        id="op1" 
                                        name="save" 
                                        value={SAVE_TYPE.greg}
                                        checked={saveType == SAVE_TYPE.greg}  
                                        onChange={setSaveEventType} 
                                    />
                                    לועזי
                                </label>
                                <label htmlFor="op2">
                                    <input 
                                        type="radio" 
                                        id="op2" 
                                        name="save" 
                                        value={SAVE_TYPE.heb}
                                        checked={saveType == SAVE_TYPE.heb} 
                                        onChange={setSaveEventType} 
                                    />
                                    עברי
                                </label>
                                <label htmlFor="op3">
                                    <input 
                                        type="radio" 
                                        id="op3" 
                                        name="save" 
                                        value={SAVE_TYPE.both}
                                        checked={saveType == SAVE_TYPE.both} 
                                        onChange={setSaveEventType} />
                                    שניהם
                                </label>
                            </div>

                            <div className='description'>
                                <input type="text" value={eventDescription} onChange={updateNewEventDesc}/>
                                <button type="button" onClick={addEvent}>{!isEditMode() ? 'הוספה' : 'עדכון'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default DateEvents;
