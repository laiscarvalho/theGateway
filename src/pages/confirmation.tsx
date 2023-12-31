import React, { useEffect, useState } from 'react'

import { SafeAreaView, StyleSheet, View, Text } from 'react-native'
import { Button } from '../components/button'
import colors from '../styles/colors'
import fonts from '../styles/fonts'
import { useNavigation, useRoute } from '@react-navigation/native'



export function Confirmation() {
    const navigation = useNavigation();
    const route = useRoute();
    const [firstName, setFirstName] = useState<string>('')

    useEffect(() => {
        const data = route.params?.data;
        const name = data.name.split(' ')[0];
        setFirstName(name)
    });



    function handleSubmit() {
        navigation.navigate('Menu')
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>
                    {firstName}
                </Text>
                <Text style={styles.subtitle}>
                    Prontinho
                </Text>
                <Text style={styles.title}>
                    Agora vamos começar a cuidar do seu checkin com muito cuidado
                </Text>
                <View style={styles.footer}>
                    <Button title='Começar' onPress={handleSubmit} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    title: {
        fontSize: 22,
        fontFamily: fonts.heading,
        textAlign: 'center',
        color: colors.heading,
        lineHeight: 38,
        marginTop: 15
    },

    subtitle: {
        fontFamily: fonts.text,
        textAlign: 'center',
        fontSize: 20,
        paddingVertical: 20,
        color: colors.heading

    },

    emoji: {
        fontSize: 32
    },

    footer: {
        width: '100%',
        paddingHorizontal: 50,
        marginTop: 20

    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 30
    }

})

