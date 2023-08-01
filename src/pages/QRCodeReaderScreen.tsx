import React, { useState } from "react";
import { Text, View, StyleSheet, ToastAndroid } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";
import env from "./env";
import axios from "axios";

export default function QRCodeReaderScreen() {
  const [scannedData, setScannedData] = useState("");
  const navigation = useNavigation();

  axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${env.TOKEN}`;
    return config;
  });

  const route = useRoute();

  const getGeoLocalization = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permissão de localização negada");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      return location;
    } catch (error) {
      console.error("Erro ao obter a geolocalização:", error);
    }
  };

  const checkWifiConnection = async () => {
    const connectionInfo = await NetInfo.fetch();
    if (connectionInfo.type === "wifi" && connectionInfo.details) {
      return connectionInfo.details.ssid;
    } else {

      return "Rede 3G";
    }
  };

  async function submitCheckOut(eventCode: string) {
    const { coords }: any = await getGeoLocalization();
    const wifi = await checkWifiConnection();
    const data = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      metadata: {
        wifi,
      },
    };
    const url = `${env.API_URL}/event/check-out/${eventCode}`;

    try {
      await axios.patch(url, data);
    } catch (error) {
      if (error?.response && error?.response.status === 403) {
        ToastAndroid.show(
          "Acesso negado. Verifique suas credenciais.",
          ToastAndroid.SHORT
        );
      } else {
     
        ToastAndroid.show(
          "Ocorreu um erro. Por favor, tente novamente.",
          ToastAndroid.SHORT
        );
      }
    }
  }

  async function submitCheckin(eventCode: string) {
    const { coords }: any = await getGeoLocalization();
    const wifi = await checkWifiConnection();

    const url = `${env.API_URL}/event/check-in/${eventCode}`;

    try {
      const data = {
        latitude: coords.latitude.toString(),
        longitude: coords.longitude.toString(),
        metadata: {
          wifi,
        },
      };

      await axios.post(url, data);
      ToastAndroid.show(
        "Check-in realizado com sucesso.",
        ToastAndroid.SHORT
      );
    } catch (error) {
      if (error?.response && error?.response.status === 403) {
        ToastAndroid.show(
          "Acesso negado. Verifique suas credenciais.",
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show(
          error.response.data.reason,
          ToastAndroid.LONG
        );
      }
    }
  }

  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScannedData(data);
    if (route.params.operationType === "checkin") {
      if (!scannedData) {
       await submitCheckin(data);
      }
    } else {
      submitCheckOut(data);
    }
    navigation.navigate("Menu");
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={handleBarCodeScanned}
      />
      {scannedData && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>{scannedData}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dataContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  dataText: {
    fontSize: 16,
  },
});
