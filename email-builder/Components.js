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
        <table class="Rows" border="0" cellpadding="0" cellspacing="0" width="100%" @dragover=${e=>e.preventDefault()} @drop=${Send("DragDrop", inNode)}>
            ${Draw("Editor", inNode)}
            ${Draw("Row", null, inNode.Members)}
        </table>
    `,

    Row:(inNode, Send, Draw) => html`
        <tr>
            <td class="Row" align="center" @dragover=${e=>e.preventDefault()} @drop=${Send("DragDrop", inNode)} style="background-color:${inNode.Display.ColorOuter};">
                ${Draw("Editor", inNode)}
                <table class="Columns" border="0" cellpadding="0" cellspacing="0" width="${(inNode.Display.Width/100) * inNode.Parent.Display.Width}" style="background-color:${inNode.Display.ColorInner};">
                    <tr>
                        ${Draw("Column", null, inNode.Members)}
                    </tr>
                </table>
            </td>
        </tr>
    `,

    Column:(inNode, Send, Draw) => html`
        <th class="Column" align="center" valign="top" width="${inNode.Display.Width}%" style="background-color:${inNode.Display.ColorOuter};" @dragover=${e=>e.preventDefault()} @drop=${Send("DragDrop", inNode)}>
            ${Draw("Editor", inNode)}
            <table class="Content" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:${inNode.Display.ColorInner};">
                ${Draw("Cell", null, inNode.Members)}
            </table>
        </th>
    `,

    Cell:(inNode, Send, Draw) =>
    {
        var contents;
        var width;
        var column, row, table;
        switch(inNode.Content.Mode)
        {
            case "CTA" :
                contents = html`
                <td>
                    ${Draw("Editor", inNode)}
                    <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="CTA" align="center" width="200">
                                <a target="_blank" href=${inNode.Content.URLAction}>${unsafeHTML(inNode.Content.Message)}</a>
                            </td>
                        </tr>
                    </table>
                </td>`;
                break;
            case "Image" :
                column = inNode.Parent;
                row = column.Parent;
                table = row.Parent;
                width = table.Display.Width * row.Display.Width / 100 * column.Display.Width / 100;
                contents = html`
                <td>
                    ${Draw("Editor", inNode)}
                    <a href=${inNode.Content.URLAction}><img />
                        <img class="Fill" src=${inNode.Content.URLImage} alt=${inNode.Content.Message} width="${width}" style="width:${width}px; max-width:${width}px;" />
                    </a>
                </td>`;
                break;
            case "Copy" :
                contents = html`
                <td>
                    ${Draw("Editor", inNode)}
                    ${unsafeHTML(inNode.Content.Message)}
                </td>`;
                break;
            default :
                contents = "nothing";
        }

        return html`
        <tr class="Cell" @dragover=${e=>e.preventDefault()} @drop=${Send("DragDrop", inNode)}>
            ${contents}
        </tr>`;
    },


    Editor:(inNode, Send, Draw) =>
    {
        if(!inNode.Mode.Edit)
        {
            return "";
        }

        var cssClass;
        cssClass = inNode.Mode.Selected ? "Active" : "";

        return html`
        <div class=${"Editors "+cssClass}>
            <div class="Tray">
                <span>${inNode.Type}:</span>
                <button title="Select" @click=${Send("ModeSelect", inNode)} class=${cssClass}>⚙</button>
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
            <div class="Field Width">
                <div class="Label">
                    Padding:
                </div>
                <div class="Input">
                    <input type="number" .value=${inNode.Display.Padding} @change=${Send("DisplayPadding", inNode.Display)}/>
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