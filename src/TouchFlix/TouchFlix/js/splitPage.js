(function () {
    'use strict';

    // Custom event raised after the fragment is appended to the DOM.
    WinJS.Application.addEventListener('fragmentappended', function handler(e) {
        if (e.location === '/html/splitPage.html') { fragmentLoad(e.fragment, e.state); }
    });

    function updateForLayout(lv, layout) {
        lv.layout = new WinJS.UI.ListLayout();
        lv.refresh();
    }

    function layoutChanged(e) {
        var list = document.querySelector('.itemList');
        if (list) {
            var lv = WinJS.UI.getControl(list);
            updateForLayout(lv, e.layout);
        }
    }

    function fragmentLoad(elements, options) {
        if (!WinJS.Navigation.canGoBack) {
            WinJS.Navigation.history.backStack[0] = { location: '/html/categoryPage.html' };
            var backButton = document.querySelector('header[role=banner] .win-backbutton');
            if (backButton) {
                backButton.removeAttribute('disabled');
            }
        }

        try {
            var appLayout = Windows.UI.ViewManagement.ApplicationLayout.getForCurrentView();
            if (appLayout) {
                appLayout.addEventListener('layoutchanged', layoutChanged);
            }
        } catch (e) { }

        splitPage.groups = pageData.groups;
        var group = (options && 'group' in options) ? options.group : pageData.groups[0];
        splitPage.items = pageData.items.filter(function (item) { return item.group.key === group.key }),
        splitPage.selectedItem = splitPage.items[0];

        elements.querySelector('.pageTitle').textContent = group.title;

        WinJS.UI.processAll(elements)
            .then(function () {
                var lv = WinJS.UI.getControl(elements.querySelector('.itemList'));
                lv.itemRenderer = elements.querySelector('.itemTemplate');
                updateForLayout(lv, Windows.UI.ViewManagement.ApplicationLayout.value);

                var details = elements.querySelector('.articleSection');
                return WinJS.Binding.processAll(details, splitPage.selectedItem);
            });
    }

    function itemInvoked(e) {
        var details = document.querySelector('.articleSection');
        splitPage.selectedItem = splitPage.items[e.detail.itemIndex];
        WinJS.Binding.processAll(details, splitPage.selectedItem);
        details.scrollTop = 0;
    }

    // The getGroups() and getItems() functions contain sample data.
    // TODO: Replace with custom data.
    function getGroups() {
        var colors = ['rgba(209, 211, 212, 1)', 'rgba(147, 149, 152, 1)', 'rgba(65, 64, 66, 1)'];
        var groups = [];

        for (var i = 0; i < 12; i++) {
            var even = (i % 2) === 0;
            groups.push({
                key: 'group' + i,
                title: 'Collection title lorem ' + i,
                backgroundColor: colors[i % colors.length],
                label: 'Eleifend posuere',
                description: even ? 'ǺSed nisl nibh, eleifend posuere.' : 'ǺSed nisl nibh, eleifend posuere laoreet egestas, porttitor quis lorem.',
                fullDescription: 'Ǻ Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.' + (even ? '' : ' Ǻ Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.')
            });
        }

        return groups;
    }

    function getItems() {
        var colors = ['rgba(209, 211, 212, 1)', 'rgba(147, 149, 152, 1)', 'rgba(65, 64, 66, 1)'];
        var items = [];

        for (var g = 0, gl = pageData.groups.length; g < gl; g++) {
            var numItems = g % 2 === 0 ? 12 : 9;
            for (var i = 0; i < numItems; i++) {
                items.push({
                    group: pageData.groups[g],
                    key: 'item' + i,
                    title: g + '.' + i + (i % 2 === 0 ? ' ǺSed nisl nibh, eleifend posuere.' : ' ǺSed nisl nibh, eleifend posuere laoreet egestas, porttitor quis lorem.'),
                    subtitle: 'Phasellus faucibus',
                    backgroundColor: colors[i % colors.length],
                    content: (new Array(5)).join('<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.</p>'),
                    description: 'Ǻ Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.'
                });
            }
        }

        return items;
    }

    var pageData = {};
    pageData.groups = getGroups();
    pageData.items = getItems();

    WinJS.Namespace.define('splitPage', {
        fragmentLoad: fragmentLoad,
        itemInvoked: itemInvoked
    });
})();
