
import React from 'react';
import Diagram, { useSchema, createSchema } from 'beautiful-react-diagrams';

const StatusGraph = ({ nodes, links }) => {
  console.log("nodes - ")
  console.log(nodes)
  console.log("links - ")
  console.log(links)
  const initialSchema = createSchema({nodes, links});
  console.log(initialSchema)
  console.log("-----------------")
  const [schema, { onChange }] = useSchema(initialSchema);

  return (
    <div style={{ height: '30rem', marginLeft: "50px", marginRight: "50px", marginBottom: "30px", marginTop: "10px"}} >
      <Diagram schema={schema} onChange={onChange} />
    </div>
  );
};

export default StatusGraph;
