import { wrapFieldsWithMeta } from "tinacms";
import { useEffect, useState } from "react";

const EditHistoryTable = wrapFieldsWithMeta((props: any) => {
  const [history, setHistory] = useState<any[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchHistoryEntries = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/tina/gql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: `
              query GetEditHistory {
                editHistoryConnection(first: 100) {
                  edges {
                    node {
                      _sys { filename }
                      docId
                      collection
                      crudType
                      timestamp
                      userEmail
                      note
                    }
                  }
                }
              }
            `,
            variables: {},
          }),
        });

        const history = await res.json();

        if (history.errors) {
          console.log(history.errors);
          throw new Error("Fetching edit history failed.")
        }

        const entries = history.data.editHistoryConnection.edges.map((e: any) => (e.node));
        setHistory(entries);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistoryEntries();
    
  }, []);

  return (
    <div>
      {
        loading && (
          <p>Loading edit history...</p>
        )
      }
      {
        !loading && (
          <div className='grid grid-cols-6 divide-y divide-gray-400 mt-6'>
            <div className='font-bold'>Timestamp</div>
            <div className='font-bold'>Collection</div>
            <div className='font-bold'>Action</div>
            <div className='font-bold'>File</div>
            <div className='font-bold'>User</div>
            <div className='font-bold'>Note</div>
            {
              history?.map((entry) => (
                <>
                  <div>{entry.timestamp}</div>
                  <div>{entry.collection}</div>
                  <div>{entry.crudType.toUpperCase()}</div>
                  <div>{entry.docId.split('/').slice(-1)[0]}</div>
                  <div>{entry.userEmail}</div>
                  <div>{entry.note}</div>
                </>
              ))
            }
          </div>
        )
      }
    </div>
  )
});

export default EditHistoryTable;