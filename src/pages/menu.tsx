import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";

import { Icon, ListItem } from "@rneui/base";
import EventMenu from "./eventMenu";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Menu() {
  const navigation = useNavigation();

  const route = useRoute();
  const permission = route.params?.userPermission;
  const userCode = route.params?.userCode;


  function handleSubmit() {
    navigation.navigate("QRCodeReaderScreen", {operationType: 'checkin'});
  }

  function handleSubmitCheckout() {
    navigation.navigate("QRCodeReaderScreen",{operationType: 'checkout'});
  }
  return (
    <>
      <SafeAreaView style={styles.container}>
        <ListItem onPress={handleSubmit}>
          <Icon name="qrcode-scan" type="material-community" color="grey" />
          <ListItem.Content>
            <ListItem.Title>Check-in</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem onPress={handleSubmitCheckout}>
          <Icon name="qrcode-scan" type="material-community" color="grey" />
          <ListItem.Content>
            <ListItem.Title>Check-out</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </SafeAreaView>
      <EventMenu admin={permission} userCode={userCode} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 50,
  },
  content: {
    flex: 1,
    width: "100%",
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  emoji: {
    fontSize: 32,
  },
});
