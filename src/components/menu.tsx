import { Nav, Navbar, Container } from "react-bootstrap";
// import logoImage from "assets/logo.png";
import account, { defaultAccount } from "atoms/account";
import { useRecoilState, useSetRecoilState } from "recoil";
// import { Roles } from "utils/enums";
import { logout } from "requests/auth";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import alert from "atoms/alert";

const readerMenu = [{ title: "More readings", linkString: "/more-readings" }];

const Menu = () => {
  const [userAccount, setUserAccount] = useRecoilState(account);
  const navigate = useNavigate();
  const setAlert = useSetRecoilState(alert);
  const userExists = useMemo(() => userAccount, [userAccount]);
  const menu = userExists ? readerMenu : [];

  const onLogout = async () => {
    await logout();
    setUserAccount(defaultAccount);
    setAlert({ display: true, variant: "success", message: "Logged out" });
    navigate("/");
  };

  return (
    <>
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            {/* <img
            src=""
            width="80"
            height="22"
            className="d-inline-block align-center"
            alt="TaaS logo"
          /> */}
            TaaS
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            {menu.map((item) => (
              <Nav.Link
                key={`menu-${item.title}`}
                style={{ color: "white", padding: "0 10px" }}
                href={item.linkString}
              >
                {item.title}
              </Nav.Link>
            ))}
            {userExists ? (
              <Nav.Item
                style={{ color: "white", padding: "0 10px", cursor: "pointer" }}
                onClick={onLogout}
              >
                Log out
              </Nav.Item>
            ) : (
              <Nav.Item
                style={{ color: "white", padding: "0 10px", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Log in
              </Nav.Item>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Menu;
