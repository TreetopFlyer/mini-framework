import {html} from 'lit-html';

const MapDepth = ["Table", "Row", "Column", "Cell"];

export default {

    Main:(inModel, Send, Draw) =>
    {
        return Draw("Table", inModel.Table)
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
        class=${MapDepth[Node.Depth]}
        draggable="true"
        @dragstart=${Send("DragStart", Node)}
        @dragend=${Send("DragStop", Node)}
        @drop=${Send("DragDrop", Node)}}
        @dragover=${e=>e.preventDefault()}>
            ${Contents}
        </div>`;
    },

    EditorNode:(inNode, Send, Draw) =>
    {
        return html`
        <span class="Edit">
            <button @click=${Send("Clone", inNode)}>duplicate</button>
            <button @click=${Send("Delete", inNode)}>delete</button>
        </span>`;
    },

    EditorMembers:(inNode, Send, Draw) =>
    {
        return html`
        <span class="Grow">
            <button @click=${Send("Create", inNode)}>+${MapDepth[inNode.Depth+1]}</button>
        </span>`;
    }
};