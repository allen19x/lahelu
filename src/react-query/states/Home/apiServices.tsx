import { ModelHomeContent } from "@/src/HomeScreenModel/HomeModel";
import { dummyMemeData } from "./dummyContentData";

export const fetchHomeContentData = async (params: { page: number, date: number }): Promise<ModelHomeContent[]> => {
    console.log('page:', params.page);

    const itemsPerPage = 10;

    const newMemeData = Array.from({ length: itemsPerPage }, (_, index) => {
        const baseItem = dummyMemeData[index % dummyMemeData.length];
        return {
            ...baseItem,
            id: `${baseItem.id}-${params.page}-${index}`,
        };
    });

    return new Promise<ModelHomeContent[]>((resolve) => {
        setTimeout(() => resolve(newMemeData), 1000);
    });
};
