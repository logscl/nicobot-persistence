export class BaseDAO {
	public handleDatabaseError(err: any) : object {
		console.log("[BaseDAO] Error from database : " + err);
		
		return {
			layer: 'database',
			message: err.code
		};
	}
}