import {html} from 'lit-html';
import App from './App.js';

App._Model = {
    Count:0,
    People:[]
};
App._Mutations = {
    DELTA:(inAmount, inModel) =>
        inModel.Count += inAmount,
    CREATE:(inName, inModel) =>
        inModel.People.push({Name:inName, ID:Math.random()}),
    DELETE:(inID, inModel) =>
        inModel.People = inModel.People.filter((inPerson)=>inPerson.ID != inID)
};
App._Views = {
    Main:(model, send, draw) => html`
        <div>
            ${draw("Counter", model.Count)}
            ${draw("People", model.People)}
        </div>`,
    Counter:(count, send, draw) => html`
        <em>Count:</em>
        <strong>${count}</strong>
        <button @click=${send("DELTA", +1)}>+</button>
        <button @click=${send("DELTA", -1)}>-</button>`,
    Person:(person, send, draw) => html`
        <li>
            <span>${person.Name}</span>
            <button @click=${send("DELETE", person.ID)}>x</button>
        </li>`,
    People:(people, send, draw) => html`
        <ul>
            ${draw("Person", null, people)}
        </ul>
        <button @click=${send("CREATE", "Seth"+Math.random())}>new</button>`
};
App.Start(document.querySelector("#App"), "Main");