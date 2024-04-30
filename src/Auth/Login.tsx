import { useEffect, useMemo, useState } from "react";
import account from "atoms/account";
import alert from "atoms/alert";
import { passwordValid, validateEmail } from "utils/login";
import { useSetRecoilState } from "recoil";
import { login, requestPasswordReset, signup } from "requests/auth";
import {
  Container,
  FormElement,
  FormElements,
  H2,
  Link,
  LinkContainer,
  TitleContainer,
} from "./shared";
import { Button } from "react-bootstrap";
import { Form, FormLabel } from "react-bootstrap";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { colors } from "shared/theme";
import Alerta from "shared/Alerta";

const Label = styled(FormLabel)`
  color: ${colors.backish};
  margin: 0;
`;

export default function Login() {
  const [formMode, setFormMode] = useState<"login" | "password" | "signup">(
    "login"
  );
  const setUserAccount = useSetRecoilState(account);
  const setAlert = useSetRecoilState(alert);
  const navigate = useNavigate();
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");

  const resetForm = () => {
    setFormEmail("");
    setFormPassword("");
  };

  useEffect(() => {
    resetForm();
  }, [formMode]);

  const clearMessage = () => {
    setAlert({ display: false, variant: "success", message: "" });
  };

  const handleFormEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailAddress = e.currentTarget.value;
    setFormEmail(emailAddress);
  };

  const handleFormPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.currentTarget.value;
    setFormPassword(password);
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const payload = {
      email: formEmail,
      password: formPassword || "",
    };

    let data;
    try {
      if (formMode === "password") {
        data = await requestPasswordReset(payload);
        if (data?.success) {
          setAlert({
            display: true,
            variant: "success",
            message: `Email de recuperación de contraseña enviado a ${data.email}.`,
          });
        } else {
          setAlert({
            display: true,
            variant: "danger",
            message:
              data?.msg ||
              "No se pudo enviar el email de recuperación de contraseña",
          });
        }
      } else if (formMode === "signup") {
        data = await signup(payload);
        if (data?.success) {
          setAlert({
            display: true,
            variant: "success",
            message: `User created successfully. Please check your email to set up your password.`,
          });
          setFormMode("login");
        } else {
          setAlert({
            display: true,
            variant: "danger",
            message: data?.msg || "Error creating user. Please try again.",
          });
        }
      } else {
        data = await login(payload);
        if (data?.success) {
          localStorage.setItem("taasToken", data.token);
          setAlert({
            display: true,
            variant: "success",
            message: `Sucessful log in`,
          });

          setUserAccount({
            userId: data.id,
            email: data.email,
            role: data.role,
            credits: data.credits,
          });

          navigate("/");
        } else {
          setAlert({
            display: true,
            variant: "danger",
            message: data?.msg || "Log in error",
          });
        }
      }
    } catch (error) {
      setAlert({
        display: true,
        variant: "danger",
        message: "Authentication error",
      });
    }
  };

  const formValid = useMemo(() => {
    if (formMode === "login") {
      return validateEmail(formEmail) && passwordValid(formPassword);
    } else {
      return validateEmail(formEmail);
    }
  }, [formMode, formEmail, formPassword]);

  return (
    <div className="min-h-full">
      <Alerta />
      <Container>
        <div>
          <TitleContainer>
            {/* <img
              className="mx-auto h-10 w-auto"
              src=""
              alt="Rafart Logo"
            /> */}
            <H2>Authentication</H2>
          </TitleContainer>
          <Form
            onSubmit={handleSubmit}
            className="space-y-6"
            action="#"
            method="POST"
          >
            <FormElements>
              <FormElement>
                <Label htmlFor="email-address" className="sr-only">
                  Email
                </Label>
                <Form.Control
                  id="email-address"
                  name="email"
                  type="email"
                  onFocus={clearMessage}
                  value={formEmail}
                  onChange={handleFormEmail}
                  required
                  placeholder="example@email.com"
                />
              </FormElement>
              {formMode === "login" && (
                <FormElement>
                  <Label htmlFor="password" className="sr-only">
                    Password
                  </Label>
                  <Form.Control
                    id="password"
                    name="password"
                    type="password"
                    onFocus={clearMessage}
                    value={formPassword}
                    onChange={handleFormPassword}
                    autoComplete="current-password"
                    required
                    placeholder="Password"
                  />
                </FormElement>
              )}
              {formMode === "signup" && (
                <Label htmlFor="" className="sr-only">
                  Enter your email to create an account
                </Label>
              )}
            </FormElements>

            <Button variant="primary" type="submit" disabled={!formValid}>
              {formMode === "login"
                ? "Log In"
                : formMode === "password"
                ? "Reset Password Request"
                : "Sign up"}
            </Button>
          </Form>

          <LinkContainer>
            {formMode !== "login" && (
              <Link onClick={() => setFormMode("login")}>Sign In</Link>
            )}
            {formMode !== "signup" && (
              <Link onClick={() => setFormMode("signup")}>Sign up</Link>
            )}
            {formMode !== "password" && (
              <Link onClick={() => setFormMode("password")}>
                Reset password / Recover account
              </Link>
            )}
          </LinkContainer>
        </div>
      </Container>
    </div>
  );
}
