import App from '../mini-framework';

import Model from './Model.js';
import Mutations from './Mutations.js';
import Components from './Components.js';

App(Model, Mutations, Components, "Table", document.querySelector("#App"));