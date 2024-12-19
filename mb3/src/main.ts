import "./style.css";
import { CRDTManager } from "./core/crdt";
import { IndexedDBStorage } from "./core/IndexedDBStorage";
import { IndexedDBYDocStorage } from "./core/IndexedDBYDocStorage";
import { DataStore } from "./core/datastore";
import { App } from "./ui/App";


;

const app = new App(
  new DataStore(new CRDTManager(), new IndexedDBStorage(), new IndexedDBYDocStorage())
);

app.start();

