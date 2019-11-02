import {App, html} from './App.js';


const Node = {
    CreateBase:(inParent)=>
    {
        var obj;
        obj = {
            ID:Math.random()+"-"+Math.random(),
            Members:[],
            Parent:false,
            Depth:0,
            Display:{Width:100, ColorOuter:"#ddd", ColorInner:"#eee"},
            Content:{}
        };
        if(inParent)
        {
            Node.Connect(inParent, obj);
        }
        return obj;
    },
    CreateTable:(inParent)=>
    {
        var obj;
        obj = Node.CreateBase(inParent);
        Node.CreateRow(obj);
        return obj;
    },
    CreateRow:(inParent)=>
    {
        var obj;
        obj = Node.CreateBase(inParent);
        Node.CreateColumn(obj);
        return obj;
    },
    CreateColumn:(inParent)=>
    {
        var obj;
        obj = Node.CreateBase(inParent);
        Node.CreateCell(obj);
        return obj;
    },
    CreateCell:(inParent)=>
    {
        var obj;
        obj = Node.CreateBase(inParent);
        return obj;
    },
    Disconnect:(inChild)=>
    {
        var index;
        if(inChild.Parent)
        {
            index = inChild.Parent.Members.findIndex(n => n === inChild);
            if(index != -1)
            {
                inChild.Parent.Members.splice(index, 1);
                inChild.Parent = false;
            }
        }
    },
    Connect:(inParent, inChild)=>
    {
        if(inChild.Parent)
        {
            Node.Disconnect(inChild);
        }
        inParent.Members.push(inChild);
        inChild.Parent = inParent;
        inChild.Depth = inParent.Depth+1;
    },
    Clone:(inNode)=>
    {
        const clearParents = (inNode) =>
        {
            inNode.Parent = false;
            inNode.Members.forEach(clearParents);
        };
        const resetParents = (inNode) =>
        {
            inNode.Members.forEach((inChild)=>
            {
                inChild.Parent = inNode;
                resetParents(inChild);
            });
        };

        var parent, clone;
        var index;

        parent = inNode.Parent;
        clearParents(inNode);//clear circular parent references
        clone = JSON.parse(JSON.stringify(inNode));//deep clone the node
        resetParents(inNode);   // put the references back
        inNode.Parent = parent; //

        resetParents(clone);   // restore the references within the clone
        clone.Parent = parent; //

        index = inNode.Parent.Members.findIndex(n => n === inNode);
        inNode.Parent.Members.splice(index, 0, clone);//put the clone back next to the original node

        return clone;
    },
    Swap:(inNode1, inNode2)=>
    {
        var i1, i2;

        if(inNode1.Depth != inNode2.Depth)
        {
            console.error("mismatched depths");
            return;
        }

        i1 = inNode1.Parent.Members.findIndex(n => n === inNode1);
        i2 = inNode2.Parent.Members.findIndex(n => n === inNode2);

        inNode1.Parent.Members[i1] = inNode2;
        inNode2.Parent.Members[i2] = inNode1;
    },
    Move:(inNode1, inNode2)=>
    {
        Node.Disconnect(inNode1);
        
    }
};

App(
{
    Table:Node.CreateTable()
},
{
    CreateRow:(inTable) =>
    {
        Node.CreateRow(inTable);
    },
    CreateColumn:(inRow) =>
    {
        Node.CreateColumn(inRow);
    },
    CreateCell:(inColumn) =>
    {
        Node.CreateCell(inColumn);
    },
    Clone:(inNode) =>
    {
        Node.Clone(inNode)
    },
    Delete:(inNode) =>
    {
        Node.Disconnect(inNode);
    }
},
{
    Table:(inModel, Send, Draw) => html`
    <div class="Table">
        Table!
        ${Draw("Row", null, inModel.Table.Members)}
        <button @click=${Send("CreateRow", inModel.Table)}>+Row</button>
    </div>`,

    Row:(inRow, Send, Draw) => html`
    <div class="Row">
        Row!
        <button @click=${Send("Clone", inRow)}>duplicate</button>
        <button @click=${Send("Delete", inRow)}>delete</button>
        <div class="Columns">
            ${Draw("Column", null, inRow.Members)}
            <button @click=${Send("CreateColumn", inRow)}>+Column</button>
        </div>
    </div>`,

    Column:(inColumn, Send, Draw)=>html`
    <div class="Column">
        Column!
        <button @click=${Send("Clone", inColumn)}>duplicate</button>
        <button @click=${Send("Delete", inColumn)}>delete</button>
        ${Draw("Cell", null, inColumn.Members)}
        <button @click=${Send("CreateCell", inColumn)}>+Cell</button>
    </div>`,

    Cell:(inCell, Send, Draw)=>html`
    <div class="Cell">
        Cell!
    </div>`
},
document.querySelector("#App"), "Table");