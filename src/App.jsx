import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Navbar from "./components/Navbar";
import Watchlist from "./pages/Watchlist"

const App = () => {
  return(
    <>
      <Routes>
      <Route path="/" element={
        <>
          <Navbar />
          <Home />
        </>}/>
      <Route path="/movie/:id" element={<MovieDetail/>}/>
      <Route path="/watchlist" element={<Watchlist />}/>
      </Routes>
    </>
  )
}

export default App
