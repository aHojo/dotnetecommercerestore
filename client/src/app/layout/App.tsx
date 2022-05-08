import Catalog from "../../features/catalog/Catalog";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from './Header';
import React, {useState} from "react";
import {Route, Routes} from "react-router-dom";
import ProductDetails from "../../features/catalog/ProductDetails";
import Contact from "../../features/Contact/Contact";
import About from "../../features/About/About";
import Home from "../../features/Home/Home";
import {ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import ServerError from "../errors/ServerError";


// import { ThemeProvider } from "@emotion/react";

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const paletteType = darkMode ? 'dark' : 'light';
    const theme = createTheme({
        palette: {
            mode: paletteType,
            background: {
                default: paletteType === 'light' ? '#eaeaea' : '#121212'
            }
        }
    })

    function handleThemeChange() {
        setDarkMode(!darkMode);
    }

    return (
        <ThemeProvider theme={theme}>
            <ToastContainer position={"bottom-right"} hideProgressBar />
            <CssBaseline/>

            <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
            <Container>
                <Routes>
                    <Route path='/' element={<Home />}/>
                    <Route path='/catalog' element={<Catalog />}/>
                    <Route path='/catalog/:id' element={<ProductDetails />}/>
                    <Route path='/about' element={<About />}/>
                    <Route path='/contact' element={<Contact />}/>
                    <Route path='/server-error' element={<ServerError />}/>
                </Routes>
            </Container>
        </ThemeProvider>
    );
}

export default App;
