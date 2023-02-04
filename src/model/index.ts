import { Moment } from "moment";

export interface ITimerData {
    /** startTime 是该对象的唯一 ID */
    startTime: string;
    // 标题
    title: string;
    // 小时
    hour: number;
    // 分钟
    minute: number;
}

export interface ITimerDataVO extends ITimerData {
    // 倒计时结束的时间
    endTime: string;
    // moment 对象
    endTimeMoment: Moment;
    // 是否有效 (倒计时还没结束)
    isValid: boolean;
}