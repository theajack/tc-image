/*
 * @Author: tackchen
 * @Date: 2021-08-13 13:05:41
 * @LastEditors: tackchen
 * @FilePath: \tc-image\src\utils\time-log.ts
 * @Description: Coding something
 */

let lastTime: Date;

interface ITimeLogger {
    init(date?: Date): void;
    record(): number;
    run(func: Function): void;
}

export const TimeLoger: ITimeLogger = {
    init (date = new Date()) {
        lastTime = date;
        console.log(`Init time logger: ${dateToStr(date)}`);
    },
    record () {
        const newDate = new Date();
        let time = 0;
        if (!lastTime) {
            this.init();
        } else {
            time = newDate.getTime() - lastTime.getTime();
            console.log(`Cost time: ${time} ms.`);
        }
        lastTime = newDate;
        return time;
    },
    run (func: Function) {
        this.init();
        func();
        return this.record();
    }
};

declare global{
    interface Window{
        TimeLoger: {
        };
    }
}

export function dateToStr (date: Date) {
    return `${date.getFullYear()}-${fn(date.getMonth() + 1)}-${fn(date.getDate())} ${fn(date.getHours())}:${fn(date.getMinutes())}:${date.getMilliseconds()}`;
}

function fn (num: number) {
    return num < 10 ? (`0${num}`) : num;
}

window.TimeLoger = TimeLoger;