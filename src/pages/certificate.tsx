import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ToastAndroid,
  TextInput,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { Button } from "../components/button";
import * as DocumentPicker from "expo-document-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import env from "./env";
import FormData from "form-data";

export default function Certificate(data: string) {
  const [events, setEvents] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [eventCode, setEventCode] = useState<string>("");

  axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${env.TOKEN}`;
    return config;
  });

  useEffect(() => {
    setEventCode(data.route.params);
    const fetchData = async () => {
      try {
        const url = `${env.API_URL}/event`;
        const { data } = await axios.get(url);
        const teste = data.map((item: any) => ({
          label: item.event_name,
          value: item.event_code,
          description: item.description,
        }));
        setEvents(teste);
      } catch (error) {
        console.error("Erro ao carregar dados de evento:", error);
      }
    };

    fetchData();
  }, []);

  const selectFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      setFile(file);
    } catch (error) {
      // Lógica para lidar com erros na seleção do arquivo
      console.error("Erro ao selecionar o arquivo:", error);
    }
  };

  const handleFileUpload = async () => {
    const url = `${env.API_URL}/event/certificate/upload/${eventCode}`;
    const data = await getEventByUuid();
    const formData = new FormData();

    formData.append("file", {
      uri: file?.uri,
      name: file?.name,
      type: "application/pdf",
    });

    formData.append("name", data.event_name);
    formData.append("description", data.event_description);
    formData.append("metadata", JSON.stringify({ name }));

    try {
      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      ToastAndroid.show("Arquivo enviado com sucesso.", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(
        "Ocorreu um erro ao enviar arquivo.",
        ToastAndroid.SHORT
      );
    }
  };

  const getEventByUuid = async () => {
    try {
      const url = `${env.API_URL}/event/${eventCode}`;
      const { data } = await axios.get(url);
      return data;
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecione o certificado para ser emitido</Text>
      </View>
      <TextInput
        style={[
          styles.input,
          (isFocused || isFilled) && { borderColor: colors.green },
        ]}
        value={name}
        placeholder="Detalhes do certificado"
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        onChangeText={(text) => {
          setName(text);
        }}
      />
      <View style={styles.footer}>
        <Button title="selecionar certificado" onPress={selectFile} />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={handleFileUpload}
      >
        <Text>
          <Feather
            name="chevron-right"
            style={{ fontSize: 28, color: colors.white }}
          />
        </Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 32,
    textAlign: "center",
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 20,
  },
  header: {
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 10,
    height: 56,
    width: 70,
    textAlign: "center",
  },
  footer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    color: colors.heading,
    width: "90%",
    fontSize: 18,
    marginTop: 10,
    padding: 5,
    textAlign: "center",
  },
});
