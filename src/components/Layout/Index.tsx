import { FieldTimeOutlined, RedditOutlined } from "@ant-design/icons";
import routes from "~react-pages";
import { Layout, Menu } from "antd";
import { Suspense, useRef, useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { useMount } from "ahooks";

const { Header, Content, Footer } = Layout;
const Index = () => {
  let nav = useNavigate();
  let location = useLocation();
  console.log(location.pathname);

  let handleRouteLink = (path: string) => {
    nav(path);
  }; 

  return (
    <Layout className="h-screen">
      <Header className="p-0">
        <Menu
          selectedKeys={[location.pathname]}
          theme="dark"
          mode="horizontal"
          items={[
            {
              key: "/",
              icon: <FieldTimeOutlined />,
              label: "计时器",
              onClick: () => handleRouteLink("/"),
            },
            {
              key: "/HaiDaoInfo",
              icon: <RedditOutlined />,
              label: `海岛信息`,
              onClick: () => handleRouteLink("HaiDaoInfo"),
            },
          ]}
        />
      </Header>
      <Content>
        <Suspense fallback={<p>loading...</p>}>{useRoutes(routes)}</Suspense>
      </Content>
      <Footer className="text-center">版本号: {process.env.m_version}</Footer>
    </Layout>
  );
};

export default Index;