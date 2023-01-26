import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, RedoOutlined } from "@ant-design/icons";
import { useInterval, useUpdate } from "ahooks";
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space } from "antd";
import classNames from "classnames";
import moment, { Moment } from "moment";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { proxy, snapshot, subscribe, useSnapshot } from "valtio";

interface ITimerData {
  /** startTime 是该对象的唯一 ID */
  startTime: string;
  // 标题
  title: string;
  // 小时
  hour: number;
  // 分钟
  minute: number;
}

interface ITimerDataVO extends ITimerData {
  // 倒计时结束的时间
  endTime: string;
  // moment 对象
  endTimeMoment: Moment;
  // 是否有效 (倒计时还没结束)
  isValid : boolean;
}

// 持久化
function proxyWithPersist<T extends Object>(
  value: T,
  options: {
    key: string;
  }
) {
  const local = localStorage.getItem(options.key);
  const state = proxy<T>(local ? JSON.parse(local) : value);
  subscribe(state, () => {
    localStorage.setItem(options.key, JSON.stringify(snapshot(state)));
  });
  return state;
}

let timerListState = proxyWithPersist<ITimerData[]>([], { key: "my-timer-data" });

export interface IAddOrEditRef {
  open: (v?: string) => void;
}

export interface IProps {}

let AddOrEdit = forwardRef<IAddOrEditRef, IProps>((props, forwardedRef) => {
  useImperativeHandle(
    forwardedRef,
    () => ({
      open: handleOpen,
    }),
    [] // 依赖项,  同 useEffect
  );

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  let handleOpen = (v?: string) => {
    setModalOpen(true);
    formRef.resetFields();
    if (v != undefined) {
      console.log(v);
      let item = timerListState.find((a) => a.startTime === v)!;

      formRef.setFieldsValue(item);
    }
  };

  let handleSubmit = () => {
    formRef.validateFields().then((v) => {
      console.log(v);
      if (v.startTime != undefined) {
        let index = timerListState.findIndex((a) => a.startTime === v.startTime);

        timerListState[index] = { ...v };
      } else {
        timerListState.push({ ...v, startTime: moment().toISOString() });
      }
      setModalOpen(false);
    });
  };

  let [formRef] = Form.useForm<ITimerData>();

  let handleSetZero = () => {
    formRef.setFieldsValue({
      hour: 0,
      minute: 0,
    });
  };

  let handleSetTitle = (name: string) => {
    formRef.setFieldsValue({
      title: name,
    });
  };
  return (
    <>
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        closable={false}
        footer={
          <>
            <Button type="primary" onClick={handleSubmit}>
              确定
            </Button>
          </>
        }
      >
        <Form form={formRef} name="modalForm" autoComplete="off">
          <Form.Item name="startTime" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="title"
            required
            label="标题"
            rules={[{ required: true }]}
            extra={
              <Space>
                <Button type="default" onClick={() => handleSetTitle("海岛-官服")}>
                  海岛
                </Button>
                <Button type="default" onClick={() => handleSetTitle("海岛-国际")}>
                  海岛国际
                </Button>
                <Button type="default" onClick={() => handleSetTitle("海岛-小米")}>
                  海岛小米
                </Button>
                <Button type="default" onClick={() => handleSetTitle("部落")}>
                  部落
                </Button>
              </Space>
            }
          >
            <Input />
          </Form.Item>
          <Space>
            <Form.Item
              name="hour"
              initialValue={0}
              rules={[{ min: 0, max: 99999, type: "number" }]}
            >
              <InputNumber size="large" min={0} max={99999} />
            </Form.Item>
            <div className="mb-6">时</div>
            <Form.Item name="minute" initialValue={0} rules={[{ min: 0, max: 59, type: "number" }]}>
              <InputNumber size="large" min={0} max={59} />
            </Form.Item>
            <div className="mb-6">分</div>
            <div className="mb-6">
              <Button type="primary" danger onClick={handleSetZero}>
                置0
              </Button>
            </div>
          </Space>
        </Form>
      </Modal>
    </>
  );
});

export default function HomePage() {
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

  let update = useUpdate();
  useInterval(update, 60000);

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
        isValid : moment().isBefore(endTime),
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
        return a.isValid  == true;
      }),
      ...ret.filter((a) => {
        return a.isValid  == false;
      }),
    ];
  }, [timerListSnap]);

  let handleDeleteAll = () => {
    list.map((a) => {
      if (a.isValid  == false) {
        handleDelete(a.startTime);
      }
    });
  };
  return (
    <>
      <AddOrEdit ref={addOrEditRef} />
      <div className="p-2 space-y-2">
        <div className="flex items-center justify-between">
          {moment().format("YYYY.MM.DD hh:mm:ss")}
          <Popconfirm
            title="删除所有过期的定时器?"
            okText="确定"
            showCancel={false}
            placement="left"
            onConfirm={handleDeleteAll}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button icon={<AppstoreAddOutlined />} onClick={handleAdd} />
        </div>
        {list.map((v, i) => {
          return (
            <div
              key={v.startTime}
              className={classNames(
                "rounded-md  border-2 border-solid flex-row p-2 space-y-2",
                v.isValid  ? "border-blue-400" : "border-red-500 bg-yellow-300 "
              )}
            >
              <div className="flex justify-between items-center">
                <div className="text-2xl text-red-500">{v.title}</div>
                <div>{v.endTimeMoment.fromNow()}</div>

                <div>
                  <Popconfirm
                    title="确定删除?"
                    okText="确定"
                    showCancel={false}
                    placement="left"
                    onConfirm={() => handleDelete(v.startTime)}
                  >
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-orange-600">{v.endTimeMoment.calendar()}</div>
                <div>{v.endTime}</div>
                <div className="flex space-x-3">
                  <Button icon={<RedoOutlined />} onClick={() => handleReset(v.startTime)} />
                  <Button icon={<EditOutlined />} onClick={() => handleEdit(v.startTime)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
