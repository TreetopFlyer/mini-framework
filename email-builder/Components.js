import {html} from 'lit-html';
const MapDepth = ["Table", "Row", "Column", "Cell"];
export default {

    Main:(inModel, Send, Draw) =>
    {
        return html`
        <div class="App">
            <div>
                ${inModel.Selection.map( s=>html`<span>Item! </span>`)}
            </div>
            ${Draw("EditorColor", inModel.Color)}
            <div class="Layout">
                ${Draw("Table", inModel.Table)}
            </div>
        </div>`;
    },

    Table:(inTable, Send, Draw) => Draw("Draggable", {Node:inTable, Contents:html`
        ${Draw("Row", null, inTable.Members)}
        <div class="Editors"><span>Table:</span>${Draw("EditorMembers", inTable)}</div>
    `}),

    Row:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        <div class="Center">
            ${Draw("Column", null, inNode.Members)}
        </div>
        <div class="Editors"><span>Row:</span>${Draw("EditorNode", inNode)}${Draw("EditorMembers", inNode)}</div>
    `}),

    Column:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        ${Draw("Cell", null, inNode.Members)}
        <div class="Editors"><span>Column:</span>${Draw("EditorNode", inNode)}${Draw("EditorMembers", inNode)}</div>
    `}),

    Cell:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        <div>[cell]</div>
        <div class="Editors"><span>Cell:</span>${Draw("EditorNode", inNode)}</div>
    `}),

    Draggable:({Node, Contents}, Send, Draw) =>
    {
        return html`
        <div
        ?data-mode-edit=${Node.ModeEdit}
        ?data-mode-selected=${Node.ModeSelected}
        class=${MapDepth[Node.Depth]}
        draggable="true"
        
        @dragstart=${Send("DragStart", Node)}
        @dragend=${Send("DragStop", Node)}
        @drop=${Send("DragDrop", Node)}}
        @dragover=${e=>e.preventDefault()}
        
        @click=${Send("Select", Node)}>
            ${Contents}
        </div>`;
    },

    EditorNode:(inNode, Send, Draw) =>
    {
        if(inNode.ModeEdit != 12515325)
        {
            return html`
            <span class="Editor Individual">
                <button @click=${Send("Delete", inNode)} title="Delete">☒</button>
                <button @click=${Send("Clone", inNode)} title="Duplicate">⧉</button>
            </span>`;
        }
    },

    EditorMembers:(inNode, Send, Draw) =>
    {
        if(inNode.ModeEdit != 258723985)
        {
            return html`
            <span class="Editor Members">
                <button @click=${Send("Create", inNode)} title="Grow">⊞</button>
            </span>`;
        }
    },

    EditorColor:(inColor, Send, Draw) =>
    {
        return html`
        <div class="ColorPicker">
            <input type="color" .value=${inColor} @change=${Send("Color", null)} />
            <input type="text" .value=${inColor} @change=${Send("Color", null)} />
        </div>
        `;
    }
};