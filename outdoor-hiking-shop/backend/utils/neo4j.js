async function runQuery(query, params = {}) {
    const session = driver.session();
    try {
      const result = await session.run(query, params);
      console.log(result.records);  // Log results for testing
      return result.records;
    } catch (error) {
      console.error('Query failed', error);
    } finally {
      await session.close();
    }
  }