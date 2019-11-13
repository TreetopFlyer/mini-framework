import {html} from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';

export default {

    Main:(inModel, Send, Draw) =>
    {
        return html`
        <div class="App">
            <div>
                <button @click=${Send("ModeEdit", inModel.Table)}>Edit Mode</button>
            </div>
            <div class="Layout">
                ${Draw("Table", inModel.Table)}
            </div>
        </div>`;
    },

    Table:(inNode, Send, Draw) => html`
        <div class="Table" @dragover=${e=>e.preventDefault()} @drop=${Send("DragDrop", inNode)}>
            ${Draw("Editor", inNode)}
            ${Draw("Row", null, inNode.Members)}
        </div>
    `,

    Row:(inNode, Send, Draw) => html`
        <div class="Row" @dragover=${e=>e.preventDefault()} @drop=${Send("DragDrop", inNode)} style="background:${inNode.Display.ColorOuter};">
            ${Draw("Editor", inNode)}
            <div class="Center" style="background:${inNode.Display.ColorInner}; width:${inNode.Parent.Display.Width * (inNode.Display.Width/100)}px;">
                ${Draw("Column", null, inNode.Members)}
            </div>
        </div>
    `,

    Column:(inNode, Send, Draw) => html`
        <div class="Column" @dragover=${e=>e.preventDefault()} @drop=${Send("DragDrop", inNode)} style="width:${inNode.Display.Width}%; display:inline-block; box-sizing: border-box;">
            ${Draw("Editor", inNode)}
            ${Draw("Cell", null, inNode.Members)}
        </div>
    `,

    Cell:(inNode, Send, Draw) => html`
        <div class="Cell" @dragover=${e=>e.preventDefault()} @drop=${Send("DragDrop", inNode)}>
            ${Draw("Editor", inNode)}
            ${Draw("Contents", inNode)}
        </div>
    `,

    Contents:(inNode, Send, Draw) =>
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

    Editor:(inNode, Send, Draw) =>
    {
        if(!inNode.Mode.Edit)
        {
            return "";
        }

        return html`
        <div class="Editors">
            <div class="Tray">
                <span>${inNode.Type}:</span>
                <button title="Select" @click=${Send("ModeSelect", inNode)}>!</button>
                ${
                    inNode.Depth != 0
                    ? html` <button title="Delete" @click=${Send("Delete", inNode)}>☒</button>
                            <button title="Duplicate" @click=${Send("Clone", inNode)}>⧉</button>
                            <button title="Drag and Drop" draggable="true" @dragstart=${Send("DragStart", inNode)} @dragend=${Send("DragStop", inNode)}>⎘</button>`
                    : ""
                }
                ${
                    inNode.Depth != 3
                    ? html`<button @click=${Send("Create", inNode)} title="Add Child">⊞</button>`
                    : ""
                }
            </div>
            ${Draw("ParametersTable", inNode)}
        </div>
        `;
    },

    ParametersTable:(inNode, Send, Draw) =>
    {
        if(!inNode.Mode.Selected)
        {
            return "";
        }

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