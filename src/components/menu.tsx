import { Nav, Navbar, Container } from "react-bootstrap";
// import logoImage from "assets/logo.png";
import account, { defaultAccount } from "atoms/account";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
// import { Roles } from "utils/enums";
import { logout } from "requests/auth";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import alert from "atoms/alert";
import { colors } from "shared/theme";
import freebies from "atoms/freebies";

// const readerMenu: {title: string, linkString: string}[] = [{ title: "Other Spreads", linkString: "/spreads" }];
const readerMenu: { title: string; linkString: string }[] = [];

const Menu = () => {
  const [userAccount, setUserAccount] = useRecoilState(account);
  const navigate = useNavigate();
  const setAlert = useSetRecoilState(alert);
  const userExists = useMemo(() => userAccount.userId, [userAccount]);
  const menu = userExists ? readerMenu : [];
  const freebs = useRecoilValue(freebies);

  const onLogout = async () => {
    await logout();
    setUserAccount(defaultAccount);
    setAlert({ display: true, variant: "success", message: "Logged out" });
    navigate("/");
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
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
          {/* <Navbar.Collapse className="justify-content-center">
          </Navbar.Collapse> */}
          <Navbar.Collapse className="justify-content-end">
            {userExists ? (
              <Nav.Item style={{ color: colors.redish, padding: "0 10px" }}>
                Remaining readings: {userAccount.credits}
              </Nav.Item>
            ) : (
              <Nav.Item style={{ color: colors.redish, padding: "0 10px" }}>
                Remaining readings: {freebs}
              </Nav.Item>
            )}
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
