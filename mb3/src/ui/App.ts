import {DataStore} from "../core/datastore";
import {ObjectList, UserProfileUI} from "./index";

export class App {
    constructor(private dataStore: DataStore) {
    }

    async start() {
        $(document).ready(async () => {
            console.log("jQuery is ready!");

            const userProfileUI = new UserProfileUI(this.dataStore);
            await userProfileUI.loadUserProfile();

            const objectListUI = new ObjectList(this.dataStore);
            await objectListUI.loadObjects();

            $("#create-object-button").on("click", async () => {
                if (!this.dataStore) return;
                const newObject = await this.dataStore.createObject({
                    docId: "mainDoc",
                    title: "New Object",
                    content: "This is the content of the new object.",
                    tags: [],
                });
                await objectListUI.loadObjects();
            });
        });
    }
}
