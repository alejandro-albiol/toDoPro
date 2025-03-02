/**
 * Interface representing a database connection pool.
 */
export interface IDatabasePool {
  /**
   * Executes a query against the database.
   *
   * @param text - The SQL query text to be executed.
   * @param params - Optional array of parameters to be used in the query.
   * @returns A promise that resolves to an object containing the result rows and the row count.
   */
  query(
    text: string,
    params?: any[],
  ): Promise<{
    rows: any[];
    rowCount: number;
  }>;
}
