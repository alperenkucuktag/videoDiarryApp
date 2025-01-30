import { View, Text, FlatList, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import useVideoStore from "./store/useVideoStore";
import { RenderVideoItem } from "@/components/RenderVideoItem";
import FloatButton from "@/components/FloatButton";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function Home() {
  const router = useRouter();
  const { videos } = useVideoStore();
  const [refresh, setRefresh] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefresh((prev) => prev + 1);
    }, [])
  );

  const renderItem = ({ item, index }) => (
    <Animated.View
      key={index}
      entering={FadeInUp.delay(index * 100).springify()}
    >
      <RenderVideoItem item={item} />
    </Animated.View>
  );

  return (
    <SafeAreaView className="justify-center flex-1 bg-white">
      {!videos?.length && (
        <Text className="p-10 text-5xl font-bold text-center text-black">
          Welcome to Video Diary App
        </Text>
      )}

      {videos?.length > 0 ? (
        <AnimatedFlatList
          data={videos}
          className="px-4 py-10"
          keyExtractor={(item, index) => `${index}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      ) : (
        <Text className="mt-5 text-base text-center text-green-400">
          No videos available. Add a new one!
        </Text>
      )}

      <View className="absolute z-50 rounded-full shadow-lg bottom-14 right-14">
        <FloatButton onPress={() => router.push("/videoSelection")} />
      </View>
    </SafeAreaView>
  );
}
