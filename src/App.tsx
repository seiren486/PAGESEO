import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UploadScreen from "./pages/UploadScreen";
import ResultScreen from "./pages/ResultScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<UploadScreen />} />
          <Route path="result" element={<ResultScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
