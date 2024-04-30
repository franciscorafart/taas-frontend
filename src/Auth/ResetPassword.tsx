import { useState, useEffect, useCallback, useMemo } from "react";
import { useRecoilState } from "recoil";
import alert from "atoms/alert";
import { resetPassword, validateJWT } from "requests/auth";
import { isRepeatValid, signUpPasswordValid } from "utils/login";
import { Container, FormElements, FormElement, H2 } from "./shared";
import { Form, Button, FormLabel } from "react-bootstrap";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import styled from "styled-components";
import Alerta from "shared/Alerta";
import { useNavigate } from "react-router-dom";
import { colors } from "shared/theme";

const GreenCheck = styled(CheckCircleIcon)`
  color: green;
  width: 30px;
  padding-left: 5px;
`;

const GrayCheck = styled(CheckCircleIcon)`
  color: gray;
  width: 30px;
  padding-left: 5px;
`;
const Label = styled(FormLabel)`
  color: ${colors.blackish};
  margin: 0;
`;

const Input = styled(Form.Control)`
  max-width: 400px;
`;

function ResetPassword() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const navigate = useNavigate();

  const [formPassword, setFormPassword] = useState("");
  const [formRepeatPassword, setFormRepeatPassword] = useState("");

  const [alerta, setAlert] = useRecoilState(alert);

  useEffect(() => {
    const validateToken = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const recoveryToken = urlParams.get("recovery") || "";
      const data = await validateJWT(recoveryToken);

      if (data?.success && data.email) {
        setToken(recoveryToken);
        setEmail(data.email);
      } else {
        setTokenExpired(true);
      }
    };

    validateToken();
  }, []);

  const handleFormPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value;
    setFormPassword(password);
  };

  const handleFormRepeatPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value;
    setFormRepeatPassword(password);
  };

  const clearMessage = () => {
    setAlert({ display: false, variant: "success", message: "" });
  };

  const handleSubmit = useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();

      const res = await resetPassword({
        recoveryToken: token,
        password: formPassword,
      });

      if (res?.success) {
        setAlert({
          display: true,
          variant: "success",
          message: `New password for ${res.email} set. Please log in.`,
        });
        setSuccess(true);
      } else {
        setAlert({
          display: true,
          variant: "danger",
          message: res?.msg || "Error setting new password",
        });
      }
    },
    [formPassword, setAlert, token]
  );
  const passwordOk = signUpPasswordValid(formPassword);
  const repeatOk = isRepeatValid(formPassword, formRepeatPassword);

  const formValid = useMemo(
    () => passwordOk && repeatOk,
    [passwordOk, repeatOk]
  );

  if (tokenExpired) {
    return <H2>Link expired</H2>;
  }
  return (
    <div className="min-h-full">
      <Alerta />
      <Container>
        <div>
          <H2>
            {success
              ? "Password set. Please Log in."
              : `Set up your new password for ${email}`}
          </H2>

          {success ? (
            <div>
              <Button onClick={() => navigate("/login")} variant="secondary">
                Back
              </Button>
            </div>
          ) : (
            <Form onSubmit={handleSubmit} action="#" method="POST">
              <div>
                <FormElements>
                  <FormElement>
                    {/* <Label htmlFor="password" className="sr-only">
                      Password
                    </Label> */}
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      onFocus={clearMessage}
                      value={formPassword}
                      onChange={handleFormPassword}
                      autoComplete="current-password"
                      required
                      placeholder="New Password"
                    />
                    {passwordOk ? <GreenCheck /> : <GrayCheck />}
                  </FormElement>

                  <FormElement>
                    {/* <Label htmlFor="repeat-password" className="sr-only">
                      Repeat Password
                    </Label> */}
                    <Input
                      id="repeat-password"
                      name="repeat-password"
                      type="password"
                      onFocus={clearMessage}
                      value={formRepeatPassword}
                      onChange={handleFormRepeatPassword}
                      required
                      placeholder="Repeat New Password"
                    />
                    {repeatOk ? <GreenCheck /> : <GrayCheck />}
                  </FormElement>
                  <Label>
                    Your password should have at least 8 characters that include
                    at least one letter and one number.
                  </Label>
                </FormElements>
                <Button
                  type="submit"
                  disabled={!Boolean(token) || !formValid}
                  variant="primary"
                >
                  Confirm
                </Button>
              </div>
            </Form>
          )}
        </div>
      </Container>
    </div>
  );
}

export default ResetPassword;
