import time
from typing import Optional, List

import strawberry
from strawberry.fastapi import GraphQLRouter
from strawberry.schema.config import StrawberryConfig

from src.constants import VALID_STATUSES
from src.database.init import get_db


@strawberry.type
class PotionOrder:
    id: strawberry.ID
    customer_name: str
    location: str
    potion: str
    assigned_alchemist: str
    status: str
    notes: Optional[str] = None


@strawberry.input
class PotionOrderFilter:
    status: Optional[str] = None
    assigned_alchemist: Optional[str] = None


@strawberry.input
class PotionOrderInput:
    customer_name: str
    location: str
    potion: str
    assigned_alchemist: str
    notes: Optional[str] = None


def row_to_potion_order(row) -> PotionOrder:
    """Convert a database row to a PotionOrder instance."""
    return PotionOrder(
        id=strawberry.ID(row['id']),
        customer_name=row['customer_name'],
        location=row['location'],
        potion=row['potion'],
        assigned_alchemist=row['assigned_alchemist'],
        status=row['status'],
        notes=row['notes'],
    )


@strawberry.type
class Query:
    @strawberry.field
    def potionOrders(self, filter: Optional[PotionOrderFilter] = None) -> List[PotionOrder]:
        db = get_db()
        cursor = db.cursor()

        query = 'SELECT * FROM potion_orders'
        conditions = []
        values = []

        if filter:
            if filter.status is not None:
                conditions.append('status = ?')
                values.append(filter.status)
            if filter.assigned_alchemist is not None:
                conditions.append('assigned_alchemist = ?')
                values.append(filter.assigned_alchemist)

        if conditions:
            query += ' WHERE ' + ' AND '.join(conditions)

        cursor.execute(query, values)
        rows = cursor.fetchall()
        return [row_to_potion_order(row) for row in rows]

    @strawberry.field
    def potionOrder(self, id: strawberry.ID) -> Optional[PotionOrder]:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT * FROM potion_orders WHERE id = ?', (str(id),))
        row = cursor.fetchone()
        if not row:
            return None
        return row_to_potion_order(row)


@strawberry.type
class Mutation:
    @strawberry.mutation
    def addPotionOrder(self, input: PotionOrderInput) -> PotionOrder:
        db = get_db()
        cursor = db.cursor()

        order_id = str(int(time.time() * 1000))

        cursor.execute(
            'INSERT INTO potion_orders (id, customer_name, location, potion, assigned_alchemist, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (order_id, input.customer_name, input.location, input.potion, input.assigned_alchemist, 'To Do', input.notes)
        )
        db.commit()

        cursor.execute('SELECT * FROM potion_orders WHERE id = ?', (order_id,))
        row = cursor.fetchone()
        return row_to_potion_order(row)

    @strawberry.mutation
    def updatePotionOrderStatus(self, id: strawberry.ID, status: str) -> Optional[PotionOrder]:
        if status not in VALID_STATUSES:
            raise ValueError(f"Invalid status: '{status}'. Must be one of: {VALID_STATUSES}")

        db = get_db()
        cursor = db.cursor()

        cursor.execute('SELECT * FROM potion_orders WHERE id = ?', (str(id),))
        row = cursor.fetchone()

        if not row:
            return None

        return row_to_potion_order(row)

    @strawberry.mutation
    def updatePotionOrderAlchemist(self, id: strawberry.ID, assigned_alchemist: str) -> Optional[PotionOrder]:
        """Update the assigned alchemist for a potion order."""
        db = get_db()
        cursor = db.cursor()

        cursor.execute(
            'UPDATE potion_orders SET assigned_alchemist = ? WHERE id = ? RETURNING *',
            (assigned_alchemist, str(id))
        )
        row = cursor.fetchone()
        db.commit()

        if not row:
            return None

        return row_to_potion_order(row)


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    config=StrawberryConfig(auto_camel_case=False),
)

graphql_router = GraphQLRouter(schema)
