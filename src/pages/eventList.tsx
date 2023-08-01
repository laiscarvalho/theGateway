import React, {  useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import env from "./env";
import { ScrollView } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { Icon } from "@rneui/base";

export default function EventList() {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [play, setPlay] = useState(false);
  const [stop, setStop] = useState(false);

  axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${env.TOKEN}`;
    return config;
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const url = `${env.API_URL}/event`;
          const { data } = await axios.get(url);
          setEvents(data);
        } catch (error) {
          console.error("Erro ao carregar dados de evento:", error);
        }
      };
      fetchData();

      return () => {
        setEvents([]);
      };
    }, [play, stop])
  );

  const translateStatus = (status: string) => {
    switch (status) {
      case "FINISHED":
        return "Finalizado";
      case "SCHEDULED":
        return "Agendado";
      case "IN_PROGRESS":
        return "Em progresso";
      case "FORCED_FINISHED":
        return "Finalizado";
      default:
        return "grey";
    }
  };

  const handleStartEvent = async (eventCode: string, status: string) => {
    try {
      if (status === "SCHEDULED") {
        const url = `${env.API_URL}/event/${eventCode}/start`;
        const response = await axios.patch(url);
        if (response.status === 200) {
          ToastAndroid.show("Evento iniciado com sucesso!", ToastAndroid.LONG);
          setPlay(true);
          setStop(false);
          return;
        }
      }
      ToastAndroid.show("Evento ja iniciado!", ToastAndroid.LONG);
    } catch (error) {
      ToastAndroid.show("Erro ao iniciar evento", ToastAndroid.LONG);
    }
  };

  const handleCsv = async (eventCode: string) => {
    try {
      const url = `${env.API_URL}/event/generate-statistics/${eventCode}`;
      await axios.get(url);
      ToastAndroid.show("Relatorio enviado por email!", ToastAndroid.LONG);
    } catch (error) {
      ToastAndroid.show("Erro ao gerar arquivo", ToastAndroid.LONG);
    }
  };

  const handleStopEvent = async (eventCode: string, status: string) => {
    try {
      if (status === "FORCED_FINISHED" || status === "FINISHED") {
        ToastAndroid.show(
          "Favor, verifique o status do evento!",
          ToastAndroid.LONG
        );
        return;
      }
      const url = `${env.API_URL}/event/${eventCode}/finish`;
      await axios.patch(url);
      setStop(true);
      setPlay(false);

      ToastAndroid.show("Evento finalizado com sucesso!", ToastAndroid.LONG);
    } catch (error) {
      ToastAndroid.show("Erro ao finalizar evento", ToastAndroid.LONG);
    }
  };

  const salvarImagem = async (eventCode: string) => {
    try {
      const url = `${env.API_URL}/event/generate-qrcode/${eventCode}`;
      const response = await axios.get(url);
      ToastAndroid.show("QRCode enviado com sucesso!", ToastAndroid.LONG);

      
    } catch (error) {
      console.log("Erro ao enviar qrcode:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eventos</Text>
        <TouchableOpacity
          style={styles.newButton}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate("NewEvent");
          }}
        >
          <Text>
            <Feather name="plus" style={styles.buttonIcon} />
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ marginTop: 20 }}>
        {events.map(function (event, index) {
          return (
            <View style={styles.centeredView} key={index}>
              <View style={styles.cardView}>
                <Text style={styles.banner}>
                  {translateStatus(event.status)}
                </Text>
                <View style={styles.descriptionText}>
                  <Text style={styles.title}>{event.event_name}</Text>
                  <Text style={styles.description}>
                    {event.event_description}
                  </Text>
                  <View style={styles.buttonAction}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.button}
                      onPress={() =>
                        handleStartEvent(event.event_code, event.status)
                      }
                    >
                      <Text>
                        <Feather name="play" style={styles.buttonIcon} />
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      activeOpacity={0.8}
                      onPress={() =>
                        handleStopEvent(event.event_code, event.status)
                      }
                    >
                      <Text>
                        <Feather name="stop-circle" style={styles.buttonIcon} />
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      activeOpacity={0.8}
                      onPress={() => {
                        navigation.navigate("Certificate", event.event_code);
                      }}
                    >
                      <Text>
                        <Feather name="folder" style={styles.buttonIcon} />
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      activeOpacity={0.8}
                      onPress={() => {
                        navigation.navigate("NewEvent", event.event_code);
                      }}
                    >
                      <Text>
                        <Feather name="edit" style={styles.buttonIcon} />
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      activeOpacity={0.8}
                      onPress={() => handleCsv(event.event_code)}
                    >
                      <Text>
                        <Feather name="pie-chart" style={styles.buttonIcon} />
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      activeOpacity={0.8}
                      onPress={() => salvarImagem(event.event_code)}
                    >
                      <Text>
                      <Icon name="qrcode-scan" type="material-community" color="white" />
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    alignItems: "center",
    marginTop: 70,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    marginTop: 1,
  },
  cardView: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "94%",
    minHeight: 200,
  },

  descriptionText: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.heading,
    fontFamily: fonts.heading,
  },

  description: {
    color: colors.heading,
    fontWeight: "bold",
    fontFamily: fonts.heading,
    fontSize: 16,
    margin: 5,
  },

  footer: {
    marginTop: 40,
    width: "100%",
    paddingHorizontal: 90,
    marginLeft: 0,
  },

  button: {
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginTop: 45,
    height: 46,
    width: 46,
    textAlign: "center",
  },
  newButton: {
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    height: 46,
    width: 46,
    textAlign: "center",
  },

  buttonAction: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  buttonIcon: {
    fontSize: 18,
    color: colors.white,
  },
  banner: {
    position: "absolute",
    right: 2,
    top: 2,
    width: 100,
    backgroundColor: colors.green,
    color: "white",
    padding: 2,
    borderRadius: 15,
    textAlign: "center",
  },
});
