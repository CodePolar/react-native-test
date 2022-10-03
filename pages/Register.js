import React, { useState } from "react";
import { View, StyleSheet, Pressable, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, IconButton, Text, TextInput, Portal, Dialog, Paragraph } from "react-native-paper";
import DatePicker from 'react-native-date-picker'
import { useForm, Controller } from "react-hook-form";
import { signIn } from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";


import Constants from "../Constants";
import axios from "axios";

let { primary } = Constants.colors;

const Register = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [date, setDate] = useState(new Date())
    const [stringDate, setStringDate] = useState("")
    const [errorMsg, setErrorMsg] = useState("");
    const [visible, setVisible] = React.useState(false);
    const [verify_password, setVerifyPassword] = useState("");
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            full_name: '',
            username: '',
            email: '',
            password: '',
            birthdate: ''
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
        if (control._formValues.password != verify_password) {
            setErrorMsg(`Passwords must match`)
            showDialog();
            return;
        }
        if (stringDate.length < 1) {
            setErrorMsg(`The birthdate is required`)
            showDialog();
            return;
        }
        data.birthdate = stringDate;
        try {
            const res = await axios.get(`${Constants.url}/users?data.email=${data.email}`);
            if (res.data.length > 0) {
                setErrorMsg(`Email already registered`)
                showDialog();
            }
            if (res.data.length < 1) {
                await axios.post(`${Constants.url}/users`, {
                    data: { ...data }
                })
                const inserted = await axios.get(`${Constants.url}/users?data.email=${data.email}`);
                dispatch(signUp(inserted.data[0]));
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
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton onPress={handleBack} icon={"arrow-left"} iconColor="white" />
                <Text variant="headlineSmall" style={[styles.text, {color: "white"}]}>Sign Up</Text>
            </View>
            <View style={styles.main}>
                <ScrollView style={{paddingHorizontal: 30}}>
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
                    <Text variant="headlineLarge" style={styles.text}>Personal Info</Text>
                    <Text variant="bodyLarge" style={styles.regular}>Hello there, sign up to continue</Text>
                    <View style={styles.form_control}>
                        <Controller
                            control={control}
                            rules={{
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    mode="outlined"
                                    label="Full name"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.full_name}

                                />

                            )}
                            name="full_name"
                        />

                    </View>

                    <View style={styles.form_control}>
                        <Controller
                            control={control}
                            rules={{
                                required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (

                                <TextInput
                                    mode="outlined"
                                    label="Username"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={errors.username}
                                />

                            )}
                            name="username"
                        />
                    </View>
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
                    <View style={styles.form_control}>
                        <TextInput
                            right={<TextInput.Icon icon={passwordVisible ? "eye" : "eye-off"}
                                onPress={() => setPasswordVisible(!passwordVisible)} />}
                            secureTextEntry={passwordVisible}
                            mode="outlined"
                            label="Re-Password"
                            value={verify_password}
                            onChangeText={(text) => {
                                setVerifyPassword(text);
                            }}

                            error={control._formValues.password == verify_password ? false : true}
                        />

                    </View>
                    <View style={styles.form_control}>
                        <TextInput onPressIn={() => {
                            setOpen(!open);
                        }} mode="outlined" value={stringDate} label="Birthdate" />
                        <DatePicker
                            modal
                            open={open}
                            date={date}
                            mode="date"
                            onConfirm={(date) => {
                                var d = new Date(date);
                                d.setDate(d.getDate());
                                setOpen(false)
                                setStringDate(d.toISOString().split("T")[0])
                                setDate(date)
                            }}
                            onCancel={() => {
                                setOpen(false)
                            }}
                        />

                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Button onPress={handleSubmit(onSubmit)} labelStyle={{ fontFamily: "Fontspring-bold" }} style={styles.signUp} mode="contained" >Sign Up</Button>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.already}>Already have an account? </Text><Pressable onPress={() => {
                            navigation.navigate("Login")
                        }}><Text style={styles.altSignIn}>Sign In</Text></Pressable>
                    </View>
                </ScrollView>

            </View>
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
        paddingTop: 30,
        flex: 1,
        width: "100%",
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

export default Register;