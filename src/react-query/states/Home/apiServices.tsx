import { ModelHomeContent } from "@/src/Models/HomeModel";
import { dummyMemeData } from "./dummyContentData";

export const fetchHomeContentData = async (params: { page: number, date: number, activeTab: string }): Promise<ModelHomeContent[]> => {
    let filteredData = [...dummyMemeData];

    if (params.activeTab === 'Fresh') {
        filteredData = filteredData.sort((a, b) => b.postTime - a.postTime);
    } else if (params.activeTab === 'Trending') {
        filteredData = filteredData.sort((a, b) => b.upvote - a.upvote);
    }

    const newMemeData = filteredData.map((baseItem, index) => ({
        ...baseItem,
        id: `${baseItem.id}-${params.page}-${index}`,
    }));

    return new Promise<ModelHomeContent[]>((resolve) => {
        setTimeout(() => resolve(newMemeData), 1000);
    });
};
