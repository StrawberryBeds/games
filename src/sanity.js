// src/client.js
import { createClient } from '@sanity/client';

export const client = createClient({
    projectId: "dx2ymrki",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,

});