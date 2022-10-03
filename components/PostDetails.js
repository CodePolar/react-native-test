import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, IconButton, Divider,   } from "react-native-paper";
import Constants from "../Constants";
import axios from "axios";
import Comments from "./Comments";

const primary = Constants.colors.primary;

const PostDetails = ({ route, navigation }) => {
    const { post_id, author_name, user_id } = route.params;
    const [post, setPost] = useState();


    const fetchPost = async () => {
        const res = await axios.get(`${Constants.url}/posts?id=${post_id}`);
        setPost(res.data[0]);
    }

    const handleBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        fetchPost();
    }, [])

    return (
        <View style={styles.container}>
        
            <View style={styles.header}>
                <IconButton onPress={handleBack} icon={"arrow-left"} iconColor="white" />
                <Text variant="headlineSmall" style={[styles.text, { ...styles.heading }]}>Details</Text>

            </View>
            <View style={styles.main}>
                <Text variant="headlineMedium" style={styles.text}>{post?.data.title}</Text>
                <Text variant="titleLarge" style={[styles.text, { fontFamily: "Fontspring-regular" }]}>{post?.data.subtitle}</Text>
                <View style={styles.detail_info}>
                    <View style={{ flexDirection: "row" }}>
                        <Text variant="titleMedium" style={[styles.text]}>Author: </Text>
                        <Pressable>
                            <Text variant="titleMedium" style={[styles.text, { fontFamily: "Fontspring-regular" }]}>{author_name}</Text>
                        </Pressable>

                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text variant="titleMedium" style={[styles.text]}>Created at: </Text>
                        <Text variant="titleMedium" style={[styles.text, { fontFamily: "Fontspring-regular" }]}>{new Date(post?.data.created_at ? post?.data.created_at : null).toISOString().split("T")[0].replace('-', '.').replace('-', '.')}</Text>

                    </View>

                    <Text variant="titleMedium" style={[styles.regular, { color: "black", fontSize: 17, marginTop: 20, marginBottom: 20 }]}>{post?.data.content}</Text>

                </View>
                <Divider />
                <Comments post_id={post?.id} />
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
        margin: 0
    },
    main: {
        backgroundColor: "white",
        paddingHorizontal: 30,
        paddingTop: 30,
        flex: 1,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20

    },
    text: {
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
    header: {
        backgroundColor: primary,
        flex: .1,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center"
    },
    heading: {
        color: "white",
    },
  
    detail_info: {
        marginTop: 10
    }
});

export default PostDetails;