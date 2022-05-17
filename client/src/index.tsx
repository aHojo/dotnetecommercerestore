import React, { useLayoutEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './app/layout/index.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Router } from "react-router-dom";
import { createBrowserHistory, BrowserHistory } from "history";
import { StoreProvider } from './context/StoreContext';

export const history = createBrowserHistory();


export interface BrowserRouterProps {
  basename?: string;
  children?: React.ReactNode;
  window?: Window;
}

interface Props extends BrowserRouterProps {
  history: BrowserHistory;
}

export const CustomRouter = ({ basename, history, children }: Props) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });
  useLayoutEffect(() => history.listen(setState), [history]);
  return (
    <Router
      navigator={history}
      location={state.location}
      navigationType={state.action}
      children={children}
      basename={basename}
    />
  );
};
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <CustomRouter history={history}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </CustomRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
