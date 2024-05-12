// TODO: Deduplicate with `server/src/services/entity_changes_interface.ts`
export interface EntityChange {
	id?: number | null;
	noteId?: string;
	entityName: string;
	entityId: string;
	entity?: unknown; // TODO: changed from any to unknown
	positions?: Record<string, number>;
	hash: string;
	utcDateChanged?: string;
	utcDateModified?: string;
	utcDateCreated?: string;
	isSynced: boolean | 1 | 0;
	isErased: boolean | 1 | 0;
	componentId?: string | null;
	changeId?: string | null;
	instanceId?: string | null;
}