import { db } from '../database/init';
import { VALID_STATUSES } from '../constants';

export const typeDefs = `#graphql
  type PotionOrder {
    id: ID!
    customer_name: String!
    location: String!
    potion: String!
    assigned_alchemist: String!
    status: String!
    notes: String
  }

  input PotionOrderFilter {
    status: String
    assigned_alchemist: String
  }

  input PotionOrderInput {
    customer_name: String!
    location: String!
    potion: String!
    assigned_alchemist: String!
    notes: String
  }

  type Query {
    potionOrders(filter: PotionOrderFilter): [PotionOrder!]!
    potionOrder(id: ID!): PotionOrder
  }

  type Mutation {
    addPotionOrder(input: PotionOrderInput!): PotionOrder!
    updatePotionOrderStatus(id: ID!, status: String!): PotionOrder!
    updatePotionOrderAlchemist(id: ID!, assigned_alchemist: String!): PotionOrder!
  }
`;

export const resolvers = {
  Query: {
    potionOrders: (_: any, { filter }: { filter?: { status?: string; assigned_alchemist?: string } }) => {
      return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM potion_orders';
        const conditions: string[] = [];
        const values: any[] = [];

        if (filter?.status) {
          conditions.push('status = ?');
          values.push(filter.status);
        }
        if (filter?.assigned_alchemist) {
          conditions.push('assigned_alchemist = ?');
          values.push(filter.assigned_alchemist);
        }

        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }

        db.all(query, values, (err: Error | null, rows: any[]) => {
          if (err) {
            reject(new Error('Failed to fetch potion orders'));
            return;
          }
          resolve(rows);
        });
      });
    },

    potionOrder: (_: any, { id }: { id: string }) => {
      return new Promise((resolve, reject) => {
        db.get('SELECT * FROM potion_orders WHERE id = ?', [id], (err: Error | null, row: any) => {
          if (err) {
            reject(new Error('Failed to fetch potion order'));
            return;
          }
          resolve(row || null);
        });
      });
    },
  },

  Mutation: {
    addPotionOrder: (_: any, { input }: { input: { customer_name: string; location: string; potion: string; assigned_alchemist: string; notes?: string } }) => {
      return new Promise((resolve, reject) => {
        const id = Date.now().toString();
        const status = 'To Do';

        db.run(
          `INSERT INTO potion_orders (id, customer_name, location, potion, assigned_alchemist, status, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, input.customer_name, input.location, input.potion, input.assigned_alchemist, status, input.notes || null],
          function (err: Error | null) {
            if (err) {
              reject(new Error('Failed to add potion order'));
              return;
            }
            db.get('SELECT * FROM potion_orders WHERE id = ?', [id], (err2: Error | null, row: any) => {
              if (err2) {
                reject(new Error('Failed to fetch new potion order'));
                return;
              }
              resolve(row);
            });
          }
        );
      });
    },

    updatePotionOrderStatus: (_: any, { id, status }: { id: string; status: string }) => {
      return new Promise((resolve, reject) => {
        if (!VALID_STATUSES.includes(status as any)) {
          reject(new Error(`Invalid status: ${status}. Must be one of: ${VALID_STATUSES.join(', ')}`));
          return;
        }

        db.get('SELECT * FROM potion_orders WHERE id = ?', [id], (err: Error | null, row: any) => {
          if (err) {
            reject(new Error('Failed to update potion order status'));
            return;
          }
          if (!row) {
            reject(new Error(`Potion order with id ${id} not found`));
            return;
          }
          resolve(row);
        });
      });
    },

    updatePotionOrderAlchemist: (_: any, { id, assigned_alchemist }: { id: string; assigned_alchemist: string }) => {
      return new Promise((resolve, reject) => {
        db.get(
          'UPDATE potion_orders SET assigned_alchemist = ? WHERE id = ? RETURNING *',
          [assigned_alchemist, id],
          (err: Error | null, row: any) => {
            if (err) {
              reject(new Error('Failed to update potion order alchemist'));
              return;
            }
            if (!row) {
              reject(new Error(`Potion order with id ${id} not found`));
              return;
            }
            resolve(row);
          }
        );
      });
    },
  },
};
