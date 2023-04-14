import routes from "~react-pages";
import { Suspense } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import { TabBar } from "antd-mobile";
import { SearchOutline } from "antd-mobile-icons";
const Index = () => {
  let nav = useNavigate();

  let handleRouteLink = (path: string) => {
    nav(path);
  };

  return (
    <div >
      <div className="pb-[49px]">
        <Suspense fallback={<p>loading...</p>}>{useRoutes(routes)}</Suspense>
      </div>
      <TabBar
        className="fixed bottom-0 left-0 right-0 bg-white"
        onChange={(key) => {
          console.log(key);

          switch (key) {
            case "Version":
              alert(process.env.m_version);
              break;

            default:
              handleRouteLink(key);
              break;
          }
        }}
      >
        <TabBar.Item key="/" icon={<SearchOutline />} title="计时器" />
        <TabBar.Item key="HaiDaoInfo" icon={<SearchOutline />} title="海岛信息" />
        <TabBar.Item key="Version" icon={<SearchOutline />} title="版本号" />
      </TabBar>
    </div>
  );
};

export default Index;
