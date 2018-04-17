class Frame {

    bindHandlers() {

    }

    bindConditionals() {
        for (let child of this.el.el.children) {
            const key = child.getAttribute("f-if");
            if (key !== undefined && Object.keys(this.data).includes(key)) {
                if (this.data[key]) {
                    domu(child).hide();
                }
            }
        }
    }

    bindLoops() {
        for (let child of this.el.el.children) {
            const key = child.getAttribute("f-for");
            if (key == null) continue;
            const [itemName, listName] = key.split(" in ");
            const list = this.data[listName];
            if (list === undefined) continue;

            let childMarkup = domu(child).html();
            let markup = "";

            for (const todo of list) {
                markup += childMarkup.replace("{{ todo.descr }}", todo.descr)
            }
            domu(child).html(markup);
        }
    }

    build() {
        this.bindConditionals();
        this.bindLoops();
    }

    draw() {
        let markup = this.el.html();
        Object.keys(this.data).forEach((key) => {
            const template = `{{ ${key} }}`;
            markup = markup.replace(template, this.data[key]);
        });
        this.el.html(markup);
    }

    constructor(options) {
        const { el, data, methods } = options;

        if (el === undefined) {
            throw new Error("Must provide an app template");
        }
        this.el = domu(el);

        this.data = data === undefined ?
            {} :
            data;
        this.methods = methods === undefined ?
            {} :
            methods;

        this.build();
        this.draw();
    }
}
