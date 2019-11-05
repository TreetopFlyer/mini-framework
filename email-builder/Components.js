import {html} from 'lit-html';

const MapDepth = ["Table", "Row", "Column", "Cell"];

export default {

    Main:(inModel, Send, Draw) =>
    {
        return html`
        <div class="App">
            ${Draw("EditorColor", inModel.Color)}
            <div class="Layout">
                ${Draw("Table", inModel.Table)}
            </div>
        </div>`;
    },

    Table:(inTable, Send, Draw) => Draw("Draggable", {Node:inTable, Contents:html`
       <div class="Editors"><span>Table:</span>${Draw("EditorMembers", inTable)}</div>
        ${Draw("Row", null, inTable.Members)}
    `}),

    Row:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        <div class="Editors"><span>Row:</span>${Draw("EditorNode", inNode)}${Draw("EditorMembers", inNode)}</div>
        <div class="Center">
            ${Draw("Column", null, inNode.Members)}
        </div>
    `}),

    Column:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        <div class="Editors"><span>Column:</span>${Draw("EditorNode", inNode)}${Draw("EditorMembers", inNode)}</div>
        ${Draw("Cell", null, inNode.Members)}
    `}),

    Cell:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        <div class="Editors"><span>Cell:</span>${Draw("EditorNode", inNode)}</div>
    `}),

    Draggable:({Node, Contents}, Send, Draw) =>
    {
        return html`
        <div
        ?data-mode-edit=${Node.ModeEdit}
        class=${MapDepth[Node.Depth]}
        draggable="true"
        
        @dragstart=${Send("DragStart", Node)}
        @dragend=${Send("DragStop", Node)}
        @drop=${Send("DragDrop", Node)}}
        @dragover=${e=>e.preventDefault()}
        
        @mouseenter=${Send("ModeEditOn", Node)}
        @mouseleave=${Send("ModeEditOff", Node)}>
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
                <button @click=${Send("Create", inNode)} title="Subdivide">◫</button>
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