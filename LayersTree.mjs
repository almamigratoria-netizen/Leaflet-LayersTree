//
//  LayersTree.mjs
//
//  Leaflet v2 Layers control with tree view
//  No dependencies.
//

import { Control, DomEvent, Layer, Util } from 'leaflet';

const LayersTree_defaults = {
    collapsed: false,
    treeCollapsed: true,
    // ROADMAP:(nested groups) GroupSeparator: '|',
    // ROADMAP:sanitizer: null,   // function to sanitize strings (must return 
                                  // trustedHTML).
};

export class LayersTree extends Control.Layers {
    constructor(baselayers=[], overlays=[], options={}) {
        super();
        Util.setOptions(this, LayersTree_defaults);
        this.initialize(baselayers, overlays, options);
    }

    _toggleExpand(e) {
        // Sort out event progagation
        const target = event.target;
        if (!target) { return false; }
        let realTarget = target;
        if (target.parentElement.className == 'groupLabel') {
            realTarget = target.parentElement;
        }
        e.stopPropagation();  // Stop event ripple
        const mama = realTarget.parentElement;
        let block = mama.querySelector('.LayersTreeExpandable');
        let icon = mama.querySelector('.iconSpan');
        if (block) {
            block.classList.toggle('expanded');
            block.classList.toggle('collapsed');
        }
        if (icon) {
            icon.classList.toggle('expanded');
            icon.classList.toggle('collapsed');
        }
    }

    _createGroupContainer(obj, groupName) {
        // Do we want to use DOMUtils for this?
        // It'd be more leaflet-ish
        const group_container = document.createElement('div');
        group_container.className = 'LayersTree';
        const glabel = document.createElement('span');
        glabel.dataset.groupname = groupName;
        glabel.className = 'groupLabel';
        DomEvent.on(glabel, 'click', this._toggleExpand, this);
        const iconspan = document.createElement('button');
        iconspan.className = 'iconSpan';
        glabel.appendChild(iconspan);
        const textspan = document.createElement('span');
        textspan.className = 'textspan';
        textspan.textContent = groupName;
        glabel.appendChild(textspan);
        group_container.appendChild(glabel);
        let container = this._overlaysList;
        if (!obj.overlay) {
            container = this._baseLayersList;
        }
        container.appendChild(group_container);
        const labelsdiv = document.createElement('div');
        labelsdiv.className = 'LayersTreeExpandable';
        if (this.options.treeCollapsed == false) {
            labelsdiv.classList.add('expanded');
            iconspan.classList.add('expanded');
        } else {
            labelsdiv.classList.add('collapsed');
            iconspan.classList.add('collapsed');
        }
        group_container.appendChild(labelsdiv);
        this.groups[groupName] = labelsdiv;
        return group_container;
    }

    _addItem(obj) {
        const label = document.createElement('label'),
        checked = this._map.hasLayer(obj.layer);
        const input = document.createElement('input');
        input.type = obj.overlay ? 'checkbox' : 'radio';
        input.className = 'leaflet-control-layers-selector';
        input.defaultChecked = checked;
        if (!obj.overlay) {
            input.name = `leaflet-base-layers_${Util.stamp(this)}`;
        }

        this._layerControlInputs.push(input);
        input.layerId = Util.stamp(obj.layer);

        DomEvent.on(input, 'click', this._onInputClick, this);

        const name = document.createElement('span');
        const group = obj.layer._LTgroup || undefined;
        name.innerHTML = `${obj.name}`;

        // Helps from preventing layer control flicker when checkboxes 
        // are disabled  (https://github.com/Leaflet/Leaflet/issues/2771)
        const holder = document.createElement('span');

        label.appendChild(holder);
        if (group) {
            label.className = 'groupLabel';
        }
        holder.appendChild(input);
        holder.appendChild(name);

        if (!this.groups) {
            this.groups = {};
        }
        let group_container = this.groups[group] || null;
        // ROADMAP:  Nested groups
        if (group && !group_container) {
            group_container = this._createGroupContainer(obj, group);
        }

        let container;
        if (obj.overlay) {
            container = this._overlaysList;
        } else {
            container = this._baseLayersList;
        }
        if (group_container) {
            container = this.groups[group];
            label.classList.add('LayersTreeIndent');
        }
        container.appendChild(label);

        this._checkDisabledLayers();
        return label;
    }

    _update() {
        this.groups = [];
        super._update();
    }

    onAdd(map) {
        super.onAdd(map);
        const el = this._container;
        return this._container;
    }
    // removeGroup(groupName) // This should also remove the layers.
    // const specificElement = document.querySelector('[data-user-id="123"]'); 
}
export { LayersTree as default };

(function() {
    const our_CSS = `
/*
 LayersTree.css
   Injected to adoptedStyleSheets at LayersTree.mjs module load
*/
.LayersTree {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: transparent;
    background-clip: border-box;
    border: 1px solid rgba(1,1,1,.125);
    border-radius: .25rem;
    padding: 0;
    overflow: hidden;
    min-height: 0;
}
.LayersTree .groupLabel {
    position: relative;
}
.LayersTree .textspan {
    position: relative;
    left: 10px;
}
.LayersTree .iconSpan {
    width: 16px;
    height: 16px;
    display: inline-block;
    background-repeat: no-repeat;
    border: none;
    background-color: transparent;
    margin: auto;
    position: relative;
}
.LayersTree .iconSpan.collapsed {
    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path stroke="black" d="M13.5 5.3 7.2.6A3.3 3.3 90 002 3.3V12.5A3.3 3.3 90 007.2 15.2L13.5 10.6A3.3 3.3 90 0013.5 5.3Z" fill="white"/></svg>');
    transform: rotate(0deg);
    transition: transform 0.3s;
}
.LayersTree .iconSpan.expanded {
    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path stroke="black" d="M13.5 5.3 7.2.6A3.3 3.3 90 002 3.3V12.5A3.3 3.3 90 007.2 15.2L13.5 10.6A3.3 3.3 90 0013.5 5.3Z" fill="white"/></svg>');
    transform: rotate(90deg);
    transition: transform 0.3s;
}
.LayersTreeIndent {
    left: 10px;
}
.LayersTreeExpandable {
  overflow: hidden;
}
.LayersTreeExpandable.collapsed {
  height: 0px;
  display: none;
  transition: all 0.6s;
}
.LayersTreeExpandable.expanded {
  height: auto;
  display: inline-block;
  transition: all 0.6s;
}
/* this is for the glabel */
.groupLabel {
  cursor: pointer;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 1em;
}
.groupLabel:hover {
  background-color: #ccc;
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

