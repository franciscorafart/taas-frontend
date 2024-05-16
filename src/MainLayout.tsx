import { ReactNode, useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import accountInState from "atoms/account";
import { getAuthUser } from "requests/auth";
import { Roles } from "utils/enums";
import { useNavigate } from "react-router-dom";
import Alerta from "shared/Alerta";
import userRoute from "atoms/userRoute";
import useFreeCount from "utils/hooks/useFreeCount";

function MainLayout({ children }: { children: ReactNode }) {
  const setUserAccount = useSetRecoilState(accountInState);
  const setUserRoute = useSetRecoilState(userRoute);
  const navigate = useNavigate();
  useFreeCount();

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
