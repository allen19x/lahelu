import { ModelTopicsContent } from "@/src/Models/TopicsModel";
import { dummyTopicsData } from "./dummyContentData";

export const fetchTopicsContentData = async (params: { page: number; date: number; activeTab: string }): Promise<ModelTopicsContent[]> => {
    return new Promise<ModelTopicsContent[]>((resolve) => {
        setTimeout(() => {
            const { activeTab, page } = params;
            if (page > 3) {
                resolve([]);
                return;
            }

            let filteredData = dummyTopicsData;

            if (activeTab === 'Sudah Gabung') {
                filteredData = dummyTopicsData.filter((item) => item.isJoined);
            }

            let modifiedData = filteredData;
            if (page === 3) {
                modifiedData = filteredData.slice(0, 4);
            }

            const paginatedData = modifiedData.map((item) => ({
                ...item,
                id: `${item.id}_${page}`,
            }));

            resolve(paginatedData);
        }, 1000);
    });
};
