import $ from "jquery";
import {DataStore} from "../core/datastore";

export class ObjectList {
    private objectList = $("#object-list");
    constructor(private dataStore: DataStore) {
    }

    async loadObjects() {
        const allObjects = await this.dataStore.query({});
        const objects = allObjects
            .map((obj) => this.dataStore.deserializeObject(obj.serializedObject)?.data)
            .filter((obj) => obj);
        this.renderObjectList(objects);
    }

    renderObjectList(objects: any[]) {
        this.objectList.empty();

        objects.forEach((object) => {
            const listItem = $("<li>").addClass("object-list-item");
            const objectDiv = $("<div>").data("object-id", object.id);

            const titleDiv = $("<div>")
                .addClass("object-title")
                .text(object.title);
            const tagsDiv = $("<p>")
                .addClass("object-tags")
                .text(
                    object.tags ? `Tags: ${object.tags.join(", ")}` : "",
                );
            const contentPreviewDiv = $("<p>")
                .addClass("object-content-preview")
                .text(
                    object.content
                        ? `Content Preview: ${object.content.substring(0, 100)}...`
                        : "",
                );

            const editButton = $("<button>")
                .text("Edit")
                .on("click", () => this.editObject(object, listItem));
            const deleteButton = $("<button>")
                .text("Delete")
                .on("click", () => this.deleteObject(object.id));
            const viewButton = $("<button>")
                .text("View")
                .on("click", () => this.viewObject(object));

            objectDiv.append(
                titleDiv,
                tagsDiv,
                contentPreviewDiv,
                editButton,
                deleteButton,
                viewButton,
            );
            listItem.append(objectDiv);
            this.objectList.append(listItem);
        });
    }

    editObject(object: any, listItem: $<HTMLElement>) {
        const objectDiv = listItem.find("div").first();
        objectDiv.empty();

        const input = $("<input>").val(object.title);
        const saveButton = $("<button>")
            .text("Save")
            .on("click", () => this.saveEdit(object, input.val() as string, listItem));
        const cancelButton = $("<button>")
            .text("Cancel")
            .on("click", () => this.cancelEdit(object, listItem));

        objectDiv.append(input, saveButton, cancelButton);
    }

    async saveEdit(object: any, newTitle: string, listItem: $<HTMLElement>) {
        object.setProperty("title", newTitle);
        await this.dataStore.save(object);
        this.loadObjects();
    }

    cancelEdit(object: any, listItem: $<HTMLElement>){
        this.loadObjects();
    }

    async deleteObject(objectId: string) {
        await this.dataStore.deleteObject(objectId);
        this.loadObjects();
    }

    viewObject(object: any) {
        const contentDiv = $("#content");
        contentDiv.empty();
        contentDiv.append($("<h2>").text(object.title));
        contentDiv.append($("<p>").text(object.content));
    }
}
