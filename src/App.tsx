import { FieldTimeOutlined, RedditOutlined } from "@ant-design/icons";
import routes from "~react-pages";
import { Layout, Menu, theme } from "antd";
import { Suspense } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";

const { Header, Content } = Layout;
const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
      <Content className="p-4">
        <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
          <Suspense fallback={<p>loading...</p>}>{useRoutes(routes)}</Suspense>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
