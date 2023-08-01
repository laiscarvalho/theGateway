import React, { useEffect, useState } from 'react'

import { StyleSheet, Text, SafeAreaView, View, ToastAndroid } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import env from './env'
import { useNavigation } from '@react-navigation/native';



export default function EditEvent() {
    const [selectedValue, setSelectedValue] = useState('');
    const [events, setEvents] = useState([]);
    const navigation = useNavigation();



    axios.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${env.TOKEN}`;
        return config;
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${env.API_URL}/event`
                const { data } = await axios.get(url);
                const teste = data.map((item: any) => ({ label: item.event_name, value: item.event_code, description: item.description }));
                setEvents(teste)
            } catch (error) {
                console.error('Erro ao carregar dados de evento:', error);
            }
        };

        fetchData();

    }, []);


    const handleFileUpload = async () => {

      const response  = await getEventByUuid()
      navigation.navigate('NewEvent',response)

    };

    const getEventByUuid = async () => {
        try {
            const url = `${env.API_URL}/event/${selectedValue}`
            const { data } = await axios.get(url);
            return data;
        } catch (error) {
            console.error('Erro ao carregar dados de evento:', error);
        }
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Qual evento deseja alterar?</Text>
            </View>
            <View style={styles.input}>
                <RNPickerSelect
                    onValueChange={(text: any) => {
                        setSelectedValue(text)
                    }}
                    items={events}
                    value={selectedValue}
                    placeholder={{
                        label: 'Selecione um evento',
                        value: null,
                    }}
                />
            </View>

            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleFileUpload} >

                <Text>
                    <Feather name="chevron-right" style={{ fontSize: 28, color: colors.white }} />
                </Text>
            </TouchableOpacity>
        </SafeAreaView>

    )
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    content: {
        flex: 1,
        width: '100%'
    },
    title: {
        fontSize: 32,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20,
    },
    header: {
        alignItems: 'center'
    },
    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 10,
        height: 56,
        width: 70,
        textAlign: 'center',
    },
    footer: {
        width: '100%',
        paddingHorizontal: 20
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        color: colors.heading,
        width: '90%',
        fontSize: 18,
        marginTop: 20,
        padding: 10,
        textAlign: 'center'
    },
})
