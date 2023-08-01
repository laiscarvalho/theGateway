
import { useNavigation, useRoute } from '@react-navigation/native';
import React, {  useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { Button } from '../components/button';



export function UserIdentification() {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [name, setName] = useState<string>()
    const navigation = useNavigation();


    function handleInputBlur() {
        setIsFocused(false)
        setIsFilled(!!name)
    }

    function handleInputFocus() {
        setIsFocused(true)

    }

    function handleInputChanged(value: string) {
        setIsFilled(!!value)
        setName(value)
    }

    function handleSubmit() {
        navigation.navigate('Confirmation')
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.content}>
                    <View style={styles.form}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Como podemos chamar você?</Text>
                        </View>
                        <TextInput
                            style={[
                                styles.input,
                                (isFocused || isFilled) &&
                                { borderColor: colors.green }
                            ]}
                            placeholder='Nome' onBlur={handleInputBlur} onFocus={handleInputFocus} onChangeText={handleInputChanged} />
                        <TextInput
                            style={[
                                styles.input,
                                (isFocused || isFilled) &&
                                { borderColor: colors.green }
                            ]}
                            placeholder='CPF' onBlur={handleInputBlur} onFocus={handleInputFocus} onChangeText={handleInputChanged} />
                        <TextInput
                            style={[
                                styles.input,
                                (isFocused || isFilled) &&
                                { borderColor: colors.green }
                            ]}
                            placeholder='Email' onBlur={handleInputBlur} onFocus={handleInputFocus} onChangeText={handleInputChanged} />
                        <TextInput
                            style={[
                                styles.input,
                                (isFocused || isFilled) &&
                                { borderColor: colors.green }
                            ]}
                            placeholder='Digite a senha' secureTextEntry={true} onBlur={handleInputBlur} onFocus={handleInputFocus} onChangeText={handleInputChanged} />

                        <View style={styles.footer}>
                            <Button title='Confirmar' onPress={handleSubmit} />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
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

    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 60,
        alignItems: 'center',
        width: '100%'
    },

    input: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        color: colors.heading,
        width: '100%',
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: 'center'
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
    header: {
        alignItems: 'center'
    }
})
