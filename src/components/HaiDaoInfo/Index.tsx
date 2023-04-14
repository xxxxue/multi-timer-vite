import { FC, memo } from "react";
import danji from "@/assets/haidao-danji.jpg";
import diaoxiang from "@/assets/haidao-diaoxiang.png";
import { Image } from "antd";
let Index: FC = function (props) {
  return (
    <>
      <Image src={danji} />
      <Image src={diaoxiang} />
    </>
  );
};

export default memo(Index);
