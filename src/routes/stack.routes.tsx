import * as React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import App from "../pages/welcome";
import colors from "../styles/colors";
import { UserIdentification } from "../pages/userIdentification";
import { Confirmation } from "../pages/confirmation";
import Menu from "../pages/menu";
import { Cadastro } from "../pages/cadastro";
import { AddNewEvent } from "../pages/newEvent";
import QRCodeReaderScreen from "../pages/QRCodeReaderScreen";
import { UserConfig } from "../pages/userConfig";
import Certificate from "../pages/certificate";
import EditEvent from "../pages/editEvent";
import EventList from "../pages/eventList";

const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
  <stackRoutes.Navigator
    headerMode="none"
    screenOptions={{
      cardStyle: {
        backgroundColor: colors.white,
      },
    }}
  >
    <stackRoutes.Screen name="Welcome" component={App} />
    <stackRoutes.Screen
      name="UserIdentification"
      component={UserIdentification}
    />
    <stackRoutes.Screen name="Confirmation" component={Confirmation} />
    <stackRoutes.Screen name="Menu" component={Menu} />
    <stackRoutes.Screen name="Cadastro" component={Cadastro} />
    <stackRoutes.Screen name="NewEvent" component={AddNewEvent} />
    <stackRoutes.Screen
      name="QRCodeReaderScreen"
      component={QRCodeReaderScreen}
    />
    <stackRoutes.Screen name="UserConfig" component={UserConfig} />

    <stackRoutes.Screen name="Certificate" component={Certificate} />
    <stackRoutes.Screen name="EditEvent" component={EditEvent} />
    <stackRoutes.Screen name="EventList" component={EventList} />
  </stackRoutes.Navigator>
);
export default AppRoutes;
