import { useBoolean, useInterval } from "ahooks";
import classNames from "classnames";
import { useMemo, useRef } from "react";
import { useSnapshot } from "valtio";
import { ITimerDataVO } from "@/model";
import { timerListState } from "@/store";
import { AddOrEdit, IAddOrEditRef } from "./AddOrEdit";
import dayjs, { Dayjs } from "dayjs";

import { Button, Dialog } from "antd-mobile";
import { AddCircleOutline, DeleteOutline, EditSOutline, RedoOutline } from "antd-mobile-icons";

function Index() {
  let timerListSnap = useSnapshot(timerListState);
  let addOrEditRef = useRef<IAddOrEditRef>(null);

  let handleAdd = () => {
    addOrEditRef.current?.open();
  };

  let handleEdit = (v: string) => {
    addOrEditRef.current?.open(v);
  };

  let handleReset = (v: string) => {
    let index = timerListState.findIndex((a) => a.startTime == v)!;
    timerListState[index].startTime = dayjs().toISOString();
  };

  let handleDelete = (v: string) => {
    let index = timerListState.findIndex((a) => a.startTime == v)!;
    timerListState.splice(index, 1);
  };

  let [update, updateFn] = useBoolean(false);
  useInterval(updateFn.toggle, 10000);

  let list = useMemo(() => {
    let ret: ITimerDataVO[] = [];

    timerListSnap.map((v) => {
      let endTime = dayjs(v.startTime)
        .add(Number(v.day ?? 0), "days")
        .add(Number(v.hour ?? 0), "hours")
        .add(Number(v.minute ?? 0), "minutes");

      ret.push({
        ...v,
        endTimeDayjs: endTime,
        endTime: endTime.format("MM-DD HH:mm:ss"),
        isValid: dayjs().isBefore(endTime),
      });
    });

    // 最近到期的排在前面
    ret.sort((a, b) => {
      return a.endTimeDayjs.isSame(b.endTimeDayjs)
        ? 0
        : a.endTimeDayjs.isBefore(b.endTimeDayjs)
        ? -1
        : 1;
    });

    return [
      ...ret.filter((a) => {
        return a.isValid == true;
      }),
      ...ret.filter((a) => {
        return a.isValid == false;
      }),
    ];
  }, [timerListSnap, update]);

  let handleDeleteAll = () => {
    list.map((a) => {
      if (a.isValid == false) {
        handleDelete(a.startTime);
      }
    });
  };

  let diffTime = (time: Dayjs | string) => {
    let myTime: Dayjs = typeof time == "string" ? dayjs(time) : time;
    let nowTime = dayjs();
    let diff = dayjs.duration(myTime.diff(nowTime));
    let isBefore = myTime.isBefore(nowTime);

    let year = diff.years();
    let month = diff.months();
    let day = diff.days();
    let hour = diff.hours();
    let minute = diff.minutes();
    let second = diff.seconds();

    let ret: string[] = [];

    // 将负数变为正数
    function abs(num: number) {
      if (num < 0) {
        return Math.abs(num);
      }
      return num;
    }

    // 到期后,在时间前面添加 "-" 号
    ret.push(isBefore ? "-" : "");

    if (year != 0) {
      ret.push(`${abs(year)}年`);
    }
    if (month != 0) {
      ret.push(`${abs(month)}月`);
    }
    if (day != 0) {
      ret.push(`${abs(day)}天`);
    }
    if (hour != 0) {
      ret.push(`${abs(hour)}时`);
    }
    if (minute != 0) {
      ret.push(`${abs(minute)}分`);
    }
    if (second != 0) {
      ret.push(`${abs(second)}秒`);
    }
    // 结果:
    //  273年 11月 23天 23时 59分 48秒
    //  1月 29天 23时 58分 28秒
    // 21时 26分 19秒
    // - 1分 2秒
    return ret.join(" ");
  };
  return (
    <>
      <AddOrEdit ref={addOrEditRef} />
      <div className="p-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-lg cursor-pointer" onClick={updateFn.toggle}>
            {dayjs().format("MM.DD A h:mm:ss dddd")}
          </div>
          <Button
            color="danger"
            onClick={() => {
              Dialog.confirm({
                title: "确定删除所有过期的定时器吗",
                onConfirm: () => {
                  handleDeleteAll();
                },
              });
            }}
          >
            <DeleteOutline />
          </Button>
          <Button color="primary" onClick={handleAdd}>
            <AddCircleOutline />
          </Button>
        </div>
        <div className="space-y-4">
          {list.map((v, i) => {
            return (
              <div
                key={v.startTime}
                className={classNames(
                  "rounded-md  border-2 border-solid flex-row p-2 space-y-1 shadow-xl",
                  v.isValid ? "border-blue-400" : "border-red-500 bg-yellow-300 "
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="text-2xl text-red-500">{v.title}</div>
                  <div>
                    <Button
                      color="danger"
                      onClick={() => {
                        Dialog.confirm({
                          title: "确定删除吗",
                          onConfirm: () => {
                            handleDelete(v.startTime);
                          },
                        });
                      }}
                    >
                      <DeleteOutline />
                    </Button>
                  </div>
                  <div>{v.endTime}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{diffTime(v.endTimeDayjs)}</div>
                  <div className="text-orange-600">{v.endTimeDayjs.calendar()}</div>
                  <div className="flex space-x-3 items-center">
                    <Button
                      className="text-gray-400"
                      onClick={() => {
                        Dialog.confirm({
                          title: "重新计时?",
                          onConfirm: () => {
                            handleReset(v.startTime);
                          },
                        });
                      }}
                    >
                      <RedoOutline />
                    </Button>
                    <Button className="text-orange-500" onClick={() => handleEdit(v.startTime)}>
                      <EditSOutline />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
export default Index;
