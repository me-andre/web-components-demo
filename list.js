{
    const render = () => {
        return `
            <style type="text/css">
                dl {
                    background: grey;
                }
            </style>
            <div>
                <img src="" data-picture>
                <dl>title</dl>
                <dd data-title></dd>
                <dl>first name</dl>
                <dd data-firstname></dd>
                <dl>gender</dl>
                <dd data-gender></dd>
            </div>
        `;
    };

    window.customElements.define('x-testtaker-details', class extends HTMLElement {
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'open' });
            this.shadow.innerHTML = render();
            ['title', 'firstname', 'gender'].forEach(name => {
                const value = this.getAttribute(name);
                this.setProp(name, value);
            });
            this.picture = this.getAttribute('picture');
        }

        set picture(urlString) {
            this.shadow.querySelector('[data-picture]').src = urlString;
        }

        setProp(name, value) {
            this.shadow.querySelector(`[data-${name}]`).innerHTML = value;
        }
    });
}

{
    const render = (data) => {
        return `
            <style type="text/css">
                .list {
                    width: 200px;
                }
            </style>
            <div class="list">
                ${data.map(taker => (`
                    <x-testtaker-details title="${taker.title}" picture="${taker.picture}" firstname="${taker.firstname}" gender="${taker.gender}"></x-testtaker-details>
                    <hr>
                `)).join('')}
            </div>
        `;
    };

    const orders = {
        asc: {
            less: -1,
            more: 1,
        },
        desc: {
            less: 1,
            more: -1
        }
    };

    window.customElements.define('x-list-of-testtakers', class extends HTMLElement {
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'open' });
            this.sortProp = 'firstname';
            this.orderVal = 'asc';
            this.limitVal = -1;
            this.listVal = [];
            this.render();
        }

        set list(list) {
            this.listVal = JSON.parse(list);
            this.render();
        }

        render() {
            const { sortProp } = this;
            let { listVal } = this;
            listVal = [ ...listVal ];
            const { [this.orderVal]: { less, more } } = orders;
            listVal.sort((lUser, rUser) => {
                const { [sortProp]: lVal } = lUser;
                const { [sortProp]: rVal } = rUser;
                if (lVal === rVal) { return 0 }
                return lVal < rVal ? less : more;
            });
            if (this.limitVal >= 0) {
                listVal = listVal.slice(0, this.limitVal);
            }
            this.shadow.innerHTML = render(listVal);
        }

        set limit(limit) {
            if (!limit) {
                this.limitVal = -1;
            } else {
                this.limitVal = parseInt(limit);
            }
            this.render();
        }

        set order(orderStr) {
            this.orderVal = orderStr;
            this.render();
        }

        set ['sort-by'](sortProp) {
            this.sortProp = sortProp;
            this.render();
        }

        attributeChangedCallback(name, oldValue, newValue) {
            this[name] = newValue;
        }

        static get observedAttributes() {
            return ['list', 'limit', 'sort-by', 'order'];
        }
    });
}
