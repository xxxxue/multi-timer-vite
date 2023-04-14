import { forwardRef, useImperativeHandle, useState } from "react";
import { ITimerData } from "@/model";
import { timerListState } from "@/store";
import dayjs from "dayjs";
import { Button, Form, Input, Popup } from "antd-mobile";
export interface IAddOrEditRef {
  open: (v?: string) => void;
}

export let AddOrEdit = forwardRef<IAddOrEditRef>((props, forwardedRef) => {
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
      let item = timerListState.find((a) => a.startTime === v)!;

      formRef.setFieldsValue(item);
    }
  };

  let handleSubmit = () => {
    formRef.validateFields().then((v) => {
      if (v.startTime != undefined) {
        let index = timerListState.findIndex((a) => a.startTime === v.startTime);

        timerListState[index] = { ...v };
      } else {
        timerListState.push({ ...v, startTime: dayjs().toISOString() });
      }
      setModalOpen(false);
    });
  };

  let [formRef] = Form.useForm<ITimerData>();

  // 归0
  let handleSetZero = () => {
    formRef.setFieldsValue({
      day: 0,
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
      <Popup
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        position="top"
        closeOnMaskClick={true}
        bodyStyle={{
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          minHeight: "40vh",
        }}
      >
        <Form form={formRef} name="modalForm" layout="horizontal">
          <Form.Item name="startTime" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="title"
            required
            label="标题"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button color="default" onClick={() => handleSetTitle("🚀海岛-官服")}>
              🚀官服海岛
            </Button>
            <Button color="default" onClick={() => handleSetTitle("🚀海岛-国际")}>
              🚀国际海岛
            </Button>
            <Button color="default" onClick={() => handleSetTitle("🚀海岛-单机")}>
              🚀单机海岛
            </Button>
            <Button color="default" onClick={() => handleSetTitle("🏠部落")}>
              🏠部落
            </Button>
          </Form.Item>
          <Form.Item name="day" initialValue={0} label="天">
            <Input type="tel" autoComplete="off"/>
          </Form.Item>
          <Form.Item name="hour" initialValue={0} label="小时">
            <Input type="tel" autoComplete="off"/>
          </Form.Item>
          <Form.Item name="minute" initialValue={0} label="分钟">
            <Input type="tel" autoComplete="off"/>
          </Form.Item>
          <div className="mb-6">
            <Button color="danger" block size="large" onClick={handleSetZero}>
              归0
            </Button>
          </div>
        </Form>
        <Button size="large" block color="success" onClick={handleSubmit}>
          确定
        </Button>
      </Popup>
    </>
  );
});
