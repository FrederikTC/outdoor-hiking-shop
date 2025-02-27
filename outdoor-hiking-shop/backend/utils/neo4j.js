// backend/utils/neo4j.js
const neo4j = require('neo4j-driver');

// Neo4j Connection Setup
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// Reusable Function to Run Queries
const runQuery = async (query, params = {}) => {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
        console.error('Cypher query is empty or invalid:', query);
        throw new Error('Cypher query is expected to be a non-empty string.');
    }

    const session = driver.session();  // Open session
    try {
        console.log('Running Query:', query, 'with params:', params);
        const result = await session.run(query, params);
        return result.records;
    } catch (error) {
        console.error('Query failed', error);
        throw error;
    } finally {
        await session.close();  // Always close the session
    }
};

// Create Node Function (Directly Pass Properties)
const createNode = async (label, properties) => {
    const propString = JSON.stringify(properties).replace(/"([^"]+)":/g, '$1:');
    const query = `
        CREATE (n:${label} ${propString})
        RETURN n
    `;
    console.log('Creating Node:', query);
    return await runQuery(query);
};

// Create Relationship Function with Existence Check
const createRelationship = async (fromLabel, fromMatch, toLabel, toMatch, relation) => {
    if (!fromMatch.value || !toMatch.value) {
        console.error('Skipping relationship creation due to missing value:', fromMatch, toMatch);
        return;
    }

    // Step 1: Check if both nodes exist
    const checkQuery = `
        MATCH (from:${fromLabel} {${fromMatch.key}: $fromValue})
        MATCH (to:${toLabel} {${toMatch.key}: $toValue})
        RETURN from, to
    `;

    const checkResult = await runQuery(checkQuery, {
        fromValue: fromMatch.value,
        toValue: toMatch.value
    });

    if (checkResult.length === 0) {
        console.log('One or both nodes not found:', {
            fromLabel,
            fromMatch,
            toLabel,
            toMatch
        });
        return;
    }

    // Step 2: If both nodes exist, create the relationship
    const query = `
        MATCH (from:${fromLabel} {${fromMatch.key}: $fromValue})
        MATCH (to:${toLabel} {${toMatch.key}: $toValue})
        MERGE (from)-[r:${relation}]->(to)
        RETURN r
    `;
    
    console.log('Creating Relationship:', query, 'with params:', {
        fromValue: fromMatch.value,
        toValue: toMatch.value
    });

    return await runQuery(query, {
        fromValue: fromMatch.value,
        toValue: toMatch.value
    });
};

module.exports = {
    createNode,
    createRelationship
};
