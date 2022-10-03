import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import Constants from "../Constants";

let { primary } = Constants.colors;

const Welcome = ({navigation}) => {

    const handleSignIn = () => {
        navigation.navigate("Login")

    }

    const handleSignUp = () => {
        navigation.navigate("Register")
    }

    return (
        <View style={styles.container}>
            <View style={[styles.section, styles.image]}>
                <Image style={{
                    width: 450,
                    height: 450,
                    resizeMode: 'contain'

                }} source={{ uri: "https://visme.co/blog/wp-content/uploads/2020/03/animation-software-header.gif" }} />
            </View>
            <View style={[styles.section, styles.main]}>
                <Text variant="headlineLarge" style={styles.text}>Welcome</Text>
                <View style={styles.auth}>
                    <Text variant="titleLarge" style={[styles.text, styles.head]}>Manage your posts</Text>
                    <Text variant="headlineMedium" style={[styles.text, styles.head]}>Seamlessly and intuitively</Text>
                </View>
                <View style={styles.auth}>
                    <Button icon={"email"} style={styles.signIn} labelStyle={{ fontFamily: "Fontspring-bold" }} textColor={primary} buttonColor={"white"} mode="contained" onPress={handleSignIn}>Sign In with Email</Button>
                    <Button style={styles.signUp} labelStyle={{ fontFamily: "Fontspring-bold" }} textColor="white" mode="outlined" onPress={handleSignUp}>Create an account</Button>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.already}>Already have an account? </Text><Pressable onPress={() => {
                        navigation.navigate("Login")
                    }}><Text style={styles.altSignIn}>Sign In</Text></Pressable>
                </View>
              
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    section: {
        flex: .5,
    },
    main: {
        backgroundColor: primary,
        paddingHorizontal: 30,
    },
    text: {
        color: "white",
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
        borderColor: "white"
    },
    footer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
    },
    already: {
        fontFamily: "Fontspring-regular",
        color: "#ffffff7d"
    },
    altSignIn: {
        color: "white",
        fontFamily: "Fontspring-bold"
    },
    image: {
        backgroundColor: primary,
        alignItems: "center",
        justifyContent: "center"

    }
})

export default Welcome;