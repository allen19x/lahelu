import { AVPlaybackStatus, AVPlaybackStatusSuccess, Video } from "expo-av";

export interface ModelHomeContent {
  id: string;
  type: 'image' | 'video';
  aspectRatio: number;
  url: string;
  thumbnail: string;
  title: string;
  postTime: number;
  avatarProfile: string;
  username: string;
  hashtags: string[];
  upvote: number
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

export interface MemeItemProps {
  item: ModelHomeContent;
  isMuted: boolean;
  visibleVideoId: string | null;
  togglePlayPause: (videoId: string) => void;
  toggleMute: () => void;
  handleVideoLoad: (videoId: string, ref: Video | null) => void;
  handlePlaybackStatusUpdate: (videoId: string, status: AVPlaybackStatus) => void;
}

export type HeaderProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabList: Tab[];
  setIsTabClicked: (tab: boolean) => void;
};

export type Tab = { 
  id: number; 
  tabName: string; 
};