"use client"

import type { Schema } from '@amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
// import { Amplify } from 'aws-amplify';
// import outputs from '../../amplify_outputs.json';
//
// Amplify.configure(outputs);

export const client = generateClient<Schema>()
