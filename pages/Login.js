import React, { useState } from "react";
import { View, StyleSheet, Pressable, Image, ScrollView, useWindowDimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, IconButton, Text, TextInput, Portal, Dialog, Paragraph } from "react-native-paper";
import DatePicker from 'react-native-date-picker'
import { useForm, Controller } from "react-hook-form";
import { signIn } from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";


import Constants from "../Constants";
import axios from "axios";

let { primary } = Constants.colors;

const Login = ({ navigation }) => {
    const dispatch = useDispatch();
    const {height} = useWindowDimensions();
    const user = useSelector((state) => state.user);
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [date, setDate] = useState(new Date())
    const [stringDate, setStringDate] = useState("")
    const [errorMsg, setErrorMsg] = useState("");
    const [visible, setVisible] = React.useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const signUp = (data) => {
        return async function saveCurrentUser(dispatch, getState) {
            try {
                await AsyncStorage.setItem(
                    '@user',
                    JSON.stringify(data)
                );
                dispatch(signIn(data));
            } catch (error) {
                console.log(error);
            }
        }
    }

    const onSubmit = async data => {
        try {
            const res = await axios.get(`${Constants.url}/users?data.email=${data.email}&data.password=${data.password}`);
            if (res.data.length > 0) {
                console.log(res.data[0])
                dispatch(signUp(res.data[0]));

            }
            if (res.data.length < 1) {
                setErrorMsg(`User not found`)
                showDialog();

            }
        } catch (err) {
            console.log(err);
        }

    };


    const [open, setOpen] = useState(false)

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    const handleBack = () => {
        navigation.navigate("Welcome");
    }

    return (
        <View style={[styles.container]}>
            <View style={styles.header}>
                <IconButton onPress={handleBack} icon={"arrow-left"} iconColor="white" />
                <Text variant="headlineSmall" style={[styles.text, {color: "white"}]}>Sign In</Text>
            </View>
            <ScrollView style={[styles.main]}>
                <View>
                    <Portal>
                        <Dialog visible={visible} onDismiss={hideDialog}>
                            <Dialog.Title>Error</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>{errorMsg}</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>Done</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Text variant="headlineLarge" style={styles.text}>Welcome back</Text>
                    <Text variant="bodyLarge" style={styles.regular}>Hello there, sign in to continue</Text>

                    <View style={styles.form_control}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (

                                <TextInput
                                    mode="outlined"
                                    label="Email"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.email}

                                />

                            )}
                            name="email"
                        />
                    </View>
                    <View style={styles.form_control}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (

                                <TextInput
                                    
                                    right={<TextInput.Icon icon={passwordVisible ? "eye" : "eye-off"}
                                        onPress={() => setPasswordVisible(!passwordVisible)} />}
                                    secureTextEntry={passwordVisible}
                                    mode="outlined"
                                    label="Password"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.password}
                                />
                            )}
                            name="password"
                        />

                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Button onPress={handleSubmit(onSubmit)} labelStyle={{ fontFamily: "Fontspring-bold" }} style={styles.signUp} mode="contained" >Continue</Button>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.already}>Do not have an account? </Text><Pressable onPress={() => {
                            navigation.navigate("Register");
                        }}><Text style={styles.altSignIn}>Sign Up</Text></Pressable>
                    </View>
                </View>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: primary,
    },
    regular: {
        fontFamily: "Fontspring-regular",
        color: "#b8bec8",
        margin: 0
    },
    main: {
        backgroundColor: "white",
        paddingHorizontal: 30,
        paddingTop: 30,
        flex: 1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20

    },
    text: {
        color: "#18315d",
        fontFamily: "Fontspring-bold",
    },
    head: {
        fontFamily: "Fontspring-regular",
    },
    auth: {
        marginTop: 20
    },
    signIn: {
        marginBottom: 13
    },
    signUp: {
        borderColor: "white",
        backgroundColor: primary,
    },
    footer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        height: 70
    },
    already: {
        fontFamily: "Fontspring-regular",
        color: "black"
    },
    altSignIn: {
        color: primary,
        fontFamily: "Fontspring-bold"
    },
    header: {
        backgroundColor: primary,
        flex: .2,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center"
    },
   
    form_control: {
        marginVertical: 5
    }
})

export default Login;