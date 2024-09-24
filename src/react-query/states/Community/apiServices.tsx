import { ModelCommunityContent } from "@/src/Models/CommunityModel";
import { dummyCommunityData } from "./dummyContentData";

export const fetchCommunityContentData = async (params: { page: number; date: number; activeTab: string }): Promise<ModelCommunityContent[]> => {
    return new Promise<ModelCommunityContent[]>((resolve) => {
        setTimeout(() => {
            const { activeTab, page } = params;
            if (page > 3) {
                resolve([]);
                return;
            }

            let filteredData = dummyCommunityData;

            if (activeTab === 'Sudah Gabung') {
                filteredData = dummyCommunityData.filter((item) => item.isJoined);
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
