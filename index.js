import {App, html} from './App.js';

const Node = {
    Grow:(inParent)=>
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
        switch(obj.Depth)
        {
            case 0:
                obj.Type = "Table";
                // add table properties
                Node.Grow(obj);// add row
                break;
            case 1:
                obj.Type = "Row";
                // add row properties
                Node.Grow(obj);// add column
                break;
            case 2:
                obj.Type = "Column";
                // add column properties
                Node.Grow(obj);// add cell
                break;
            case 3:
                obj.Type = "Cell";
                // add cell properties
                break;
        }
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
    }
};

App(
{
    DragFrom:false,
    DragTo:false,
    Table:Node.Grow()
},
{
    Grow:(inNode) =>
    {
        Node.Grow(inNode);
    },
    Clone:(inNode) =>
    {
        Node.Clone(inNode)
    },
    Delete:(inNode) =>
    {
        Node.Disconnect(inNode);
    },
    DragStart:(inNode, inModel, inEvent)=>
    {
        inEvent.stopPropagation();
        inModel.DragFrom = inNode;
    },
    DragStop:(inNode, inModel)=>
    {
        inEvent.stopPropagation();
        inModel.DragFrom = false;
    },
    DragDrop:(inNode, inModel, inEvent)=>
    {
        var index;
        
        inEvent.stopPropagation();
        inModel.DragTo = inNode;
        if(inModel.DragFrom.Depth == inModel.DragTo.Depth)// drag to sibling
        {
            Node.Disconnect(inModel.DragFrom);
            index = Node.GetIndex(inModel.DragTo);
            Node.Connect(inModel.DragTo.Parent, inModel.DragFrom, index);
        }
        if(inModel.DragFrom.Depth-1 == inModel.DragTo.Depth)// drag to first parent
        {
            Node.Disconnect(inModel.DragFrom);
            Node.Connect(inModel.DragTo, inModel.DragFrom, 0);
        }
        inModel.DragTo = false;
    }
},
{
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

    Draggable:({Node, Class, Contents}, Send, Draw) =>
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
},
document.querySelector("#App"), "Table");