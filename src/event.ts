/*
 * @Author: tackchen
 * @Date: 2021-08-08 10:27:31
 * @LastEditors: tackchen
 * @LastEditTime: 2021-08-08 10:33:26
 * @FilePath: /tc-image/src/event.ts
 * @Description: Coding something
 */
import {IJson} from './type';

/* 创建一个简单的事件队列
let e = creatEventReady();
e.onEventReady((...args)=>{
    console.log(args);
});
e.eventReady(1,2,3)
*/

export interface IEventReadyListener<T = any> {
    (...args: T[]): void
}

interface IEventReadyOption<T> {
    once?: boolean;
    after?: boolean;
    head?: boolean;
    listener: IEventReadyListener<T>;
}
export interface IEventReady<T = any> {
    onEventReady(option: IEventReadyListener<T> | IEventReadyOption<T>, ...args: T[]): IEventReadyListener<T>;
    eventReady(...args: T[]): void;
    removeListener(fn: Function): void;
    isFirstReady(): boolean;
}

export function creatEventReady<T = any> (): IEventReady<T> {
    const queue: {
        listener: IEventReadyListener<T>;
        args: T[];
        once: boolean;
    }[] = [];
    let lastArgs: T[] | null = null;
    let isFirst = true;

    function onEventReady (option: IEventReadyListener<T> | IEventReadyOption<T>, ...args: T[]) {
        let once = false, after = false, head = false;
        let listener: IEventReadyListener<T>;
        if (typeof option === 'object') {
            if (typeof option.once === 'boolean') once = option.once;
            if (typeof option.after === 'boolean') after = option.after;
            if (typeof option.head === 'boolean') head = option.head;
            listener = option.listener;
        } else
            listener = option;
        if (!queue.find(item => item.listener === listener))
            queue[head ? 'unshift' : 'push']({listener, args, once});
        if (lastArgs !== null && !after) {
            if (args.length === 0 && lastArgs) args = lastArgs;
            listener(...args);
            if (once) removeListener(listener);
        }
        return listener;
    }
     
    function eventReady (...args: T[]) {
        lastArgs = args;
        queue.forEach(item => {
            item.listener(...((args.length === 0) ? item.args : args));
            if (item.once) removeListener(item.listener);
        });
        isFirst = false;
    }

    function removeListener (listener: IEventReadyListener<T>) {
        const result = queue.find(item => item.listener === listener);
        if (result) queue.splice(queue.indexOf(result), 1);
    }

    return {
        onEventReady,
        eventReady,
        removeListener,
        isFirstReady: () => isFirst
    };
}

export const Event = (() => {
    let map: IJson<IEventReady<any>> = {};
    return {
        regist<T = any> (name: string, option: IEventReadyListener<T> | IEventReadyOption<T>) {
            if (!map[name]) map[name] = creatEventReady<T>();
            return map[name].onEventReady(option);
        },
        emit (name: string, data?: any) {
            if (!map[name]) return false;
            map[name].eventReady(data);
            return true;
        },
        removeListener<T = any> (name: string, listener: IEventReadyListener<T>) {
            if (!map[name]) return;
            map[name].removeListener(listener);
        },
        removeEvent (name: string) {delete map[name];},
        clear () {map = {};},
        isFirstEmit (name: string) {
            if (!map[name]) return true;
            return map[name].isFirstReady();
        }
    };
})();