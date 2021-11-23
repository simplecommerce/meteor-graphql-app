import React, { useState } from 'react';
import { gql, useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { map, get } from "lodash";

export const Info = () => {
//   const { data, error, called, networkStatus } = useQuery(gql`
//  query GetProjects {
//    getProjects 
//  }
//   `);
  const [fetch,{ data, error, called, networkStatus }] = useLazyQuery(gql`
 query GetProjects {
   getProjects 
 }
  `);    

  console.log(data, called, error, networkStatus)

  return (
    <div>
      {map(get(data,"getProjects",[]),(project,key) => (
        <div key={key}>{project._id._str} - {project.name}</div>
      ))}      
    </div>
  );
};
