import {html} from 'lit-html';

export default {
    Table:(inModel, Send, Draw) => html`
    <div class="Table">
        Table!
        ${Draw("Row", null, inModel.Table.Members)}
        <button @click=${Send("Grow", inModel.Table)}>+Row</button>
    </div>`,

    Row:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        <p>Row!</p>
        ${Draw("Column", null, inNode.Members)}
    `}),

    Column:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        <p>Column!</p>
        ${Draw("Cell", null, inNode.Members)}
    `}),

    Cell:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        <p>Cell!</p>
    `}),

    Draggable:({Node, Contents}, Send, Draw) =>
    {
        return html`
        <div
            class=${Node.Type}
            draggable="true"
            @dragstart=${Send("DragStart", Node)}
            @dragend=${Send("DragStop", Node)}
            @drop=${Send("DragDrop", Node)}}
            @dragover=${e=>e.preventDefault()}>
            
            <div class="Center">
                <div class="Edit">
                    <button @click=${Send("Clone", Node)}>duplicate</button>
                    <button @click=${Send("Delete", Node)}>delete</button>
                </div>
                <div class="Children">
                    ${Contents}
                </div>
                <div class="Grow">
                    <button @click=${Send("Grow", Node)}>+Cell</button>
                </div>
            </div>
        </div>`;
    }
};