export const createDataVisualization = ({ name, label, component, fields = [] }) => ({
  name,
  label,
  fields: [{
    name: 'title',
    label: 'Title',
    type: 'string',
    required: true,
    isTitle: true
  }, {
    name: 'data',
    label: 'Data',
    type: 'string',
    ui: {
      component
    }
  }, ...fields]
});

export const logEditHistory = async (arg: any, collection: string) => {
  const user = arg.cms?.api?.tina?.authProvider?.clerk?.user;

  const docId =
    (arg.values?._sys?.filename as string | undefined) ??
    (arg.form.id as string);
  const crudType = (arg.form).crudType ?? "update";

  // add to History collection
  try {
    await fetch("/api/tina/edit-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        docId,
        collection,
        crudType,
        userEmail: user.primaryEmailAddress?.emailAddress,
        userID: user.id,
        userName: user.firstName + ' ' + user.lastName,
        timestamp: new Date().toISOString()
      }),
    });
  } catch (e) {
    throw e;
  }

  // Log edit history
  arg.values.history ||= [];
  arg.values.history = [
    { 
      user_id: user.id, 
      user_email: user.primaryEmailAddress?.emailAddress, 
      timestamp: new Date().toISOString()
    },
    ...arg.values.history
  ];
  return arg.values;
}