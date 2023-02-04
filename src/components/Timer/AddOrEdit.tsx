import { Button, Form, Input, InputNumber, Modal, Space } from "antd";
import moment from "moment";
import { forwardRef, useImperativeHandle, useState } from "react";
import { ITimerData } from "@/model";
import { timerListState } from "@/store";

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
            <Button size="large" type="primary" onClick={handleSubmit}>
              确定
            </Button>
          </>
        }
      >
        <Form form={formRef} name="modalForm" autoComplete="off">
          <Form.Item name="startTime" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="title" required label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="default" size="large" onClick={() => handleSetTitle("🚀海岛-官服")}>
                🚀官服海岛
              </Button>
              <Button type="default" size="large" onClick={() => handleSetTitle("🚀海岛-国际")}>
                🚀国际海岛
              </Button>
              <Button type="default" size="large" onClick={() => handleSetTitle("🚀海岛-单机")}>
                🚀单机海岛
              </Button>
            </Space>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="default" size="large" onClick={() => handleSetTitle("🏠部落")}>
                🏠部落
              </Button>
            </Space>
          </Form.Item>

          <Space>
            <Form.Item
              name="hour"
              initialValue={0}
              rules={[{ min: 0, max: 99999, type: "number" }]}
            >
              <InputNumber type="tel" size="large" min={0} max={99999} />
            </Form.Item>
            <div className="mb-6">小时</div>
            <Form.Item name="minute" initialValue={0} rules={[{ min: 0, max: 59, type: "number" }]}>
              <InputNumber type="tel" size="large" min={0} max={59} />
            </Form.Item>
            <div className="mb-6">分</div>
            <div className="mb-6">
              <Button type="primary" danger onClick={handleSetZero}>
                归0
              </Button>
            </div>
          </Space>
        </Form>
      </Modal>
    </>
  );
});
