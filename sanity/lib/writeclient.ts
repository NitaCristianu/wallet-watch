import "server-only";

import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, token } from '../env'

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // turn to false if you want faster data fetching 60sec delay
  token,
})

if (!writeClient.config().token){
    throw new Error("Write token not found!");
}