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
            ListSwap:false,
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
    GetIndex:(inNode)=>
    {
        return inNode.Parent.Members.findIndex(n => n.ID === inNode.ID);
    },
    Disconnect:(inChild)=>
    {
        var index;
        if(inChild.Parent)
        {
            index = Node.GetIndex(inChild);
            if(index != -1)
            {
                inChild.Parent.Members.splice(index, 1);
                inChild.Parent = false;
            }
        }
    },
    Connect:(inParent, inChild, inIndex)=>
    {
        if(inChild.Parent)
        {
            Node.Disconnect(inChild);
        }
        if(inIndex != undefined)
        {
            console.log("inserting at", inIndex);
            inParent.Members.splice(inIndex, 0, inChild);
        }
        else
        {
            console.log("inserting at end");
            inParent.Members.push(inChild);
        }
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
        const resetIDs = (inNode) =>
        {
            inNode.ID = Math.random();
            inNode.Members.forEach(resetIDs);
        };

        var parent, clone;
        var index;

        parent = inNode.Parent;
        clearParents(inNode);//clear circular parent references
        clone = JSON.parse(JSON.stringify(inNode));//deep clone the node
        resetParents(inNode);   // put the references back
        inNode.Parent = parent; //

        resetParents(clone);   // restore the references within the clone
        resetIDs(clone);       //
        clone.Parent = parent; //

        index = Node.GetIndex(inNode);
        inNode.Parent.Members.splice(index+1, 0, clone);//put the clone back next to the original node

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

        i1 = Node.GetIndex(inNode1);
        i2 = Node.GetIndex(inNode2);
        
        inNode1.Parent.Members[i1] = inNode2;
        inNode2.Parent.Members[i2] = inNode1;
    },
    Move:(inNode1, inNode2)=>
    {
        Node.Disconnect(inNode1);
    },
};

App(
{
    DragFrom:false,
    DragTo:false,
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
    },
    SwapStart:(inNode, inModel) =>
    {
        inModel.Swap = [inNode];
    },
    DragStart:(inNode, inModel)=>
    {
        inModel.DragFrom = inNode;
    },
    DragTo:(inNode, inModel)=>
    {
        var index;
        inModel.DragTo = inNode;
        if(inModel.DragFrom === inModel.DragTo)// drag to self
        {
            return;
        }
        if(inModel.DragFrom.Depth == inModel.DragTo.Depth)// drag to sibling
        {
            index = Node.GetIndex(inModel.DragTo);
            Node.Disconnect(inModel.DragFrom);
            Node.Connect(inModel.DragTo.Parent, inModel.DragFrom, index);
        }
        if(inModel.DragFrom.Depth-1 == inModel.DragTo.Depth)// drag to first parent
        {
            Node.Disconnect(inModel.DragFrom);
            Node.Connect(inModel.DragTo, inModel.DragFrom, 0);
        }
    },
    DragStop:(inNode, inModel)=>
    {
        inModel.DragFrom = false;
        inModel.DragTo = false;
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
    <div class="Row"  @drop=${Send("DragTo", inRow)} @dragover=${e=>e.preventDefault()} >
        Row!
        ${Draw("Manipulator", inRow)}
        <div class="Columns">
            ${Draw("Column", null, inRow.Members)}
            <button @click=${Send("CreateColumn", inRow)}>+Column</button>
        </div>
    </div>`,

    Column:(inColumn, Send, Draw)=>html`
    <div class="Column" draggable="true" @dragstart=${Send("DragStart", inColumn)} @dragend=${Send("DragStop", inColumn)} @drop=${Send("DragTo", inColumn)} @dragover=${e=>e.preventDefault()}>
        Column!
        ${Draw("Manipulator", inColumn)}
        <div class="Cells">
            ${Draw("Cell", null, inColumn.Members)}
        </div>
        <button @click=${Send("CreateCell", inColumn)}>+Cell</button>
    </div>`,

    Cell:(inCell, Send, Draw)=>html`
    <div class="Cell">
        Cell!
    </div>`,

    Manipulator:(inNode, Send, Draw)=>html`
    <div>
        <button @click=${Send("Clone", inNode)}>duplicate</button>
        <button @click=${Send("Delete", inNode)}>delete</button>
    </div>
    `
},
document.querySelector("#App"), "Table");