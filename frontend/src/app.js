import React from "react";
import { Provider } from "react-redux";
import createBrowserHistory from "history/createBrowserHistory";
import { Route, Switch, Redirect } from "react-router";
import { ConnectedRouter, routerMiddleware } from "react-router-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

import Login from "./containers/login";
import Register from "./containers/register";
import Events from "./containers/events";
import Statistics from "./containers/statistics";
import Accounts from "./containers/account";
import Loading from "./components/loading";

import reducer from "./reducers";
import rootSaga from "./sagas";

const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["session"]
};

const persistedReducer = persistReducer(persistConfig, reducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(history)))
);

// store 同步到  localstorage 中
const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

/***************************** protected route *****************************/

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (!localStorage.getItem("token")) {
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        );
      }

      return <Component {...props} />;
    }}
  />
);

/***************************** start *****************************/

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <ConnectedRouter history={history}>
        <Switch>
          {/* <ProtectedRoute path="/NGS" component={Order} /> */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <ProtectedRoute path="/events" component={Events} />
          <ProtectedRoute path="/statistics" component={Statistics} />
          <ProtectedRoute path="/accounts" component={Accounts} />
          <Redirect to="/events" />
        </Switch>
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);

export default App;
