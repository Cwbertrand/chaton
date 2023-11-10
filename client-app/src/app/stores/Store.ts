import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import CommentStore from "./commentStore";

interface Store {
    activityStore: ActivityStore,
    commonStore: CommonStore,
    userStore:  UserStore,
    modalStore: ModalStore,
    profileStore: ProfileStore;
    commentStore: CommentStore;
}

export const store: Store = {
    activityStore : new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore(),
    commentStore: new CommentStore(),
}

export const StoreContext = createContext(store);

//this is a simple react hook which uses the created context in line 12
export function useStore() {
    return useContext(StoreContext);
}