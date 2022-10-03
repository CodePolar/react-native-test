import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, FlatList } from "react-native";
import { Text, DataTable, Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import SinglePost from "../components/SinglePost";
import axios from "axios";
import Constants from "../Constants";
import { list } from "../features/posts/postSlice";

export const fetchPosts = (page) => async (dispatch, getState) => {
    try {
        const res = await axios.get(`${Constants.url}/posts?_page=${page}&_sort=data.created_at&_order=desc`);

        dispatch(list(res.data));
    } catch (err) {
        console.log(err);
    }
}

const Posts = () => {
    const posts = useSelector((state) => state.posts.posts)
    const dispatch = useDispatch();
    const [page, setPage] = React.useState(1);
    const [count, setCount] = React.useState(0);

    const fetchCount = async () => {
        const response = await axios.get(`${Constants.url}/posts`);
        setCount((response.data.length + 10 - 1) / 10);
    }

    useEffect(() => {
        fetchCount();
    }, [])

    useEffect(() => {
        dispatch(fetchPosts(page));
    }, [page])


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineLarge" style={[styles.text]}>Posts</Text>

            </View>
            <View style={styles.main}>
                <ScrollView >
                    {posts.map((e, i) => {
                        return <SinglePost key={i} actions={false} post={e} />

                    })}
                    {posts.length > 0 ? (
                        <View style={styles.button_container}>
                            <Button onPress={() => {
                                setPage((prev) => (prev - 1) < 1 ? 1 : (prev - 1));
                            }}>
                                Previous Page
                            </Button>
                            <Text>{Math.max(page)}-{Math.floor(count)}</Text>
                            <Button onPress={() => {
                                if (Math.max(page) != Math.floor(count)) {
                                    setPage((prev) => (prev + 1) > Math.floor(count) ? Math.floor(count) : (prev + 1));
                                }

                            }}>
                                Next Page
                            </Button>

                        </View>
                    ) : (
                        <View style={{ flex: 1, alignItems: "center", paddingTop: 10 }}>
                            <Text style={[styles.text, { color: "black" }]}>Empty</Text>

                        </View>
                    )}


                </ScrollView>
            </View>
        </View>


    )
}

const styles = StyleSheet.create({

    list: {
        marginHorizontal: 5
    },
    button_container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    container: {
        flex: 1,
        backgroundColor: Constants.colors.primary,

    },
    main: {
        backgroundColor: "white",
        paddingHorizontal: 2,
        paddingTop: 10,
        marginHorizontal: 10,
        flex: 1,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20

    },

    header: {
        backgroundColor: Constants.colors.primary,
        flex: .2,
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "flex-start"
    },
    text: {
        color: "white",
        fontFamily: "Fontspring-bold",
    },

})

export default Posts;