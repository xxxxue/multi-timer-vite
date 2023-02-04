import { FC, memo } from "react";
import danji from "@/assets/haidao-danji.jpg";
import diaoxiang from "@/assets/haidao-diaoxiang.png";
let Index: FC = function (props) {
  return (
    <>
      <img src={danji} />
      <img src={diaoxiang} />
    </>
  );
};

export default memo(Index);
