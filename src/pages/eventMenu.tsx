import React from "react";
import { SpeedDial } from "@rneui/base";
import colors from "../styles/colors";
import { useNavigation } from "@react-navigation/native";

export default function EventMenu({ admin, userCode }: any) {
  const [open, setOpen] = React.useState(false);
  const navigation = useNavigation();

  return (
    <SpeedDial
      isOpen={open}
      icon={{ name: "edit", color: "#fff" }}
      openIcon={{ name: "close", color: "#fff" }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
      color={colors.green}
    >
      {admin ? (
        <>
          <SpeedDial.Action
            icon={{ name: "list", color: "#fff" }}
            title="Eventos"
            onPress={() => {
              navigation.navigate("EventList");
            }}
            color={colors.green}
          />
        </>
      ) : (
        <></>
      )}
      <SpeedDial.Action
        icon={{ name: "info", color: "#fff" }}
        title="Perfil"
        onPress={() => navigation.navigate("UserConfig", userCode)}
        color={colors.green}
      />
    </SpeedDial>
  );
}
