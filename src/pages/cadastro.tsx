
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, ActivityIndicator, ToastAndroid } from 'react-native';
import axios from 'axios';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { Button } from '../components/button';
import { Tab, TabView } from '@rneui/base';
import jwtDecode from 'jwt-decode';
import env from './env';
import * as SecureStore from 'expo-secure-store';
import { UserConfig } from './userConfig';


export function Cadastro() {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const navigation = useNavigation();

    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [name, setName] = useState<string>()


    function handleInputBlur() {
        setIsFocused(false)
        setIsFilled(!!name)
    }

    function handleInputFocus() {
        setIsFocused(true)
    }



    function handleInputEmail(value: string) {
        setIsFilled(!!value)
        setEmail(value)
    }

    function handleInputPassword(value: string) {
        setIsFilled(!!value)
        setPassword(value)
    }

    async function getUserData(data: any) {
        try {
            await SecureStore.setItemAsync('token', data);
            const token = await SecureStore.getItemAsync('token');
            if (token !== null) env.TOKEN = token
            env.TOKEN
        } catch (error) {
            console.error('Erro ao armazenar o valor:', error);
        }
    };

    async function handleLogin() {
        if (email && password) {
            const url = `${env.API_URL}/user/login`;

            try {
                const  {data } = await axios.post(url, { email, password });
                await getUserData(data.token);
                const decoded = jwtDecode(data.token);

                const userCode  = decoded?.user_code;
                
                const userPermission = decoded?.user_roles
                    ?.split(',')
                    ?.map((item: any) => item.trim())
                    ?.filter((item: any) => item === env.USR_ROLE);

                navigation.navigate('Menu', {userPermission,userCode});
            } catch (error: any) {
                if (error?.response?.status === 403) {
                    ToastAndroid.show(
                        'Acesso negado. Verifique suas credenciais.',
                        ToastAndroid.SHORT
                    );
                } else {   
                    ToastAndroid.show(
                        'Verifique email e senha!.',
                        ToastAndroid.SHORT
                    );
                }
            }
            return;
        }
        ToastAndroid.show('Verifique usuário e senha.', ToastAndroid.SHORT);
    }


    const [index, setIndex] = React.useState(0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content} >
                <Tab
                    value={index}
                    onChange={(e) => setIndex(e)}
                    indicatorStyle={{
                        backgroundColor: colors.green,
                        height: 3,
                    }}
                    variant="default"
                    style={{ marginTop: 50 }}
                >
                    <Tab.Item
                        title="Entrar"
                        titleStyle={styles.tabTitle}
                    />
                    <Tab.Item
                        title="Novo Usuário"
                        titleStyle={styles.tabTitle}
                    />
                </Tab>

                <TabView value={index} onChange={setIndex} animationType="spring">
                    <TabView.Item >
                        <View style={styles.formLogin}>
                            <ActivityIndicator size="large" color="#00ff00" animating={false} />
                            <TextInput
                                style={[

                                    styles.inputLogin,
                                    (isFocused || isFilled) &&
                                    { borderColor: colors.green },

                                ]}
                                value={email}
                                placeholder='Email' onBlur={handleInputBlur} onFocus={handleInputFocus} onChangeText={handleInputEmail}
                            />

                            <TextInput
                                style={[
                                    styles.inputLogin,
                                    (isFocused || isFilled) &&
                                    { borderColor: colors.green }
                                ]}
                                placeholder='Senha' secureTextEntry={true} onBlur={handleInputBlur} onFocus={handleInputFocus} onChangeText={handleInputPassword} />
                            <View style={styles.footerLogin}>
                                <Button title='Confirmar' onPress={handleLogin} />
                            </View>
                        </View>
                    </TabView.Item>
                    <TabView.Item >
                        <UserConfig />
                    </TabView.Item>
                </TabView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flex: 1,
    },

    form: {
        paddingHorizontal: 54,
        width: '100%'
    },

    formLogin: {
        width: '100%',
        textAlign: 'center',
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
        textAlign: 'center'
    },
    inputLogin: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        color: colors.heading,
        fontSize: 18,
        padding: 20,
        width: 200,
        marginTop: 30,
        textAlign: 'center',


    },

    title: {
        fontSize: 32,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20,
    },

    footer: {
        marginTop: 40,
        width: '100%',
        paddingHorizontal: 20
    },
    footerLogin: {
        marginTop: 130,
        width: '50%',
        paddingHorizontal: 20,

    },
    header: {
        alignItems: 'center'
    },
    tabTitle: {
        fontSize: 12,
        color: colors.heading,
        fontFamily: fonts.heading,
    },

})
