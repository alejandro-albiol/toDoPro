import { DbErrorCode } from '../../../exceptions/database/enum/db-error-code.enum.js';

/**
 * Represents a generic database error.
 */
export interface IGenericDatabaseError {
  /**
   * The error code associated with the database error.
   */
  code: DbErrorCode;

  /**
   * A human-readable message describing the error.
   */
  message: string;

  /**
   * Optional metadata providing additional details about the error.
   */
  metadata?: {
    /**
     * Detailed information about the error.
     */
    detail?: string;

    /**
     * The database constraint that was violated, if applicable.
     */
    constraint?: string;

    /**
     * The column associated with the error, if applicable.
     */
    column?: string;

    /**
     * The table associated with the error, if applicable.
     */
    table?: string;

    /**
     * Any additional metadata related to the error.
     */
    [key: string]: any;
  };
}
