import React, { useState } from 'react';
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { map, get } from "lodash";

export const Hello = () => {
  const [counter, setCounter] = useState(0);
  const [addProject,{ client }] = useMutation(gql`
mutation AddProject($input: String!) {
  addProject(input: $input)
}  
  `);  

  const increment = () => {
    setCounter(counter + 1);

    addProject({ variables: {
      input: `Project #${counter + 1}`
    } }).then(() => {
      // evict cache after adding a new project, we should see listing below update
      // if you comment this, the listing will not update below 
      // client.cache.evict({ fieldName: "getProjects" });
      // client.cache.gc();
    });
  };

  return (
    <div>
      <button onClick={increment}>Click Me</button>
      <p>You've pressed the button {counter} times.</p>
    </div>
  );
};
