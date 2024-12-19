import $ from "jquery";
export default class ObjViewMini {
    ele;
    obj;
    constructor(obj) {
        this.obj = obj;
        this.ele = $('<li>').addClass('obj-view-mini').css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        });
        const observer = (e) => {
            const kc = e[0].keysChanged;
            if (kc.has('name') || kc.has('public'))
                setTimeout(() => this.render());
        };
        this.obj.observe(observer);
        this.ele.on("remove", () => this.obj.unobserve(observer));
        this.render();
    }
    render() {
        const title = $('<span>').addClass('obj-title').text(this.obj.name);
        const publicStatus = $('<span>').addClass('obj-public').text(this.obj.public ? 'Public' : 'Private');
        this.ele.empty().append(title, publicStatus);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqLnZpZXcubWluaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9iai52aWV3Lm1pbmkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBSXZCLE1BQU0sQ0FBQyxPQUFPLE9BQU8sV0FBVztJQUNaLEdBQUcsQ0FBUztJQUNwQixHQUFHLENBQVU7SUFFckIsWUFBWSxHQUFZO1FBQ3BCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUMvQyxPQUFPLEVBQUUsTUFBTTtZQUNmLGNBQWMsRUFBRSxlQUFlO1lBQy9CLFVBQVUsRUFBRSxRQUFRO1NBQ3ZCLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUErQixDQUFDLENBQUMsRUFBRSxFQUFFO1lBQy9DLE1BQU0sRUFBRSxHQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1lBQ3pDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztnQkFDbEMsVUFBVSxDQUFDLEdBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQztRQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBRTFELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRU8sTUFBTTtRQUNWLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEUsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFckcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAkIGZyb20gXCJqcXVlcnlcIjtcbmltcG9ydCBOT2JqZWN0IGZyb20gJy4uL3NyYy9vYmonO1xuaW1wb3J0IHtZRXZlbnR9IGZyb20gXCJ5anNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JqVmlld01pbmkge1xuICAgIHB1YmxpYyByZWFkb25seSBlbGU6IEpRdWVyeTtcbiAgICBwcml2YXRlIG9iajogTk9iamVjdDtcblxuICAgIGNvbnN0cnVjdG9yKG9iajogTk9iamVjdCkge1xuICAgICAgICB0aGlzLm9iaiA9IG9iajtcbiAgICAgICAgdGhpcy5lbGUgPSAkKCc8bGk+JykuYWRkQ2xhc3MoJ29iai12aWV3LW1pbmknKS5jc3Moe1xuICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IG9ic2VydmVyOiAoZTogWUV2ZW50PGFueT5bXSkgPT4gdm9pZCA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrYzogU2V0PHN0cmluZz4gPSBlWzBdLmtleXNDaGFuZ2VkO1xuICAgICAgICAgICAgaWYgKGtjLmhhcygnbmFtZScpIHx8IGtjLmhhcygncHVibGljJykpXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+IHRoaXMucmVuZGVyKCkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm9iai5vYnNlcnZlKG9ic2VydmVyKTtcbiAgICAgICAgdGhpcy5lbGUub24oXCJyZW1vdmVcIiwgKCkgPT4gdGhpcy5vYmoudW5vYnNlcnZlKG9ic2VydmVyKSk7XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSAkKCc8c3Bhbj4nKS5hZGRDbGFzcygnb2JqLXRpdGxlJykudGV4dCh0aGlzLm9iai5uYW1lKTtcbiAgICAgICAgY29uc3QgcHVibGljU3RhdHVzID0gJCgnPHNwYW4+JykuYWRkQ2xhc3MoJ29iai1wdWJsaWMnKS50ZXh0KHRoaXMub2JqLnB1YmxpYyA/ICdQdWJsaWMnIDogJ1ByaXZhdGUnKTtcblxuICAgICAgICB0aGlzLmVsZS5lbXB0eSgpLmFwcGVuZCh0aXRsZSwgcHVibGljU3RhdHVzKTtcbiAgICB9XG59Il19