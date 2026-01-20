import { HDate, gematriya } from '@hebcal/core';

const hebMonthData:any = {
    'Nisan'   :{name:'ניסן', index:0, order:8},
    'Iyyar'   :{name:'אייר', index:1, order:9},
    'Sivan'   :{name:'סיון', index:2, order:10},
    'Tamuz'   :{name:'תמוז', index:3, order:11},
    'Av'      :{name:'אב', index:4, order:12},
    'Elul'    :{name:'אלול', index:5, order:13},
    'Tishrei' :{name:'תשרי', index:6, order:0},
    'Cheshvan':{name:'חשון', index:7, order:1},
    'Kislev'  :{name:'כסלו', index:8, order:2},
    'Tevet'   :{name:'טבת', index:9, order:3},
    "Sh'vat"  :{name:'שבט', index:10, order:4},
    'Adar'    :{name:'אדר', index:11, order:5, not_leap_year_month:['Adar I', 'Adar II']},
    'Adar II' :{name:"אדר ב'", index:12, order:6, leap_year_month:['Adar']},
    'Adar I'  :{name:"אדר א'", index:13, order:7},
}

const hebDayName:any = [
    {name:'א'},
    {name:'ב'},
    {name:'ג'},
    {name:'ד'},
    {name:'ה'},
    {name:'ו'},
    {name:'ז'},
    {name:'ח'},
    {name:'ט'},
    {name:'י'},
    {name:'יא'},
    {name:'יב'},
    {name:'יג'},
    {name:'יד'},
    {name:'טו'},
    {name:'טז'},
    {name:'יז'},
    {name:'יח'},
    {name:'יט'},
    {name:'כ'},
    {name:'כא'},
    {name:'כב'},
    {name:'כג'},
    {name:'כד'},
    {name:'כה'},
    {name:'כו'},
    {name:'כז'},
    {name:'כח'},
    {name:'כט'},
    {name:'ל'},
]

const gregMonthNames:any = {
  "January":"ינואר", 
  "February":"פברואר", 
  "March":"מרץ", 
  "April":"אפריל", 
  "May":"מאי", 
  "June":"יוני",
  "July":"יולי", 
  "August":"אוגוסט", 
  "September":"ספטמבר", 
  "October":"אוקטובר", 
  "November":"נובמבר", 
  "December":"דצמבר",
};


const dayInMS = 1000 * 60 * 60 * 24;

class dateManager {
    constructor() {
    }

    getGregMonthsList() {
        return Object.keys(gregMonthNames);
    }

    getHebMonthsList() {
        return Object.keys(gregMonthNames).map((hName:string) => gregMonthNames[hName]);
    }

    getAddEventDatesList() {
        let output:any = {greg_months:[], greg_days:[], heb_months:[], heb_days:[]};

        output.greg_months = Object.keys(gregMonthNames).map((k:string, index:number) => { return {index:index, order:index, name:gregMonthNames[k]}});
        output.greg_days = Array.from({ length: 31 }, (_, i) => i+1);
        const sortedHebMonths:any[] = Object.entries(hebMonthData).sort((a:any, b:any) => a[1].order - b[1].order);
        output.heb_months = sortedHebMonths.map((k:any) => { return {index:k[1].index, order:k[1].order, name:k[1].name}});
        output.heb_days = hebDayName.map((d:any) => d.name);

        return output;
    }

    daysInMonth(year:number, month:number):number {
        return new Date(year, month, 0).getDate();
    }

    dayInWeek(year:number, month:number, day:number):number {
        return new Date(year, month, day).getDay();
    }
    
    gregorianToHebrew(gDate:Date) {
        const hDate = new HDate(gDate);
        
        var hebDay:string = hebDayName[hDate.getDate()-1].name;
        var hebMonth:string = hebMonthData[hDate.getMonthName()].name;
        var hebYear:string = gematriya(hDate.getFullYear());

        return {
            hebDay: hebDay,
            hebMonth: hebMonth,
            hebYear: hebYear,
            nHebDay: hDate.getDate(),
            nHebMonth: hebMonthData[hDate.getMonthName()].index,
            nHebYear: hDate.getFullYear(),
            nHebQueryMonth: this.getRelatedMonths(hDate.getMonthName(), hDate.isLeapYear()),
            isLeapYear:hDate.isLeapYear(),
        };
    }

    dateDaysDiff(date:Date, days:number):Date {
        var dateMs = date.getTime() - (days * dayInMS);

        return new Date(dateMs);
    }

    sameDate(d1:Date, d2:Date):boolean {
        return (
            (d1.getFullYear() == d2.getFullYear()) &&
            (d1.getMonth() == d2.getMonth()) &&
            (d1.getDate() == d2.getDate())
        );
    }

    getRelatedMonths(monthName:string, isLeapYear:boolean) {
        const monthData = hebMonthData[monthName];
        let queryMonths = [monthData.index];
        if (isLeapYear) {
            if (monthData.leap_year_month) {
                monthData.leap_year_month.map((mName:string) => {
                    queryMonths.push(hebMonthData[mName].index);
                })
            }
        }
        else {
            if (monthData.not_leap_year_month) {
                monthData.not_leap_year_month.map((mName:string) => {
                    queryMonths.push(hebMonthData[mName].index);
                })
            }
        }

        // return `(${queryMonths.join(',')})`;
        return queryMonths;
    }
}

export default new dateManager();
