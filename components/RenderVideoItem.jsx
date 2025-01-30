import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";

export const RenderVideoItem = ({ item }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setStatusAsync({
        shouldPlay: false,
        isMuted: true,
        isLooping: false,
      });
    }
  }, []);

  if (!item) return null;

  return (
    <TouchableOpacity
      className="flex-row h-48 p-2 mx-4 mb-4 overflow-hidden border border-gray-200 shadow-sm rounded-xl"
      style={{ backgroundColor: item.videoColor }}
      onPress={() =>
        router.push({
          pathname: "/videoDetail",
          params: {
            videoUri: item.videoUri,
            description: item.videoDescription,
            title: item.videoTitle,
          },
        })
      }
      activeOpacity={0.7}
    >
      {/* Sol taraf - Video Önizleme */}
      <View className="relative h-full w-[50%] bg-gray-100">
        {item.videoUri ? (
          <Video
            ref={videoRef}
            source={{ uri: item.videoUri }}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            isMuted={true}
            isLooping={false}
            positionMillis={0}
            onLoad={() => setIsLoading(false)}
            onError={(error) => console.log("Video error:", error)}
            posterSource={{ uri: item.videoUri }}
            usePoster={true}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <View className="items-center justify-center w-full h-full">
            <Ionicons name="videocam" size={32} color="#9ca3af" />
          </View>
        )}

        {isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-gray-200">
            <Ionicons name="reload" size={20} color="#666" />
          </View>
        )}
      </View>

      {/* Sağ taraf - Bilgiler */}
      <View className="justify-center flex-1 p-3">
        <Text className="text-lg font-semibold text-gray-800" numberOfLines={1}>
          {item.videoTitle || "Untitled"}
        </Text>
        <Text className="mt-1 text-gray-600 text-md" numberOfLines={2}>
          {item.videoDescription || "No description"}
        </Text>

        <Text className="text-gray-400 text-md">
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
