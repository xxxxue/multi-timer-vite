import { FC, memo } from "react";
import Index from "@/components/HaiDaoInfo/Index";

interface IProps {}
let HaiDaoInfo: FC<IProps> = function (props) {
  return (
    <>
      <Index />
    </>
  );
};

export default memo(HaiDaoInfo);
