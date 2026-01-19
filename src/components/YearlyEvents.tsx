import './YearlyEvents.css'
import api from '../api/api';
import dm from '../dateUtils.ts'
import { useEffect, useState, useRef } from 'react';
import { useUserContext } from '../context/User.tsx';
import Confirm from './Confirm.tsx'

type yearlyEventsParams = {
    eventsType:string,
    closeHandler:any,
    refreshMonthPage:any,
}

function YearlyEvents({ eventsType, closeHandler, refreshMonthPage }:yearlyEventsParams) {
    const [yearlyEventsHTML, setYearlyEventsHTML] = useState<any[]>([]);

    const { user } = useUserContext()!;

    const [showConfirm, setShowConfirm] = useState(false);
    const confirmParams = useRef<any>({});

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
                    id:rec.id,
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

    const printHtml = () => {
        let printHtmlData = `
            <html>
                <head>
                    <style>
                        .print-title {
                            display:grid;
                            place-items: center;
                            font-size: 36px;
                        }
                        
                        .yearly-events {
                            display: flex;
                            align-items: end;
                            flex-direction: column;		
                        }
                        
                        .month-name {
                            direction:rtl;
                            font-size: 28px;
                            margin-top: 24px;
                        }

                        td {
                            padding-right: 12px;
                            font-size: 20px;
                            direction: rtl;
                        }
                    </style>
                </head>
                <body>html-page-data</body>
            </html>
        `;

        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        const formattedDate = `${dd}/${mm}/${yyyy}`;

        let html = `
            <div class='print-date'>
                ${formattedDate}
            </div>

            <div class='print-title'>
                ${ eventsType == "greg" ? "ארועים בשנה לועזית" : "ארועים בשנה עברית"}
            </div>

        	<div class="yearly-events">
                events-by-month-data
            </div>
        `;

        let evevntsContent = '';
        yearlyEventsHTML.forEach((mData:any) => {
            evevntsContent += `
                <div class="month-name">
                    ${mData.name}
                </div>

                <table>
                    month-events-data
                </table>
            `;

            let monthEventsData = '';
            mData.events.forEach((evnt:any) => {
                monthEventsData += `
                    <tr>
                        <td>${evnt.desc}</td>
                        <td>${evnt.d}</td>
                    </tr>
                `;
            });
           
            evevntsContent = evevntsContent.replace('month-events-data', monthEventsData);
        });

        html = html.replace('events-by-month-data', evevntsContent);

        printHtmlData = printHtmlData.replace('html-page-data', html);
        
        const iframe:any = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.style.position = "absolute";
        iframe.style.left = "-9999px";

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`${printHtmlData}`);
        doc.close();

        iframe.onload = () => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            document.body.removeChild(iframe);
        };
    }

    const confirmDeleteEvent = (id:number, mIndex:number, index:number) => {
        confirmParams.current.id = id;
        confirmParams.current.mIndex = mIndex;
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
            let eventsList = [...yearlyEventsHTML];
            eventsList[confirmParams.current.mIndex].events.splice(confirmParams.current.index, 1);

            setYearlyEventsHTML(eventsList);
        }

        setShowConfirm(false);

        refreshMonthPage();
    }

    return (
        <div className='yearly-wrapper'>
            <div className='yearly-bg'>

                {
                    showConfirm &&
                    <Confirm 
                        text={confirmParams.current.text}
                        callback={deleteEvent}
                    >
                    </Confirm>
                }

                <div className='close' onClick={() => {closeHandler(false)}}>
                    X
                </div>
                <div className="title">
                    { eventsType == "greg" ? "ארועים בשנה לועזית" : "ארועים בשנה עברית"}
                </div>
                <div className="events">
                    { 
                        yearlyEventsHTML.map((mData:any, mIndex:number) => {
                            return (
                                <div key={mData.name} className="month-events">
                                    <div className='month-name'>
                                        {mData.name}
                                    </div>
                                    <table>
                                        <tbody>
                                        {
                                            mData.events.map((evnt:any, index:number) => {
                                                return (
                                                    <tr key={`${mData.name}-${index}`} className='event-desc'>
                                                        <td>{evnt.desc}</td>
                                                        <td>{evnt.d}</td>
                                                        <td className='delete'
                                                            onClick={() => confirmDeleteEvent(evnt.id, mIndex, index)}
                                                        >
                                                            <i className="fa fa-trash"></i>  
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='print'>
                    <i className="fa fa-print" onClick={() => {printHtml()}}></i>  
                </div>
            </div>
        </div>
    )
}

export default YearlyEvents;
