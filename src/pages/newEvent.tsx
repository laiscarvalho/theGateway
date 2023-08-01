import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { Button } from "../components/button";
import { TextInputMask } from "react-native-masked-text";
import axios from "axios";
import env from "./env";
const moment = require("moment");
import * as Location from "expo-location";
import { RadioButton } from "react-native-paper";

interface EventData {
  location: {
    latitude: number;
    longitude: number;
    type: string;
    metadata: {
      [key: string]: any;
    };
  };
  name: string;
  description: string;
  starting_date: string;
  duration_hours: string;
}

export function AddNewEvent(data: any) {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const navigation = useNavigation();
  const [checked, setChecked] = useState("opcao1");

  const [eventDate, setEventDate] = useState<any>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [durationHours, setDurationHours] = useState<any>("");
  const [local, setLocal] = useState<string>("");
  const [edit, setEdit] = useState<string>("");

  const [address, setAddress] = useState('');

  data.route.params;

  axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${env.TOKEN}`;
    return config;
  });
  useEffect(() => {
    const getConvertedAddrress = async (latitude: any, longitude: any) => {
      try {
        const location = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        return location;
      } catch (error) {
        ToastAndroid.show("Erro na obtenção do endereço:", ToastAndroid.LONG);
      }
    };

    const fetchData = async () => {
      if (data.route.params) {
        const event = await getEventByUuid(data.route.params);
        const { latitude, longitude } = event.location;
        const fullAdrress = await getConvertedAddrress(
          parseFloat(latitude),
          parseFloat(longitude)
        );

        setName(event.event_name);
        setDescription(event.event_description);
        setDurationHours(
          moment(event.finishes_at, "YYYY-MM-DDTHH:mm:ss").diff(
            moment(event.starts_at, "YYYY-MM-DDTHH:mm:ss"),
            "hours"
          )
        );
        setAddress(
          `${fullAdrress[0].street}, ${fullAdrress[0].district}, ${fullAdrress[0].streetNumber}`
        );
        setEventDate(
          moment(event.starts_at, "YYYY-MM-DDTHH:mm:ss.SSS").format(
            "DD-MM-YYYY HH:mm"
          )
        );
        setLocal(event.location.type);
        setEdit(event.event_code);
      }
    };

    fetchData();
  }, []);

  const getGeoLocalization = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show("Permissão de localização negada", ToastAndroid.LONG);
        return;
      }

      if (address) {
        await Location.geocodeAsync(address);
      } else {
        const response = await Location.getCurrentPositionAsync({});
        return [
          {
            latitude: response.coords.latitude,
            longitude: response.coords.longitude,
          },
        ];
      }
    } catch (error) {
      ToastAndroid.show("Erro ao obter a geolocalização:", ToastAndroid.LONG);
    }
  };

  const getEventByUuid = async (eventCode: string) => {
    try {
      const url = `${env.API_URL}/event/${eventCode}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar dados de evento:", error);
    }
  };

  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!name);
  }

  function handleInputFocus() {
    setIsFocused(true);
  }

  async function handleSubmit() {
    try {
      const loc = await getGeoLocalization();

      if (loc) {
        const data: EventData = {
          location: {
            latitude: loc[0].latitude,
            longitude: loc[0].longitude,
            type: local,
            metadata: {
              test1: null,
            },
          },
          name,
          description,
          starting_date: moment(eventDate, "DD/MM/YYYY HH:mm").format(
            "YYYY-MM-DDTHH:mm:ss.SSS"
          ),
          duration_hours: durationHours,
        };

        if (edit) {
          const url = `${env.API_URL}/event/${edit}`;
          await axios.patch(url, data);
          ToastAndroid.show("Evento editado com sucesso!", ToastAndroid.LONG);
        } else {
          const url = `${env.API_URL}/event`;
          await axios.post(url, data);
          ToastAndroid.show("Evento criado com sucesso!", ToastAndroid.LONG);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        ToastAndroid.show(
          "Ocorreu um erro. Por favor, refaça o login.",
          ToastAndroid.SHORT
        );
      } else {
        console.log(error);
        ToastAndroid.show(
          "Ocorreu um erro. Por favor, tente novamente.",
          ToastAndroid.SHORT
        );
      }
    }
    navigation.navigate("EventList");
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <View style={styles.form}>
            <View style={styles.header}>
              {data.route.params ? (
                <Text style={styles.title}>Edição de evento</Text>
              ) : (
                <Text style={styles.title}>Qual evento vamos criar?</Text>
              )}
            </View>
            <TextInput
              style={[
                styles.input,
                (isFocused || isFilled) && { borderColor: colors.green },
              ]}
              value={name}
              placeholder="Nome evento"
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              onChangeText={(text) => {
                setName(text);
              }}
            />
            <TextInput
              style={[
                styles.input,
                (isFocused || isFilled) && { borderColor: colors.green },
              ]}
              value={description}
              placeholder="Descrição"
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              onChangeText={(text) => {
                setDescription(text);
              }}
            />

            <TextInputMask
              type={"datetime"}
              options={{
                format: "DD/MM/YYYY HH:mm",
              }}
              onChangeText={(text) => {
                setEventDate(text);
              }}
              style={[
                styles.input,
                (isFocused || isFilled) && { borderColor: colors.green },
              ]}
              value={eventDate}
              placeholder="Data e hora"
            />

            <TextInput
              style={[
                styles.input,
                (isFocused || isFilled) && { borderColor: colors.green },
              ]}
              keyboardType="numeric"
              value={durationHours.toString()}
              placeholder="Duração evento"
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              onChangeText={(text: any) => {
                setDurationHours(text);
              }}
            />

            <View style={styles.input}>
              <RNPickerSelect
                onValueChange={(text: any) => {
                  setLocal(text);
                }}
                items={[
                  { label: "Escola", value: "SCHOOL" },
                  { label: "Campo", value: "FIELD" },
                  { label: "Sem local definido", value: "ANY" },
                ]}
                value={local}
                placeholder={{
                  label: "Selecione um local",
                  value: null,
                }}
              />
            </View>

            <TextInput
              style={[
                styles.input,
                (isFocused || isFilled) && { borderColor: colors.green },
              ]}
              value={address}
              placeholder="Endereço"
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              onChangeText={(text) => {
                setAddress(text);
                setChecked('');

             
              }}
            />
            <RadioButton.Group
              onValueChange={(value) => {
                setChecked(value);
                setAddress('');

              }}
              value={checked}
            >
              <RadioButton.Item label="Local atual" value={"atual"} />
            </RadioButton.Group>
            <View style={styles.footer}>
              <Button title="Confirmar" onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },

  content: {
    flex: 1,
    width: "100%",
  },

  form: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 60,
    alignItems: "center",
    width: "100%",
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    color: colors.heading,
    width: "120%",
    fontSize: 18,
    marginTop: 25,
    padding: 5,
    textAlign: "center",
  },

  title: {
    fontSize: 32,
    textAlign: "center",
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 20,
  },

  footer: {
    marginTop: 40,
    width: "100%",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
  },
});