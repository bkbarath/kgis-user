import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { UserForm, UserList } from "./pages";

function App() {
  return (
    <Routes>
      {/* initial page user list */}
      <Route path="/" element={<Navigate to="/user/list" replace />} />

      {/* route paths */}
      <Route path="/user/add" element={<UserForm />} />
      <Route path="/user/edit/:id" element={<UserForm />} />
      <Route path="/user/list" index element={<UserList />} />
    </Routes>
  );
}

export default App;
