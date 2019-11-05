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
        <p>Table!</p>
        ${Draw("Row", null, inTable.Members)}
        ${Draw("EditorMembers", inTable)}
    `}),

    Row:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        <p>Row!</p>
        ${Draw("EditorNode", inNode)}
        <div class="Center">
            ${Draw("Column", null, inNode.Members)}
            ${Draw("EditorMembers", inNode)}
        </div>
    `}),

    Column:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        <p>Column!</p>
        ${Draw("EditorNode", inNode)}
        ${Draw("Cell", null, inNode.Members)}
        ${Draw("EditorMembers", inNode)}
    `}),

    Cell:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        <p>Cell!</p>
        ${Draw("EditorNode", inNode)}
    `}),

    Draggable:({Node, Contents}, Send, Draw) =>
    {
        return html`
        <div
        ?data-target=${Node.ModeTarget}
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
        if(inNode.ModeEdit)
        {
            return html`
            <span class="Editor Individual">
                <button @click=${Send("Clone", inNode)}>duplicate</button>
                <button @click=${Send("Delete", inNode)}>delete</button>
            </span>`;
        }
    },

    EditorMembers:(inNode, Send, Draw) =>
    {
        if(inNode.ModeEdit)
        {
            return html`
            <span class="Editor Members">
                <button @click=${Send("Create", inNode)}>+${MapDepth[inNode.Depth+1]}</button>
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