import { wrapFieldsWithMeta } from "tinacms";
import { useEffect, useState } from "react";

const EditHistoryTable = wrapFieldsWithMeta((props: any) => {
  const [history, setHistory] = useState<any[] | undefined>([]);
  
  useEffect(() => {
    const fetchHistoryEntries = async () => {
      try {
        let hasNextPage = true;
        let after: string | null = null;
        let i = 0;
        let allNodes: any[] = [];

        while (hasNextPage) {
          const res = await fetch("/api/tina/gql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              query: `
                query GetEditHistory($first: Float, $after: String) {
                  editHistoryConnection(first: $first, after: $after) {
                    edges {
                      node {
                        _sys { filename }
                        docId
                        collection
                        crudType
                        timestamp
                        userEmail
                        userName
                        note
                      }
                    }
                    pageInfo {
                      hasNextPage
                      endCursor
                    }
                  }
                }
              `,
              variables: {
                first: 50,
                after
              },
            }),
          });
              
          const data: any = await res.json();
          if (data.errors) {
            console.error(data.errors);
            throw new Error("Error fetching history");
          }

          const nodes = data.data.editHistoryConnection.edges.map((e: any) => e.node);

          allNodes = [...allNodes, ...nodes];

          setHistory(allNodes);

          hasNextPage = data.data.editHistoryConnection.pageInfo.hasNextPage;
          after = data.data.editHistoryConnection.pageInfo.endCursor;
          i++;
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchHistoryEntries();
    
  }, []);

  return (
    <div>
      {
        !history && (
          <p>Loading edit history...</p>
        )
      }
      {
        history && (
          <div className='grid grid-cols-[max-content_max-content_max-content_max-content_max-content_max-content_1fr] gap-x-16 gap-y-2 mt-6'>
            <div className='font-bold'>Timestamp</div>
            <div className='font-bold'>Collection</div>
            <div className='font-bold'>Action</div>
            <div className='font-bold'>File</div>
            <div className='font-bold'>Name</div>
            <div className='font-bold'>Email</div>
            <div className='font-bold'>Note</div>
            <hr className="col-span-full border-gray-400" />
            {
              history?.map((entry) => (
                <>
                  <div>{entry.timestamp}</div>
                  <div>{entry.collection}</div>
                  <div>{entry.crudType.toUpperCase()}</div>
                  <div>{entry.docId.split('/').slice(-1)[0]}</div>
                  <div>{entry.userName}</div>
                  <div>{entry.userEmail}</div>
                  <div>{entry.note}</div>
                  <hr className="col-span-full border-gray-400" />
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