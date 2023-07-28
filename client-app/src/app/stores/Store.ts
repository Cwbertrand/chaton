import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store {
    activityStore: ActivityStore
}

export const store: Store = {
    activityStore : new ActivityStore()
}

export const StoreContext = createContext(store);

//this is a simple react hook which uses the created context in line 12
export function useStore() {
    return useContext(StoreContext);
}