import { IUserRepository } from "../interfaces/repositories/IUserRepository.js";
import { User } from "../models/entities/User.js";
import { DatabaseException } from "../models/exceptions/dataBase/DataBaseException.js";
import { pool } from "../configuration/configDataBase.js";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | undefined> {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      
      return result.rows[0];
    } catch (error) {
      throw new DatabaseException('find', 'User');
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      return result.rows[0];
    } catch (error) {
      throw new DatabaseException('find', 'User');
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0];
    } catch (error) {
      throw new DatabaseException('find', 'User');
    }
  }

  async create(user: User): Promise<User> {
    try {
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [user.username, user.email, user.password]
      );
      
      return result.rows[0];
    } catch (error) {
      throw new DatabaseException('create', 'User');
    }
  }

   async update(id: string, userData: Partial<User>): Promise<User> {
    try {
      const setClause: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (userData.username) {
        setClause.push(`username = $${paramCount}`);
        values.push(userData.username);
        paramCount++;
      }
      if (userData.email) {
        setClause.push(`email = $${paramCount}`);
        values.push(userData.email);
        paramCount++;
      }
      if (userData.password) {
        setClause.push(`password = $${paramCount}`);
        values.push(userData.password);
        paramCount++;
      }

      values.push(id);

      const query = `
        UPDATE users 
        SET ${setClause.join(', ')} 
        WHERE id = $${paramCount} 
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new DatabaseException('update', 'User');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1',
        [id]
      );
      
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      throw new DatabaseException('delete', 'User');
    }
  }
}