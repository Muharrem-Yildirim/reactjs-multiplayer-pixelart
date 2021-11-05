import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";
import { SnackbarProvider } from "material-ui-snackbar-provider";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";

ReactDOM.render(
  <ThemeProvider>
    <Provider store={store}>
      <SnackbarProvider
        SnackbarProps={{
          autoHideDuration: 2500,
          anchorOrigin: { vertical: "top", horizontal: "center" },

          ClickAwayListenerProps: {
            mouseEvent: false,
          },

          ContentProps: {
            style: {
              minWidth: 0,
            },
          },
        }}
      >
        <React.StrictMode>
          <BrowserRouter>
            <Switch>
              <Route path="/">
                <App />
              </Route>
            </Switch>
          </BrowserRouter>
        </React.StrictMode>
      </SnackbarProvider>
    </Provider>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
