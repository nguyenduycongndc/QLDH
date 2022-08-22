import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import {
  LoginScreen,
  AccountListScreen,
  ConfigScreen,
  OrderListScreen,
  OrderDetailScreen,
  CreateOrderScreen,
  SupplierListScreen,
  ImportScreen,
  ManageFileScreen,
  CreateImportScreen,
} from "../screens/index";

import Menu from "../components/Menu";
import Header from "components/Header";
import { ROUTER } from "../constants/Constant";
import PrivateRoute from "./PrivateRoute";
import Cookie from "js-cookie";

class AppNavigator extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path={"/dang-nhap"} exact component={LoginScreen} />
          <PrivateRoute path="/" Component={MainNavigator} />
        </Switch>
      </Router>
    );
  }
}

class MainNavigator extends Component {
  render() {
    const userRole = Cookie.get("userRole");

    return (
      <>
        <Header />
        <Menu />
        <Switch>
          {/* <Route path="/dang-nhap" exact component={LoginScreen} /> */}
          <PrivateRoute path="/don-hang" exact Component={OrderListScreen} />
          <PrivateRoute
            path="/tao-don-hang"
            exact
            Component={CreateOrderScreen}
          />
          <PrivateRoute
            path={"/chi-tiet-don-hang" + "/:id"}
            exact
            Component={OrderDetailScreen}
          />
          <PrivateRoute
            path={"/sua-don-hang" + "/:id"}
            exact
            Component={CreateOrderScreen}
          />
          <PrivateRoute
            path="/nha-cung-cap"
            exact
            Component={SupplierListScreen}
          />
          <PrivateRoute path="/cau-hinh" exact Component={ConfigScreen} />
          <PrivateRoute path="/phieu-nhap" exact Component={ImportScreen} />
          <PrivateRoute
            path="/tao-phieu-nhap"
            exact
            Component={CreateImportScreen}
          />
          <PrivateRoute
            path={"/sua-phieu-nhap" + "/:id"}
            exact
            Component={CreateImportScreen}
          />
          <PrivateRoute path="/tai-lieu" exact Component={ManageFileScreen} />
          {parseInt(userRole) === 1 ? (
            <PrivateRoute
              path="/tai-khoan"
              exact
              Component={AccountListScreen}
            />
          ) : (
            <></>
          )}
          <Route render={() => <Redirect to={"/don-hang"} />} />
        </Switch>
      </>
    );
  }
}

export default AppNavigator;
