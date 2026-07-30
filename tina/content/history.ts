import { Collection } from "tinacms";

const History: Collection = {
  name: "editHistory",
  label: "Edit History",
  path: "content/edit-history",
  format: "json",
  fields: [
    { 
      name: "docId", 
      label: "Document ID", 
      type: "string" 
    },
    { 
      name: "collection", 
      label: "Collection", 
      type: "string" 
    },
    { 
      name: "crudType", 
      label: "Action", 
      type: "string" 
    },
    { 
      name: "timestamp", 
      label: "Timestamp", 
      type: "datetime" 
    },
    { 
      name: "userEmail", 
      label: "User Email", 
      type: "string" 
    },
    {
      name: "userName",
      label: "User Name",
      type: "string"
    },
    {
      name: "userID",
      label: "User ID",
      type: "string"
    },
    {
      name: "note",
      label: "Note",
      type: "string"
    }
  ],
  ui: {
    allowedActions: {
      create: false,
      delete: false,
      createNestedFolder: false,
    }
  }
};

export default History;