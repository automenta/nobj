import $ from "jquery";
import {DataStore} from "../core/datastore";
import type {UserProfile} from "../core/user";

export class UserProfileUI {
    private userProfileDiv = $("#user-profile");

    constructor(private dataStore: DataStore) {
    }

    async loadUserProfile() {
        let userProfile = await this.dataStore.loadUserProfile();
        if (!userProfile) {
            userProfile = { id: "defaultUser", name: "Anonymous" };
            await this.dataStore.saveUserProfile(userProfile);
        }
        this.displayUserProfile(userProfile);
    }

    displayUserProfile(userProfile: UserProfile) {
        this.userProfileDiv.empty();
        this.userProfileDiv.append($("<p>").text(`ID: ${userProfile.id}`));
        this.userProfileDiv.append($("<p>").text(`Name: ${userProfile.name}`));
    }
}
