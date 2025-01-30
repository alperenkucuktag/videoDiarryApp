import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

const useVideoStore = create(
  persist(
    (set, get) => ({
      videos: [],

      addVideo: (video) =>
        set((state) => ({ videos: [...state.videos, video] })),

      editVideo: (videoUri, updatedVideo) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.videoUri === videoUri ? { ...video, ...updatedVideo } : video
          ),
        })),

      removeVideo: (videoUri) =>
        set((state) => ({
          videos: state.videos.filter((video) => video.videoUri !== videoUri),
        })),
    }),
    {
      name: "video-storage",
      storage: createJSONStorage(() => AsyncStorage),

      onRehydrateStorage: (state) => {
        console.log("hydration starts");
        return (state, error) => {
          if (error) {
            console.log("hydration error", error);
          } else {
            console.log("hydration finished");
          }
        };
      },
    }
  )
);

export default useVideoStore;
