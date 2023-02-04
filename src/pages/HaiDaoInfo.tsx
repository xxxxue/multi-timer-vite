import { FC, memo } from "react";
import danji from "../assets/haidao-danji.jpg";
import diaoxiang from "../assets/haidao-diaoxiang.png";
interface IProps {}
let HaiDaoInfo: FC<IProps> = function (props) {
  return (
    <>
      <img src={danji} />
      <img src={diaoxiang} />
    </>
  );
};

export default memo(HaiDaoInfo);
