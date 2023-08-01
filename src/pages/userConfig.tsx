import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, ToastAndroid } from "react-native";
import axios from "axios";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { Button } from "../components/button";
import env from "./env";

export function UserConfig() {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const navigation = useNavigation();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [cpf, setCpf] = useState<string>();
  const [name, setName] = useState<string>();
  const route = useRoute();


  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!name);
  }

  function handleInputFocus() {
    setIsFocused(true);
  }

  async function handleSubmit() {
    if (email && password && name && cpf) {
      try {
        if (route.params) {
          const urlPatch = `${env.API_URL}/user`;

          await axios.patch(
            urlPatch,
            {
              email,
              password,
              name,
              document: cpf,
              document_type: "cpf",
            },
            {
              headers: {
                Authorization: `Bearer ${env.TOKEN}`,
              },
            }
          );
          ToastAndroid.show(
            "Cadastro atualizado com sucesso!",
            ToastAndroid.SHORT
          );
        } else {
          const url = `${env.API_URL}/user/register`;
          await axios.post(url, {
            email,
            password,
            name,
            document: cpf,
            document_type: "cpf",
          });
          navigation.navigate("Confirmation", { data: { name } });
        }
      } catch (error: any) {
        if (error.response && error.response.status === 403) {
          ToastAndroid.show(
            "Acesso negado. Verifique suas credenciais.",
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
      return;
    }
    ToastAndroid.show("Verifique suas informações ", ToastAndroid.SHORT);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (route.params) {
        const url = `${env.API_URL}/user/${route.params}`;
        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${env.TOKEN}`,
          },
        });
        setName(data.name);
        setCpf(data.document);
        setEmail(data.email);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.form}>
      <View style={styles.header}>
        {route.params ? (
          <Text style={styles.title}>
            Olá {name?.split(" ")[0]} vamos alterar o cadastro?
          </Text>
        ) : (
          <Text style={styles.title}>Como podemos chamar você?</Text>
        )}
      </View>
      <TextInput
        style={[
          styles.input,
          (isFocused || isFilled) && { borderColor: colors.green },
        ]}
        placeholder="Nome"
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        value={name}
        onChangeText={(text: any) => {
          setName(text);
        }}
      />
      <TextInput
        style={[
          styles.input,
          (isFocused || isFilled) && { borderColor: colors.green },
        ]}
        placeholder="CPF"
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        value={cpf}
        onChangeText={(text: any) => {
          setCpf(text);
        }}
      />
      <TextInput
        style={[
          styles.input,
          (isFocused || isFilled) && { borderColor: colors.green },
        ]}
        placeholder="Email"
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        value={email}
        onChangeText={(text: any) => {
          setEmail(text);
        }}
      />
      <TextInput
        style={[
          styles.input,
          (isFocused || isFilled) && { borderColor: colors.green },
        ]}
        placeholder="Digite a senha"
        secureTextEntry={true}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        onChangeText={(text: any) => {
          setPassword(text);
        }}
      />

      <View style={styles.footer}>
        <Button title="Confirmar" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  form: {
    paddingHorizontal: 70,
    width: "100%",
  },

  formLogin: {
    width: "100%",
    textAlign: "center",
    margin: 80,
    paddingHorizontal: 10,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    color: colors.heading,
    width: 250,
    fontSize: 18,
    marginTop: 30,
    padding: 10,
    textAlign: "center",
  },
  inputLogin: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    color: colors.heading,
    fontSize: 18,
    padding: 20,
    width: 200,
    marginTop: 30,
    textAlign: "center",
  },

  title: {
    fontSize: 32,
    textAlign: "center",
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 50,
  },

  footer: {
    marginTop: 40,
    width: "100%",
    paddingHorizontal: 20,
  },

  header: {
    alignItems: "center",
  },
  tabTitle: {
    fontSize: 12,
    color: colors.heading,
    fontFamily: fonts.heading,
  },
});
