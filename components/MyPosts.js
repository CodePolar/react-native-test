import axios from "axios";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useSelector } from "react-redux";
import Constants from "../Constants";
import SinglePost from "./SinglePost";

const MyPosts = ({postCount}) => { 
    const user = useSelector((state) => state.user.user);
    const postsState = useSelector((state) => state.posts.posts);

    const [posts, setPosts] = useState([]);

    const fetchMyPosts = async () =>{
        const res = await axios.get(`${Constants.url}/posts?_sort=data.created_at&_order=desc&_limit=5&data.user_id=${user.id}`);
        setPosts(res.data);
    }

    useEffect(() => {
        fetchMyPosts();
    }, [postsState])
    

    return (
        <View>
            {posts.map((e,i) => {
                return (<SinglePost  actions key={i} post={e} />)
            })}
        </View>
    )

}

export default MyPosts;