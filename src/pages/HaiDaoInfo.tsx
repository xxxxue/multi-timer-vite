import { FC, memo } from 'react';
import danji from '/public/海岛单机.jpg';
import diaoxiang from '/public/海岛雕像.png';
interface IProps {}
let HaiDaoInfo: FC<IProps> = function (props) {
    return (
        <>
            <img src={danji}/>
            <img src={diaoxiang}/>
        </>
    );
};

export default memo(HaiDaoInfo);