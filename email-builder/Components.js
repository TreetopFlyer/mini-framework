import {html} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
const MapDepth = ["Table", "Row", "Column", "Cell"];

export default {

    Main:(inModel, Send, Draw) =>
    {
        return html`
        <div class="App">
            <div>
                ${Draw("ParametersTable", null, inModel.Selection)}
            </div>
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
        <div style="background:${inNode.Display.ColorOuter};">
            <div class="Center" style="background:${inNode.Display.ColorInner}; width:${inNode.Parent.Display.Width * (inNode.Display.Width/100)}px;">
                ${Draw("Column", null, inNode.Members)}
            </div>
            <div class="Editors"><span>Row:</span>${Draw("EditorNode", inNode)}${Draw("EditorMembers", inNode)}</div>
        </div>
    `}),

    Column:(inNode, Send, Draw) =>
    {
        return html`
        <div style="width:${inNode.Display.Width}%; display:inline-block; box-sizing: border-box;">
            ${Draw("Draggable", {Node:inNode, Contents:html`
                ${Draw("Cell", null, inNode.Members)}
                <div class="Editors">
                    <span>Column:</span>${Draw("EditorNode", inNode)}${Draw("EditorMembers", inNode)}
                </div>
            `})}
        </div>
        `;
    },

    Cell:(inNode, Send, Draw) => Draw("Draggable", {Node:inNode, Contents:html`
        ${Draw("Contents", inNode)}
        <div class="Editors"><span>Cell:</span>${Draw("EditorNode", inNode)}</div>
    `}),

    Contents:(inNode, Send, Draw)=>
    {
        switch(inNode.Content.Mode)
        {
            case "CTA" :
                return html`<a href=${inNode.Content.URLAction}>${unsafeHTML(inNode.Content.Message)}</a>`;
            case "Image" :
                return html`<a href=${inNode.Content.URLAction}><img src=${inNode.Content.URLImage} alt=${inNode.Content.Message}/></a>`;
            case "Copy" :
                return html`<div>${unsafeHTML(inNode.Content.Message)}</div>`;
        }
    },

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

    FieldColor:(inColor, Send, Draw) =>
    {
        return html`

        `;
    },

    ParametersTable:(inNode, Send, Draw)=>
    {
        return html`
        <div class="Form">
            <div class="Field Width">
                <div class="Label">
                    Width:
                </div>
                <div class="Input">
                    <input type="number" .value=${inNode.Display.Width} @change=${Send("DisplayWidth", inNode.Display)}/>
                </div>
            </div>
            <div class="Field Color Outer">
                <div class="Label">
                    Outer Color:
                </div>
                <div class="Input">
                    <input type="color" .value=${inNode.Display.ColorOuter} @change=${Send("DisplayColorOuter", inNode.Display)} />
                    <input type="text"  .value=${inNode.Display.ColorOuter} @change=${Send("DisplayColorOuter", inNode.Display)} />
                </div>
            </div>
            <div class="Field Color Outer">
                <div class="Label">
                    Inner Color:
                </div>
                <div class="Input">
                    <input type="color" .value=${inNode.Display.ColorInner} @change=${Send("DisplayColorInner", inNode.Display)} />
                    <input type="text"  .value=${inNode.Display.ColorInner} @change=${Send("DisplayColorInner", inNode.Display)} />
                </div>
            </div>
            <hr/>
            <div class="Field Content Mode">
                <div class="Label">
                    Mode:
                </div>
                <div class="Input">
                    <select .value=${inNode.Content.Mode} @change=${Send("ContentMode", inNode.Content)}>
                        <option>Copy</option>
                        <option>CTA</option>
                        <option>Image</option>
                    </select>
                </div>
            </div>
            <div class="Field Content Message">
                <div class="Label">
                    Message:
                </div>
                <div class="Input">
                    <input type="text" .value=${inNode.Content.Message} @change=${Send("ContentMessage", inNode.Content)}/>
                </div>
            </div>
            <div class="Field Content URLAction">
                <div class="Label">
                    Action URL:
                </div>
                <div class="Input">
                    <input type="text" .value=${inNode.Content.URLAction} @change=${Send("ContentURLAction", inNode.Content)}/>
                </div>
            </div>
            <div class="Field Content URLImage">
                <div class="Label">
                    Image URL:
                </div>
                <div class="Input">
                    <input type="text" .value=${inNode.Content.URLImage} @change=${Send("ContentURLImage", inNode.Content)}/>
                </div>
            </div>
        </div>
        `;
    }
};