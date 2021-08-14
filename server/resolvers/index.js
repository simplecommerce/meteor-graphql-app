import { Mongo } from 'meteor/mongo';
import { find } from "lodash";

const projects = [];

export const resolvers = {
    Query: {
        getProject: (obj, args, context) => {
            return find(projects,{ _id: args._id });
        },
        getProjects: (obj, args, context) => {
            return projects;
        }
    },
    Mutation: {
        addProject: (obj, args, context) => {
            projects.push({
                _id: new Mongo.ObjectID(),
                name: args.input
            });

            return true;
        }
    }
}