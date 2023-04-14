import { FC, memo } from "react";
import danji from "@/assets/haidao-danji.jpg";
import diaoxiang from "@/assets/haidao-diaoxiang.png";
import { Image,ImageViewer } from 'antd-mobile';
let Index: FC = function () {
  let MyImageViewer = (path: string) => {
    return (
      <Image
        src={path}
        onClick={() => {
          ImageViewer.show({
            image: path,
          });
        }}
      />
    );
  };
  return (
    <>
      {MyImageViewer(danji)}
      {MyImageViewer(diaoxiang)}
    </>
  );
};

export default memo(Index);
