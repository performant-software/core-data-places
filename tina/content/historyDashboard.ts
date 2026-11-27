import { Collection } from "tinacms";
import EditHistoryTable from "../components/EditHistoryTable";

const HistoryDashboard: Collection = {
  name: "editHistoryDashboard",
  label: "Edit History Dashboard",
  path: "content/edit-history-dashboard",
  format: "json",
  fields: [
    { 
      name: "placeholder", 
      label: "Edit History", 
      type: "string",
      ui: {
        component: EditHistoryTable
      }
    }
  ],
  ui: {
    global: true,
    allowedActions: {
      create: false,
      delete: false
    }
  }
};

export default HistoryDashboard;