import { FC, memo } from 'react';
import Timer from '@/components/Timer/Index';

interface IProps {}
let Index: FC<IProps> = function (props) {
    return (
        <>
           <Timer/>
        </>
    );
};

export default memo(Index);