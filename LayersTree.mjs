//
//  LayersTree.mjs
//
//  Leaflet v2 Layers control with tree view
//  No dependencies.
//

import { Layer, Control, Util } from 'leaflet';

const LayersTree_defaults = {
    // actuall should be
    // collapsed: true,
    // treeCollapsed: true,
    collapsed: false,
    treeCollapsed: false,
}

class LayersTree extends Control.Layers {
    // Seems to be that doing just this, I should
    // get behaviour almost identical to the regular
    // Control.Layers
    constructor(baselayers=[], overlays=[], options={}) {
        super();
        Util.setOptions(this, LayersTree_defaults);
        this.initialize(baselayers, overlays, options);
    }
    // we'll call them "Groups"
    // addToGroup()       // addTo(map) should not trigger this 
    // removeFromGroup()  // removeFrom(map) should not trigger this
    // addGroup()         // 
    // removeGroup()      //
}

const TreeComponent_defaults = {
        expandIcon: '',
        collapseIcon: '',
        startCollapsed: false,
    }

class TreeComponent {
    // Options will actually point to SVG's, which for preference
    // will be defined using :before in CSS

    constructor(parentElement, data={}, options={}) {
        Util.setOptions(this, TreeComponent_defaults);
        Util.setOptions(this, options);
        this._mama = parentElement;
    }
}

export { LayersTree, LayersTree as default };


//; (function ($, window, document, undefined) {
//    /**
//     * Default LayersTree  options.
//    /**
//     * LayersTree HTML templates.
//     */
//     // FIXME:  These defaults suck, becuase they use .innerHTML
//     //         Can't have that.
//    var templates = {
//        treeview: '<div class="LayersTree"></div>',
//        treeviewItem: '<div role="treeitem" class="list-group-item" data-bs-toggle="collapse"></div>',
//        treeviewGroupItem: '<div role="group" class="list-group collapse" id="itemid"></div>',
//        treeviewItemStateIcon: '<i class="state-icon"></i>',
//        treeviewItemIcon: '<i class="item-icon"></i>'
//    };
//    /**
//     * BsTreeview Plugin constructor.
//     * @param {*} element
//     * @param {*} options
//     */
//    function bstreeView(element, options) {
//        this.element = element//;
//        this.itemIdPrefix = element.id + "-item-";
//        this.settings = $.extend({}, defaults, options);
//        this.init();
//    }
//    /**
//     * Avoid plugin conflict.
//     */
//    $.extend(bstreeView.prototype, {
//        /**
//         * LayersTree intialize.
//         */
//        init: function () {
//            this.tree = [];
//            this.nodes = [];
//            // Retrieve LayersTree Json Data.
//            if (this.settings.data) {
//                if (this.settings.data.isPrototypeOf(String)) {
//                    this.settings.data = $.parseJSON(this.settings.data);
//                }
//                this.tree = $.extend(true, [], this.settings.data);
//                delete this.settings.data;
//            }
//            // Set main LayersTree class to element.
//            $(this.element).addClass('LayersTree')//;
//
//            this.initData({ nodes: this.tree });
//            var _this = this;
//            this.build($(this.element), this.tree, 0);
//            // Update angle icon on collapse
//            $(this.element).on('click', '.list-group-item', function (e) {
//                $('.state-icon', this)
//                    .toggleClass(_this.settings.expandIcon)
//                    .toggleClass(_this.settings.collapseIcon);
//                // navigate to href if present
//                }
//                else
//                {
//                    // Toggle the data-bs-target. Issue with Bootstrap toggle and dynamic code
//                    $($(this).attr("data-bs-target")).collapse('toggle');
//                }
//            });
//        },
//        /**
//         * Initialize treeview Data.
//         * @param {*} node
//         */
//        initData: function (node) {
//            if (!node.nodes) return;
//            var parent = node;
//            var _this = this;
//            $.each(node.nodes, function checkStates(index, node) //{
//
//                node.nodeId = _this.nodes.length;
//                node.parentId = parent.nodeId;
//                _this.nodes.push(node)//;
//
//                if (node.nodes) {
//                    _this.initData(node);
//                }
//            });
//        },
//        /**
//         * Build treeview.
//         * @param {*} parentElement
//         * @param {*} nodes
//         * @param {*} depth
//         */
//        build: function (parentElement, nodes, depth) {
//            var _this = this;
//            // Calculate item padding.
//            var leftPadding = _this.settings.parentsMarginLeft//;
//
//            if (depth > 0) {
//                leftPadding = (_this.settings.indent + depth * _this.settings.indent).toString() + "rem;";
//            }
//            depth += 1;
//            // Add each node and sub-nodes.
//            $.each(nodes, function addNodes(id, node) {
//                // Main node element.
//                var treeItem = $(templates.treeviewItem)
//                    .attr('data-bs-target', "#" + _this.itemIdPrefix + node.nodeId)
//                    .attr('style', 'padding-left:' + leftPadding)
//                    .attr('aria-level', depth);
//                // Set Expand and Collapse icones.
//                if (node.nodes) {
//                    var treeItemStateIcon = $(templates.treeviewItemStateIcon)
//                        .addClass((node.expanded)?_this.settings.expandIcon:_this.settings.collapseIcon);
//                    treeItem.append(treeItemStateIcon);
//                }
//                // set node icon if exist.
//                if (node.icon) {
//                    var treeItemIcon = $(templates.treeviewItemIcon)
//                        .addClass(node.icon);
//                    treeItem.append(treeItemIcon);
//                }
//                // Set node Text.
//                treeItem.append(node.text);
//                // Reset node href if present
//                if (node.href) {
//                    treeItem.attr('href', node.href);
//                }
//                // Add class to node if present
//                if (node.class) {
//                    treeItem.addClass(node.class);
//                }
//                // Add custom id to node if present
//                if (node.id) {
//                    treeItem.attr('id', node.id);
//                }
//                // Attach node to parent.
//                parentElement.append(treeItem);
//                // Build child nodes.
//                if (node.nodes) {
//                    // Node group item.
//                    var treeGroup = $(templates.treeviewGroupItem)
//                        .attr('id', _this.itemIdPrefix + node.nodeId);
//                    parentElement.append(treeGroup);
//                    _this.build(treeGroup, node.nodes, depth);
//                    if (node.expanded) {
//                        treeGroup.addClass(_this.settings.expandClass);
//                    }
//                }
//            });
//        }
//    });

//    // A really lightweight plugin wrapper around the constructor,
//    // preventing against multiple instantiations
//    $.fn[pluginName] = function (options) {
//        return this.each(function () {
//            if (!$.data(this, "plugin_" + pluginName)) {
//                $.data(this, "plugin_" +
//                    pluginName, new bstreeView(this, options));
//            }
//        });
//    };
//})(jQuery, window, document);


(function() {
    const our_CSS = `
/*
 LayersTree.css
*/
.LayersTree .expand-icon:before {
    content: '<svg></svg>';
.LayersTree .collapse-icon:before {
    content: '<svg></svg>';
.LayersTree {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0,0,0,.125);
    border-radius: .25rem;

    padding: 0;
    overflow: hidden;
}

.LayersTree .list-group {
    margin-bottom: 0;
}

.LayersTree .list-group-item {
    border-radius: 0;
    border-width: 1px 0 0 0;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    cursor: pointer;
}

.LayersTree .list-group-item:hover {
    background-color:#dee2e6;
}

.LayersTree > .list-group-item:first-child {
    border-top-width: 0;
}

.LayersTree .state-icon {
    margin-right: 8px;
    width: 12px;
    text-align: center;
}
.LayersTree .item-icon {
    margin-right: 5px;
}
`;

// Embed the sytlesheet in the DOM.
try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(our_CSS);
    document.adoptedStyleSheets.push(sheet);
} catch (e) {
    // According to caniuse, this should have worked on any browser that
    // Leaflet v2 targets (evergreen).  The rest, well... 
    console.warn("You should replace your broken browser", e.message);
}

})();
