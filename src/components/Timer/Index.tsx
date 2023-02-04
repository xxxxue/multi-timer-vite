import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, RedoOutlined } from "@ant-design/icons";
import { useBoolean, useInterval } from "ahooks";
import { Button, Popconfirm } from "antd";
import classNames from "classnames";
import moment, { Moment } from "moment";
import { useMemo, useRef } from "react";
import { useSnapshot } from "valtio";
import { ITimerDataVO } from "@/model";
import { timerListState } from "@/store";
import { AddOrEdit, IAddOrEditRef } from "./AddOrEdit";

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
    timerListState[index].startTime = moment().toISOString();
  };

  let handleDelete = (v: string) => {
    let index = timerListState.findIndex((a) => a.startTime == v)!;
    timerListState.splice(index, 1);
  };

  let [update, updateFn] = useBoolean(false);
  useInterval(updateFn.toggle, 5000);

  let list = useMemo(() => {
    let ret: ITimerDataVO[] = [];

    timerListSnap.map((v) => {
      let endTime = moment(v.startTime)
        .add(v.hour ?? 0, "h")
        .add(v.minute ?? 0, "m");
      ret.push({
        ...v,
        endTimeMoment: endTime,
        endTime: endTime.format("MM-DD HH:mm:ss"),
        isValid: moment().isBefore(endTime),
      });
    });

    // 最近到期的排在前面
    ret.sort((a, b) => {
      return a.endTimeMoment.isSame(b.endTimeMoment)
        ? 0
        : a.endTimeMoment.isBefore(b.endTimeMoment)
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

  let diffTime = (time: Moment | string) => {
    let myTime: Moment = typeof time == "string" ? moment(time) : time;
    let nowTime = moment();
    let diff = moment.duration(myTime.diff(nowTime));
    let isBefore = myTime.isBefore(nowTime);
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
            {moment().format("MM.DD A h:mm:ss dddd")}
          </div>
          <Popconfirm
            title="删除所有过期的定时器?"
            okText="确定"
            showCancel={false}
            placement="left"
            onConfirm={handleDeleteAll}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button size="large" icon={<AppstoreAddOutlined />} onClick={handleAdd} />
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
                    <Popconfirm
                      title="确定删除?"
                      okText="确定"
                      showCancel={false}
                      placement="left"
                      onConfirm={() => handleDelete(v.startTime)}
                    >
                      <Button size="large" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </div>
                  <div>{v.endTime}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{diffTime(v.endTimeMoment)}</div>
                  <div className="text-orange-600">{v.endTimeMoment.calendar()}</div>
                  <div className="flex space-x-3 items-center">
                    <Popconfirm
                      title="重置开始时间?"
                      okText="确定"
                      showCancel={false}
                      placement="left"
                      onConfirm={() => handleReset(v.startTime)}
                    >
                      <Button size="large" className="text-gray-400" icon={<RedoOutlined />} />
                    </Popconfirm>
                    <Button
                      className="text-orange-500"
                      size="large"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(v.startTime)}
                    />
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
