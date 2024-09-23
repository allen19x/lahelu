import { AVPlaybackStatusSuccess, Video } from "expo-av";

export interface ModelHomeContent {
  id: string;
  type: 'image' | 'video';
  aspectRatio: number;
  url: string;
  title: string;
  postTime: string;
  avatarProfile: string;
  username: string;
  hashtags: string[];
}

export interface ContentComments {
  id: string;
  comment: string;
  like: number,
  reply: ContentReplyComments
}

export interface ContentReplyComments {
  id: string;
  comment: string;
  like: number,
  reply: ContentReplyComments
}

export interface ModelVideoRef {
  ref: Video | null;
  isLoaded: boolean;
  isMuted: boolean;
  status: AVPlaybackStatusSuccess | null;
}

export type HeaderProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};