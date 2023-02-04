import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from './components/Header';
import Landing from './pages/Landing';
import MovieDetail from "./pages/MovieDetail";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  const layoutStyle = {
    minHeight: "100vh",
    paddingBottom: 30
  }
  return (
    <Router>
      <Header />
      <Container className="bg-dark" style={layoutStyle} fluid>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/detail/:id' element={<MovieDetail />} />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
