import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Video } from "expo-av";
import { useState, useEffect, useRef } from "react";
import useVideoStore from "./store/useVideoStore";

export default function VideoDetail() {
  const router = useRouter();
  const { videoUri } = useLocalSearchParams();
  const { videos, editVideo, removeVideo } = useVideoStore();
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
    const foundVideo = videos.find((v) => v.videoUri === videoUri);
    if (foundVideo) {
      setVideo(foundVideo);
      setTitle(foundVideo.videoTitle || "");
      setDescription(foundVideo.videoDescription || "");
    }
  }, [videoUri, videos]);

  if (!video) {
    return (
      <View className="items-center justify-center flex-1">
        <Text className="text-lg text-red-500">
          Video not found. Redirecting...
        </Text>
      </View>
    );
  }

  const handleSaveChanges = () => {
    editVideo(video.videoUri, {
      videoTitle: title,
      videoDescription: description,
    });
    Alert.alert("Success", "Video details updated!", [
      { text: "OK", onPress: () => router.push("/") },
    ]);
  };

  const handleDeleteVideo = () => {
    Alert.alert("Delete Video", "Are you sure you want to delete this video?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          removeVideo(video.videoUri);
          router.push("/");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="mb-4 text-2xl font-bold text-center">
        Edit Video Details
      </Text>

      <View className="w-full h-48 mb-4 overflow-hidden bg-gray-100 rounded-lg">
        <Video
          ref={videoRef}
          source={{ uri: video.videoUri }}
          style={{
            width: "100%",
            height: "100%",
          }}
          useNativeControls
          resizeMode="contain"
          shouldPlay={false}
        />
      </View>

      <TextInput
        className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter new title"
      />

      <TextInput
        className="w-full h-20 p-3 mb-3 border border-gray-300 rounded-lg"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter new description"
        multiline
      />

      <TouchableOpacity
        className="w-full p-4 mb-3 bg-green-400 rounded-lg"
        onPress={handleSaveChanges}
      >
        <Text className="font-semibold text-center text-white text-xl">
          Save Changes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full p-4 bg-red-400 rounded-lg "
        onPress={handleDeleteVideo}
      >
        <Text className="font-semibold text-center text-white text-xl">
          Delete Video
        </Text>
      </TouchableOpacity>
    </View>
  );
}
