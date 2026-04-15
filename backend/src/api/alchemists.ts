import { Router, Request, Response } from 'express';
import { db } from '../database/init';

const router = Router();

// GET /alchemists — list all alchemists
router.get('/alchemists', (_req: Request, res: Response) => {
  db.all(
    'SELECT name, profile_image FROM alchemist_profiles',
    [],
    (err, rows) => {
      if (err) {
        console.error('Error fetching alchemists:', err);
        return res.status(500).json({ error: 'Failed to fetch alchemists' });
      }
      res.json(rows);
    }
  );
});

// GET /alchemist/:name — get alchemist profile with potions_completed count
router.get('/alchemist/:name', (req: Request, res: Response) => {
  const { name } = req.params;

  db.get(
    'SELECT * FROM alchemist_profiles WHERE name = ?',
    [name],
    (err, alchemist: any) => {
      if (err) {
        console.error('Error fetching alchemist:', err);
        return res.status(500).json({ error: 'Failed to fetch alchemist' });
      }
      if (!alchemist) {
        return res.status(404).json({ error: 'Alchemist not found' });
      }

      db.get(
        `SELECT COUNT(*) as potions_completed FROM potion_orders
         WHERE assigned_alchemist = ? AND status = 'Ready for Pickup'`,
        [name],
        (err2, countResult: any) => {
          if (err2) {
            console.error('Error counting potions:', err2);
            return res.status(500).json({ error: 'Failed to count potions' });
          }

          res.json({
            ...alchemist,
            potions_completed: countResult.potions_completed
          });
        }
      );
    }
  );
});

// POST /alchemist — create a new alchemist
router.post('/alchemist', (req: Request, res: Response) => {
  const { name, service_start_date, profile_image } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const startDate = service_start_date || new Date().toISOString().split('T')[0];

  db.run(
    `INSERT INTO alchemist_profiles (name, service_start_date, profile_image)
     VALUES (?, ?, ?)`,
    [name, startDate, profile_image || null],
    function (err) {
      if (err) {
        console.error('Error creating alchemist:', err);
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(409).json({ error: 'Alchemist with this name already exists' });
        }
        return res.status(500).json({ error: 'Failed to create alchemist' });
      }

      db.get(
        'SELECT * FROM alchemist_profiles WHERE id = ?',
        [this.lastID],
        (err2, row) => {
          if (err2) {
            console.error('Error fetching created alchemist:', err2);
            return res.status(500).json({ error: 'Failed to fetch created alchemist' });
          }
          res.status(201).json(row);
        }
      );
    }
  );
});

// PUT /alchemist/:name — update an alchemist
router.put('/alchemist/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  const { service_start_date, profile_image } = req.body;

  const updates: string[] = [];
  const values: any[] = [];

  if (service_start_date !== undefined) {
    updates.push('service_start_date = ?');
    values.push(service_start_date);
  }
  if (profile_image !== undefined) {
    updates.push('profile_image = ?');
    values.push(profile_image);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  values.push(name);

  db.run(
    `UPDATE alchemist_profiles SET ${updates.join(', ')} WHERE name = ?`,
    values,
    function (err) {
      if (err) {
        console.error('Error updating alchemist:', err);
        return res.status(500).json({ error: 'Failed to update alchemist' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Alchemist not found' });
      }

      db.get(
        'SELECT * FROM alchemist_profiles WHERE name = ?',
        [name],
        (err2, row: any) => {
          if (err2) {
            console.error('Error fetching updated alchemist:', err2);
            return res.status(500).json({ error: 'Failed to fetch updated alchemist' });
          }

          db.get(
            `SELECT COUNT(*) as potions_completed FROM potion_orders
             WHERE assigned_alchemist = ? AND status = 'Ready for Pickup'`,
            [name],
            (err3, countResult: any) => {
              if (err3) {
                return res.status(500).json({ error: 'Failed to count potions' });
              }
              res.json({
                ...row,
                potions_completed: countResult.potions_completed
              });
            }
          );
        }
      );
    }
  );
});

export default router;
