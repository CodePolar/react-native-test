import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, useWindowDimensions, Image } from "react-native";
import { Text, Card, Title, Paragraph, Button, Divider, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import MyPosts from "../components/MyPosts";
import Constants from "../Constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "../features/auth/authSlice";
import axios from "axios";

const Profile = ({ navigation, route }) => {
    const user = useSelector((state) => state.user.user);
    const posts = useSelector((state) => state.posts.posts)
    const comments = useSelector((state) => state.comments.comments)

    const [postCount, setPostCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const window = useWindowDimensions();
    const dispatch = useDispatch();
    var [alt_user, setAltUser] = useState();

    const getPostCount = async () => {
        const res = await axios.get(`${Constants.url}/posts?data.user_id=${alt_user? alt_user.id : user.id}`)
        setPostCount(res.data.length);
    }
    const getCommentCount = async () => {
        const res = await axios.get(`${Constants.url}/comments?data.user_id=${alt_user? alt_user.id : user.id}`)
        setCommentCount(res.data.length);
    }

    const fetchUser = async () => {
        try {
            const res =  await axios.get(`${Constants.url}/users/${route.params.user_id}`);
            setAltUser(res.data);

        } catch(err) {
            console.log(err);
        }
    }

    const closeSession = () => async (dispatch, getState) => {
        try {
            await AsyncStorage.removeItem(
                '@user'
                );
            dispatch(signOut());
          } catch (error) {
            console.log(error)
          }

    }

    useEffect(() => {
        fetchUser();
        getPostCount();
        getCommentCount()
    }, [])

    useEffect(() => {
        getPostCount();
        getCommentCount()
    }, [posts, comments])

    useEffect(() => {
        if(alt_user) {
            getPostCount();
            getCommentCount()
        }
    }, [alt_user])

    const handleSignOut = () => {
        dispatch(closeSession());
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>

                <View style={[styles.top_part, { height: window.height / 3 }]}>
                    <Text style={[styles.bold, { color: "white", margin: 20 }]} variant="headlineSmall">Profile</Text>
                </View>
                <View style={[styles.bottom_part]}>
                    <View style={styles.cardContainer}>
                        <Card style={[styles.card,]}>
                            <Card.Content style={[{ alignItems: "center",  }]}>
                                <View style={[styles.avatar]}>
                                    <Image style={styles.avatar} source={{ uri: "https://loveshayariimages.in/wp-content/uploads/2021/10/1080p-Latest-Whatsapp-Profile-Images-1.jpg" }} />
                                </View>
                                <View style={styles.stats}>

                                    <View style={styles.single}>
                                        <Text style={{ fontWeight: "bold" }} variant="titleLarge">{postCount}</Text>
                                        <Text style={styles.regular} variant="titleMedium">Posts</Text>
                                    </View>


                                    <View style={styles.single}>
                                        <Text style={{ fontWeight: "bold" }} variant="titleLarge">{commentCount}</Text>
                                        <Text style={styles.regular} variant="titleMedium">Comments</Text>
                                    </View>
                                </View>
                                <View style={styles.info}>
                                    <Text style={styles.bold} variant="headlineSmall">{alt_user? alt_user.data.full_name :user.data.full_name}</Text>
                                </View>

                                <View style={styles.details}>
                                    <View style={styles.detail}>
                                        <Text style={styles.bold} variant="titleSmall">Username: </Text>
                                        <Text style={styles.regular}>{user.data.username}</Text>

                                    </View>
                                    <View style={styles.detail}>
                                        <Text style={styles.bold} variant="titleSmall">Birthdate: </Text>
                                        <Text style={styles.regular}>{user.data.birthdate.replace('-', '.').replace('-', '.')}</Text>

                                    </View>
                                </View>
                                {!alt_user? (
                                    <>
                                    
                                <View style={styles.mypost}>
                                    <View style={styles.row}>
                                        <Text style={styles.bold} variant="titleLarge">My Posts</Text>
                                        <Button labelStyle={styles.bold} icon="plus" size={20} onPress={() => {
                                            navigation.navigate("AddPost");

                                        }}>Add Post</Button>

                                    </View>
                                    <MyPosts />
                                </View>
 <View>
 <Button onPress={handleSignOut} style={{marginTop: 30}} buttonColor="#ec5990" labelStyle={{fontFamily: "Fontspring-bold"}} textColor="white" mode="contained-tonal">Sign Out</Button>
</View>
</>
                                ) : (
                                    <></>
                                )}
                               
                            </Card.Content>
                        </Card>

                              
                    </View>
                </View>
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    top_part: {
        flex: .5,
        backgroundColor: Constants.colors.primary,

    },
    bottom_part: {
        flex: .5,
        backgroundColor: "white"
    },
    card: {
        transform: [{ translateY: -150 }],
        flex: 1
    },
    cardContainer: {
        flex: 1,
        backgroundColor: "white",
        marginHorizontal: 15
    },
    avatar: {
        height: 150,
        width: 150,
        borderRadius: 100,
        elevation: 20
    },
    info: {
        marginTop: 10,
        alignItems: "center"
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20
    },
    single: {
        alignItems: "center",
        paddingHorizontal: 20
    },
    bold: {
        fontFamily: "Fontspring-bold"
    },
    regular: {
        fontFamily: "Fontspring-regular"
    },
    mypost: {
        width: "100%"
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    details: {
        width: "100%",
        marginVertical: 10
    },
    detail: {
        flexDirection: "row",
        alignItems: "center"
    }
})

export default Profile;