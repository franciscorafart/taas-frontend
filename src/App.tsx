import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Menu from "components/menu";
import ResetPassword from "Auth/ResetPassword";
import ThreeSpread from "Readings/ThreeSpread";
import MainLayout from "MainLayout";
import Login from "Auth/Login";
import "./App.css";

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <BrowserRouter>
          <Menu />
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout>
                  <ThreeSpread />
                </MainLayout>
              }
            />
            <Route
              path="/login"
              element={
                <MainLayout>
                  <Login />
                </MainLayout>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
