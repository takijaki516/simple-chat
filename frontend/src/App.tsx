import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthLayout } from "./pages/auth-layout";
import { Login } from "./pages/login";
import { SignUp } from "./pages/signup";
import { Chat } from "./pages/chat";
import { Home } from "./pages/home";
import { ThemeProvider } from "./components/theme-provider";
// import { Navbar } from "./components/navbar";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>NAVBAR</div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>

          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
