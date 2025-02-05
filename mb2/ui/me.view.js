import $ from 'jquery';
import * as Y from 'yjs';
class PresenceManager {
    awareness;
    presenceTimeout = 30000; // 30 seconds
    constructor(doc) {
        this.awareness = new Y.Awareness(doc);
        this.startPresenceTracking();
    }
    startPresenceTracking() {
        setInterval(() => {
            const states = this.awareness.getStates();
            states.forEach((state, clientId) => {
                if (Date.now() - state.lastActive > this.presenceTimeout) {
                    this.awareness.setLocalState({ status: 'away' });
                }
            });
        }, 5000);
    }
}
export default class MeView {
    getUser;
    awareness;
    $;
    constructor(ele, getUser, awareness) {
        this.getUser = getUser;
        this.awareness = awareness;
        this.$ = element => $(element, ele);
    }
    render() {
        const user = this.getUser();
        const listener = e => this.awareness().setLocalStateField('user', {
            ...user,
            [e.target.id.replace('user-', '')]: e.target.value
        });
        // Clear and get container
        this.$('.main-view').empty().append($('<div/>', {
            class: 'profile-page'
        }).append($('<div/>', {
            class: 'profile-field'
        }).append($('<label/>', {
            for: 'user-name',
            text: 'Name: '
        }), $('<input/>', {
            type: 'text',
            class: 'user-name',
            placeholder: 'Name',
            value: user.name
        }).on('input', listener)), $('<div/>', { class: 'profile-field' }).append($('<label/>', {
            for: 'user-color',
            text: 'Color: '
        }), $('<input/>', {
            type: 'color',
            class: 'user-color',
            value: user.color
        }).on('input', listener))));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWUudmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1lLnZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBQ3ZCLE9BQU8sS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDO0FBWXpCLE1BQU0sZUFBZTtJQUNULFNBQVMsQ0FBYztJQUN2QixlQUFlLEdBQVcsS0FBSyxDQUFDLENBQUMsYUFBYTtJQUV0RCxZQUFZLEdBQVU7UUFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVPLHFCQUFxQjtRQUN6QixXQUFXLENBQUMsR0FBRyxFQUFFO1lBQ2IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUMxQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFO2dCQUMvQixJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDckQsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2IsQ0FBQztDQUNKO0FBRUQsTUFBTSxDQUFDLE9BQU8sT0FBTyxNQUFNO0lBQ04sT0FBTyxDQUFXO0lBQzNCLFNBQVMsQ0FBVztJQUNwQixDQUFDLENBQTRCO0lBRXJDLFlBQVksR0FBRyxFQUFFLE9BQU8sRUFBRSxTQUFTO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxNQUFNO1FBQ0YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzVCLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRTtZQUM5RCxHQUFHLElBQUk7WUFDUCxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUs7U0FDckQsQ0FBQyxDQUFDO1FBRUgsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUMvQixDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ1IsS0FBSyxFQUFFLGNBQWM7U0FDeEIsQ0FBQyxDQUFDLE1BQU0sQ0FDTCxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ1IsS0FBSyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDLE1BQU0sQ0FDTCxDQUFDLENBQUMsVUFBVSxFQUFFO1lBQ1YsR0FBRyxFQUFFLFdBQVc7WUFDaEIsSUFBSSxFQUFFLFFBQVE7U0FDakIsQ0FBQyxFQUNGLENBQUMsQ0FBQyxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxXQUFXO1lBQ2xCLFdBQVcsRUFBRSxNQUFNO1lBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNuQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FDM0IsRUFDRCxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUMxQyxDQUFDLENBQUMsVUFBVSxFQUFFO1lBQ1YsR0FBRyxFQUFFLFlBQVk7WUFDakIsSUFBSSxFQUFFLFNBQVM7U0FDbEIsQ0FBQyxFQUNGLENBQUMsQ0FBQyxVQUFVLEVBQUU7WUFDVixJQUFJLEVBQUUsT0FBTztZQUNiLEtBQUssRUFBRSxZQUFZO1lBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztTQUNwQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FDM0IsQ0FDSixDQUNKLENBQUM7SUFDTixDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJCBmcm9tICdqcXVlcnknO1xuaW1wb3J0ICogYXMgWSBmcm9tICd5anMnO1xuXG5pbnRlcmZhY2UgVXNlclByZXNlbmNlIHtcbiAgICB1c2VySWQ6IHN0cmluZztcbiAgICBjdXJzb3I6IHtcbiAgICAgICAgcG9zaXRpb246IG51bWJlcjtcbiAgICAgICAgc2VsZWN0aW9uPzogW251bWJlciwgbnVtYmVyXTtcbiAgICB9O1xuICAgIGxhc3RBY3RpdmU6IG51bWJlcjtcbiAgICBzdGF0dXM6ICdhY3RpdmUnIHwgJ2lkbGUnIHwgJ2F3YXknO1xufVxuXG5jbGFzcyBQcmVzZW5jZU1hbmFnZXIge1xuICAgIHByaXZhdGUgYXdhcmVuZXNzOiBZLkF3YXJlbmVzcztcbiAgICBwcml2YXRlIHByZXNlbmNlVGltZW91dDogbnVtYmVyID0gMzAwMDA7IC8vIDMwIHNlY29uZHNcblxuICAgIGNvbnN0cnVjdG9yKGRvYzogWS5Eb2MpIHtcbiAgICAgICAgdGhpcy5hd2FyZW5lc3MgPSBuZXcgWS5Bd2FyZW5lc3MoZG9jKTtcbiAgICAgICAgdGhpcy5zdGFydFByZXNlbmNlVHJhY2tpbmcoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXJ0UHJlc2VuY2VUcmFja2luZygpIHtcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGVzID0gdGhpcy5hd2FyZW5lc3MuZ2V0U3RhdGVzKCk7XG4gICAgICAgICAgICBzdGF0ZXMuZm9yRWFjaCgoc3RhdGUsIGNsaWVudElkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKERhdGUubm93KCkgLSBzdGF0ZS5sYXN0QWN0aXZlID4gdGhpcy5wcmVzZW5jZVRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hd2FyZW5lc3Muc2V0TG9jYWxTdGF0ZSh7IHN0YXR1czogJ2F3YXknIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCA1MDAwKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lVmlldyB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBnZXRVc2VyOiBGdW5jdGlvbjtcbiAgICBwcml2YXRlIGF3YXJlbmVzczogRnVuY3Rpb247XG4gICAgcHJpdmF0ZSAkOiAoZWxlbWVudCkgPT4gSlF1ZXJ5U3RhdGljO1xuXG4gICAgY29uc3RydWN0b3IoZWxlLCBnZXRVc2VyLCBhd2FyZW5lc3MpIHtcbiAgICAgICAgdGhpcy5nZXRVc2VyID0gZ2V0VXNlcjtcbiAgICAgICAgdGhpcy5hd2FyZW5lc3MgPSBhd2FyZW5lc3M7XG4gICAgICAgIHRoaXMuJCA9IGVsZW1lbnQgPT4gJChlbGVtZW50LCBlbGUpO1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMuZ2V0VXNlcigpO1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGUgPT4gdGhpcy5hd2FyZW5lc3MoKS5zZXRMb2NhbFN0YXRlRmllbGQoJ3VzZXInLCB7XG4gICAgICAgICAgICAuLi51c2VyLFxuICAgICAgICAgICAgW2UudGFyZ2V0LmlkLnJlcGxhY2UoJ3VzZXItJywgJycpXTogZS50YXJnZXQudmFsdWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ2xlYXIgYW5kIGdldCBjb250YWluZXJcbiAgICAgICAgdGhpcy4kKCcubWFpbi12aWV3JykuZW1wdHkoKS5hcHBlbmQoXG4gICAgICAgICAgICAkKCc8ZGl2Lz4nLCB7XG4gICAgICAgICAgICAgICAgY2xhc3M6ICdwcm9maWxlLXBhZ2UnXG4gICAgICAgICAgICB9KS5hcHBlbmQoXG4gICAgICAgICAgICAgICAgJCgnPGRpdi8+Jywge1xuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3Byb2ZpbGUtZmllbGQnXG4gICAgICAgICAgICAgICAgfSkuYXBwZW5kKFxuICAgICAgICAgICAgICAgICAgICAkKCc8bGFiZWwvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcjogJ3VzZXItbmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnTmFtZTogJ1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgJCgnPGlucHV0Lz4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3VzZXItbmFtZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogJ05hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIubmFtZVxuICAgICAgICAgICAgICAgICAgICB9KS5vbignaW5wdXQnLCBsaXN0ZW5lcilcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICQoJzxkaXYvPicsIHsgY2xhc3M6ICdwcm9maWxlLWZpZWxkJyB9KS5hcHBlbmQoXG4gICAgICAgICAgICAgICAgICAgICQoJzxsYWJlbC8+Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yOiAndXNlci1jb2xvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnQ29sb3I6ICdcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICQoJzxpbnB1dC8+Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbG9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAndXNlci1jb2xvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb2xvclxuICAgICAgICAgICAgICAgICAgICB9KS5vbignaW5wdXQnLCBsaXN0ZW5lcilcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxufSJdfQ==