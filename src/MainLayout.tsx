import { ReactNode, useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import accountInState from "atoms/account";
import freebies from "atoms/freebies";
import { getAuthUser } from "requests/auth";
import { Roles } from "utils/enums";
import { useNavigate } from "react-router-dom";
import Alerta from "shared/Alerta";
import userRoute from "atoms/userRoute";

function MainLayout({ children }: { children: ReactNode }) {
  const setUserAccount = useSetRecoilState(accountInState);
  const setUserRoute = useSetRecoilState(userRoute);
  const navigate = useNavigate();

  const setFreebies = useSetRecoilState(freebies);

  const findFreebies = useCallback(async () => {
    let f = localStorage.getItem("taas");
    if (f === undefined || f === null) {
      // TODO: Check if ip already used freebies
      localStorage.setItem("taas", "3");
      setFreebies(3);
    } else if (Number.isInteger(Number(f)) && Number(f) > 0) {
      // If not, remove from local storage
      // const count = String(Number(f) - 1);
      // localStorage.setItem("taas", count);
      setFreebies(Number(f));
    }
  }, [setFreebies]);

  const getUser = useCallback(async () => {
    const user = await getAuthUser();
    if (user) {
      setUserAccount({
        userId: user.id,
        email: user.email,
        role: user.role,
        credits: user.credits,
      });

      if (user.role >= Roles.Admin) {
        setUserRoute({ request: "admin/", navigation: "admin" });
        setTimeout(() => navigate("/admin"), 1000);
      } else {
        setUserRoute({ request: "", navigation: "" });
        setTimeout(() => navigate("/"), 1000);
      }
    }
  }, [navigate, setUserAccount, setUserRoute]);

  useEffect(() => {
    findFreebies();
  }, [findFreebies]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <div className="min-h-full">
      <Alerta />
      {children}
    </div>
  );
}

export default MainLayout;
