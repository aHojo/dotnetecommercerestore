import Catalog from "../../features/catalog/Catalog";
import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Header from './Header';
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ProductDetails from "../../features/catalog/ProductDetails";
import Contact from "../../features/Contact/Contact";
import About from "../../features/About/About";
import Home from "../../features/Home/Home";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";

import BasketPage from "../../features/BasketPage/BasketPage";
import { useStoreContext } from "../../context/StoreContext";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import Loading from "./Loading";
import CheckoutPage from "../../features/Checkout/Checkout.Page";


// import { ThemeProvider } from "@emotion/react";

function App() {
  const { setBasket } = useStoreContext();
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  });


  useEffect(() => {
    const buyerId = getCookie('buyerId');
    if (buyerId) {
      agent.Basket.get()
        .then(basket => {
          setBasket(basket)
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
    } else {
      setLoading(false);
    }
  }, [setBasket])


  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if (loading) return <Loading message="Initializing app..."></Loading>
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position={"bottom-right"} hideProgressBar />
      <CssBaseline />

      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/catalog' element={<Catalog />} />
          <Route path='/catalog/:id' element={<ProductDetails />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/server-error' element={<ServerError />} />
          <Route path='/basket' element={<BasketPage />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
